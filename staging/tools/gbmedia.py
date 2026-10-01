#!/usr/bin/env python3
"""GB GAMER BROS™ — public media pipeline.

build   Turn a master image into public web derivatives:
          * extra canvas below the image (the "copyright overscan band") carrying a
            faint pixel-level copyright line; the composition itself is not altered
          * rights metadata (XMP incl. IPTC Core / Dublin Core / xmpRights, plus EXIF)
          * full-size and 960 px WebP derivatives
          * an entry in media-manifest.js (content size + band size) so the page can
            always crop the band, whatever the image's proportions
stamp   Embed rights metadata into an existing raster (no band; for transparent
        brand cutouts, logos and UI art that is not presented through the media frame).
verify  Read every public raster back from disk and confirm the metadata survived,
        and that banded derivatives really contain the band.

Usage:
  python3 tools/gbmedia.py build <master.png> <out/base/path/without-ext>
  python3 tools/gbmedia.py stamp <file.webp|png|jpg> [...]
  python3 tools/gbmedia.py verify            # run from the staging/ folder

Metadata can be removed by third-party software; the pixel band exists for that reason,
and neither layer is tamper-proof.
"""
import json, os, re, struct, sys, glob
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

NOTICE = "2026 Copyright © GB Gamer Bros™ x Happy Dude®. All Rights Reserved."
CREATOR = "GB Gamer Bros™ x Happy Dude®"
TERMS = "All Rights Reserved."
BAND_RATIO = 0.018          # band height as a share of image width
SMALL_W = 960
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
HERE = os.path.dirname(os.path.abspath(__file__))
STAGING = os.path.dirname(HERE)
MANIFEST = os.path.join(STAGING, "media-manifest.js")

XMP = f"""<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmpRights:Marked="True"
    photoshop:Credit="{CREATOR}"
    photoshop:Copyright="{NOTICE}">
   <dc:creator><rdf:Seq><rdf:li>{CREATOR}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">{NOTICE}</rdf:li></rdf:Alt></dc:rights>
   <xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="x-default">{TERMS}</rdf:li></rdf:Alt></xmpRights:UsageTerms>
   <Iptc4xmpCore:CreatorContactInfo rdf:parseType="Resource"/>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>""".encode("utf-8")


# EXIF text tags are ASCII-only, so they carry an ASCII rendering of the notice.
# The exact Unicode notice lives in XMP (dc:rights) and in the Windows UTF-16 XP* tags.
NOTICE_ASCII = "2026 Copyright (c) GB Gamer Bros(TM) x Happy Dude(R). All Rights Reserved."
CREATOR_ASCII = "GB Gamer Bros(TM) x Happy Dude(R)"


def exif():
    e = Image.Exif()
    e[0x013B] = CREATOR_ASCII                 # Artist
    e[0x8298] = NOTICE_ASCII                  # Copyright
    e[0x010E] = f"{NOTICE_ASCII} Rights: Copyrighted. {TERMS}"   # ImageDescription
    e[0x9C9D] = (CREATOR + "\0").encode("utf-16-le")             # XPAuthor (exact)
    e[0x9C9C] = (NOTICE + "\0").encode("utf-16-le")              # XPComment (exact)
    return e


def save(im, path, quality=84):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".webp":
        im.save(path, "WEBP", quality=quality, method=6, xmp=XMP, exif=exif())
    elif ext in (".jpg", ".jpeg"):
        im.convert("RGB").save(path, "JPEG", quality=quality, optimize=True, xmp=XMP, exif=exif())
    elif ext == ".png":
        info = PngImagePlugin.PngInfo()
        info.add_itxt("XML:com.adobe.xmp", XMP.decode("utf-8"))
        info.add_itxt("Copyright", NOTICE)
        info.add_itxt("Author", CREATOR)
        info.add_itxt("Disclaimer", TERMS)
        im.save(path, "PNG", pnginfo=info, exif=exif(), optimize=True)
    else:
        raise SystemExit(f"unsupported format: {path}")


def add_band(content, alpha=False):
    """Return content + band canvas. The band is extra canvas; content pixels are untouched.
    alpha=True (transparent cutouts): the band stays transparent and only the faint
    notice text is drawn into it, so no solid bar is added to the file."""
    w, h = content.size
    band = max(14, round(w * BAND_RATIO))
    font = ImageFont.truetype(FONT, max(9, int(band * 0.56)))
    if alpha:
        out = Image.new("RGBA", (w, h + band), (0, 0, 0, 0))
        out.paste(content.convert("RGBA"), (0, 0))
        fg = (120, 132, 150, 120)       # mid grey, low alpha: faint on light or dark backgrounds
    else:
        out = Image.new("RGB", (w, h + band))
        out.paste(content.convert("RGB"), (0, 0))
        # band tone: the image's own bottom edge, darkened, so the strip reads as part of the file
        edge = content.convert("RGB").crop((0, h - 4, w, h)).resize((1, 1), Image.BOX).getpixel((0, 0))
        bg = tuple(int(c * 0.35) for c in edge)
        fg = tuple(min(255, c + 70) for c in bg)  # faint: low contrast against the band
        ImageDraw.Draw(out).rectangle((0, h, w, h + band), fill=bg)
    d = ImageDraw.Draw(out)
    tw = d.textlength(NOTICE, font=font)
    if tw > w * 0.96:                    # narrow cutouts: shrink the line to fit
        font = ImageFont.truetype(FONT, max(6, int(font.size * w * 0.96 / tw)))
        tw = d.textlength(NOTICE, font=font)
    d.text(((w - tw) / 2, h + band / 2), NOTICE, fill=fg, font=font, anchor="lm")
    return out, band


def load_manifest():
    if not os.path.exists(MANIFEST):
        return {}
    txt = open(MANIFEST, encoding="utf-8").read()
    return json.loads(txt[txt.index("{"): txt.rindex("}") + 1])


def write_manifest(m):
    body = json.dumps(dict(sorted(m.items())), indent=1, ensure_ascii=False)
    open(MANIFEST, "w", encoding="utf-8").write(
        "// Generated by tools/gbmedia.py — do not edit by hand.\n"
        "// w/h = content image (what layouts and hotspots use); band = copyright overscan below it.\n"
        f"window.GB_MEDIA = {body};\n")


def build(master, base, small_w=SMALL_W):
    src = Image.open(master)
    alpha = src.mode in ("RGBA", "LA") or (src.mode == "P" and "transparency" in src.info)
    content = src.convert("RGBA" if alpha else "RGB")
    w, h = content.size
    os.makedirs(os.path.dirname(base), exist_ok=True)
    full, band = add_band(content, alpha)
    save(full, base + ".webp", quality=92 if alpha else 84)
    sw = min(small_w, w)
    sh = round(h * sw / w)
    small, sband = add_band(content.resize((sw, sh), Image.LANCZOS), alpha)
    save(small, base + "-960.webp", quality=92 if alpha else 82)
    key = os.path.relpath(base, STAGING).replace(os.sep, "/")
    m = load_manifest()
    m[key] = {"w": w, "h": h, "band": band, "sw": sw, "sh": sh, "sband": sband,
              "alpha": alpha, "master": os.path.basename(master)}
    write_manifest(m)
    print(f"built {key}: content {w}x{h} + band {band}px; small {sw}x{sh} + {sband}px{' (transparent band)' if alpha else ''}")


def _chunk(cid, payload):
    return cid + struct.pack("<I", len(payload)) + payload + (b"\0" if len(payload) & 1 else b"")


def inject_webp(path):
    """Write XMP + EXIF chunks into an existing WebP without re-encoding its pixels."""
    data = open(path, "rb").read()
    chunks, i = [], 12
    while i + 8 <= len(data):
        cid = data[i:i + 4]
        size = struct.unpack("<I", data[i + 4:i + 8])[0]
        chunks.append((cid, data[i + 8:i + 8 + size]))
        i += 8 + size + (size & 1)
    chunks = [c for c in chunks if c[0] not in (b"EXIF", b"XMP ")]
    ids = [c[0] for c in chunks]
    if b"ANIM" in ids:
        raise SystemExit(f"animated WebP not supported: {path}")
    if b"VP8X" in ids:
        k = ids.index(b"VP8X")
        vp8x = bytearray(chunks[k][1])
    else:
        im = Image.open(path)
        w, h = im.size
        alpha = False
        if b"VP8L" in ids:
            bits = struct.unpack("<I", chunks[ids.index(b"VP8L")][1][1:5])[0]
            alpha = bool(bits >> 28 & 1)
        vp8x = bytearray(10)
        vp8x[0] = 0x10 if alpha else 0
        vp8x[4:7] = (w - 1).to_bytes(3, "little")
        vp8x[7:10] = (h - 1).to_bytes(3, "little")
        chunks.insert(0, (b"VP8X", bytes(vp8x)))
        k = 0
    vp8x[0] |= 0x08 | 0x04            # EXIF + XMP present
    chunks[k] = (b"VP8X", bytes(vp8x))
    exif_bytes = exif().tobytes()
    chunks += [(b"EXIF", exif_bytes), (b"XMP ", XMP)]
    body = b"WEBP" + b"".join(_chunk(c, d) for c, d in chunks)
    open(path, "wb").write(b"RIFF" + struct.pack("<I", len(body)) + body)


def stamp(paths):
    for p in paths:
        if p.lower().endswith(".webp"):
            inject_webp(p)                      # metadata only; pixels untouched
        else:
            im = Image.open(p)
            im.load()
            save(im, p, quality=92)
        print("stamped", p)


# ---------- verification (reads files back from disk) ----------
def riff_chunks(path):
    data = open(path, "rb").read()
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        return {}
    out, i = {}, 12
    while i + 8 <= len(data):
        cid = data[i:i + 4]
        size = struct.unpack("<I", data[i + 4:i + 8])[0]
        out[cid] = data[i + 8:i + 8 + size]
        i += 8 + size + (size & 1)
    return out


def check_file(path, manifest):
    problems = []
    raw = open(path, "rb").read()
    ext = os.path.splitext(path)[1].lower()
    if ext == ".webp":
        ch = riff_chunks(path)
        xmp = ch.get(b"XMP ", b"")
        if b"xmpRights:Marked" not in xmp:
            problems.append("no XMP chunk")
        if b"EXIF" not in ch:
            problems.append("no EXIF chunk")
    elif b"xmpRights:Marked" not in raw:
        problems.append("no XMP packet")
    if NOTICE.encode("utf-8") not in raw:
        problems.append("notice text not found in file bytes")
    im = Image.open(path)
    ex = im.getexif()
    if (ex.get(0x8298) or "") != NOTICE_ASCII:
        problems.append("EXIF Copyright missing/mismatch")
    xp = ex.get(0x9C9C)
    if not xp or bytes(xp).decode("utf-16-le").rstrip("\0") != NOTICE:
        problems.append("EXIF XPComment missing/mismatch")
    if "<rdf:li xml:lang=\"x-default\">" + NOTICE not in raw.decode("utf-8", "ignore"):
        problems.append("XMP dc:rights does not hold the exact notice")
    # banded derivatives: file must be taller than its content by exactly the band
    rel = os.path.relpath(path, STAGING).replace(os.sep, "/")
    base = re.sub(r"(-960)?\.webp$", "", rel)
    if base in manifest:
        e = manifest[base]
        small = rel.endswith("-960.webp")
        cw, ch_, b = (e["sw"], e["sh"], e["sband"]) if small else (e["w"], e["h"], e["band"])
        if im.size != (cw, ch_ + b):
            problems.append(f"size {im.size} != content {cw}x{ch_} + band {b}")
    return problems


def verify():
    manifest = load_manifest()
    files = sorted(f for f in glob.glob(os.path.join(STAGING, "assets", "**", "*"), recursive=True)
                   if os.path.splitext(f)[1].lower() in (".webp", ".png", ".jpg", ".jpeg"))
    bad = 0
    for f in files:
        p = check_file(f, manifest)
        rel = os.path.relpath(f, STAGING)
        print(("FAIL " if p else "ok   ") + rel + ("  -> " + "; ".join(p) if p else ""))
        bad += bool(p)
    print(f"\n{len(files) - bad}/{len(files)} public rasters carry rights metadata"
          f"{'' if not bad else f'; {bad} FAILED'}")
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cmd = sys.argv[1]
    if cmd == "build" and len(sys.argv) == 4:
        build(sys.argv[2], sys.argv[3])
    elif cmd == "stamp" and len(sys.argv) > 2:
        stamp(sys.argv[2:])
    elif cmd == "verify":
        sys.exit(verify())
    else:
        raise SystemExit(__doc__)
