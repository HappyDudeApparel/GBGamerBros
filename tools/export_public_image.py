#!/usr/bin/env python3
"""GB GAMER BROS(tm) — non-destructive public image export (STAGE 2 PROPOSAL, not wired into publishing).

Reads a SOURCE image, never writes to it, and writes optimised public derivatives with
  * a discreet, inside-the-picture visible mark ("HAPPY DUDE(R)", brand typeface, low opacity),
  * rights metadata (XMP: Dublin Core / xmpRights / IPTC Core / PLUS licensor / photoshop credit, plus EXIF),
  * a full-size and a 960 px variant, each carrying the same metadata,
  * a JSON audit record (source hash, parameters, mark position, output hashes, read-back verification).

  python3 tools/export_public_image.py --src SRC --out OUT_STEM --title "Gamer Bro Blue - sporty pose"
        [--band N]            crop N px of old overscan band off the bottom first (only needed for existing
                              derivatives; a real master has no band)
        [--mark-width 0.14]   mark width as a share of content width (min 96 px)
        [--secondary]         add a fainter second mark at the opposite corner (crop resilience)
        [--no-mark]           metadata only

Safety rules enforced in code: output must differ from the source, must not be inside staging/assets/,
and the source file is opened read-only. Metadata never contains a personal name, address, private contact or AI-method claim.

Limits (also stated on the Rights page): a visible mark can be cropped or inpainted and metadata can be stripped by
third-party software. Neither prevents copying and neither obliges any search/AI service to credit the owner.
"""
import argparse, hashlib, io, json, os, sys, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

try:
    import numpy as np
except ImportError:
    np = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTICE = "© 2026 HAPPY DUDE®. All rights reserved."
CREATOR = "HAPPY DUDE®"
CREDIT = "A HAPPY DUDE® Original"
SOURCE_LINE = "GB GAMER BROS™ — ADVENTURE MOUNTAIN™"
RIGHTS_URL = "https://gb.happydude.ca/staging/rights.html"   # switch to the production URL when staging is promoted
BUSINESS_URL = "https://happydude.ca/"
BUSINESS_EMAIL = "info@happydude.ca"                          # the only owner-approved public contact
USAGE_TERMS = "All rights reserved. Do not reproduce or redistribute without permission; see the Rights & IP page for reuse requests and credit."
MARK_TEXT = "HAPPY DUDE®"
SMALL_W = 960
# Owner privacy rule: no personal identifiers in public files. No names are stored here; add private terms at run time
# with GB_PRIVATE_TERMS="term1,term2". Generic check: any email other than the approved business contact.
FORBIDDEN = tuple(x.strip().lower() for x in os.environ.get("GB_PRIVATE_TERMS", "").split(",") if x.strip())
import re
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}")
FONT_WOFF2 = os.path.join(ROOT, "staging/assets/fonts/rubik-latin.woff2")


def brand_font(px):
    """Rubik (the site's typeface) Bold at px; converted from the shipped woff2 so no new font is introduced."""
    from fontTools.ttLib import TTFont
    ttf = os.path.join(tempfile.gettempdir(), "gb-rubik-latin.ttf")
    if not os.path.exists(ttf):
        f = TTFont(FONT_WOFF2); f.flavor = None; f.save(ttf)
    font = ImageFont.truetype(ttf, px)
    try:
        font.set_variation_by_axes([700])
    except Exception:
        pass
    return font


def xmp_packet(title):
    esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")
    return f"""<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmlns:plus="http://ns.useplus.org/ldf/xmp/1.0/"
    xmpRights:Marked="True"
    xmpRights:WebStatement="{RIGHTS_URL}"
    photoshop:Credit="{esc(CREDIT)}"
    photoshop:Source="{esc(SOURCE_LINE)}"
    photoshop:Copyright="{esc(NOTICE)}">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">{esc(title)}</rdf:li></rdf:Alt></dc:title>
   <dc:creator><rdf:Seq><rdf:li>{esc(CREATOR)}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">{esc(NOTICE)}</rdf:li></rdf:Alt></dc:rights>
   <xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="x-default">{esc(USAGE_TERMS)}</rdf:li></rdf:Alt></xmpRights:UsageTerms>
   <Iptc4xmpCore:CreatorContactInfo rdf:parseType="Resource">
    <Iptc4xmpCore:CiEmailWork>{BUSINESS_EMAIL}</Iptc4xmpCore:CiEmailWork>
    <Iptc4xmpCore:CiUrlWork>{BUSINESS_URL}</Iptc4xmpCore:CiUrlWork>
   </Iptc4xmpCore:CreatorContactInfo>
   <plus:Licensor><rdf:Seq><rdf:li rdf:parseType="Resource">
     <plus:LicensorName>{esc(CREATOR)}</plus:LicensorName>
     <plus:LicensorURL>{RIGHTS_URL}</plus:LicensorURL>
     <plus:LicensorEmail>{BUSINESS_EMAIL}</plus:LicensorEmail>
   </rdf:li></rdf:Seq></plus:Licensor>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>""".encode("utf-8")


def exif_block(title):
    # EXIF text tags are ASCII; exact Unicode text lives in XMP and the Windows XP* tags
    ascii_notice = "(c) 2026 HAPPY DUDE(R). All rights reserved."
    e = Image.Exif()
    e[0x013B] = "HAPPY DUDE(R)"                       # Artist
    e[0x8298] = ascii_notice                           # Copyright
    e[0x010E] = f"{title} - {ascii_notice}"            # ImageDescription
    e[0x9C9D] = (CREATOR + "\0").encode("utf-16-le")   # XPAuthor (exact)
    e[0x9C9C] = (NOTICE + "\0").encode("utf-16-le")    # XPComment (exact)
    return e


def content_box(im):
    """Bounding box of the real picture: opaque pixels for cutouts, the whole frame otherwise."""
    if im.mode == "RGBA" and np is not None:
        a = np.array(im)[:, :, 3]
        if (a < 250).mean() > 0.05:                    # genuinely transparent around the subject
            ys, xs = np.where(a > 16)
            return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1), True
    return (0, 0, im.width, im.height), False


def render_mark(width_px, opacity, dark=False):
    size = max(10, int(width_px / 6.9))               # first guess; then correct so the TEXT is width_px wide
    font = brand_font(size)
    probe0 = ImageDraw.Draw(Image.new("L", (10, 10)))
    tw = probe0.textlength(MARK_TEXT, font=font)
    size = max(10, round(size * width_px / tw))
    font = brand_font(size)
    pad = max(3, size // 5)
    probe = Image.new("L", (10, 10)); d0 = ImageDraw.Draw(probe)
    l, t, r, b = d0.textbbox((0, 0), MARK_TEXT, font=font)
    w, h = r - l + 2 * pad, b - t + 2 * pad
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).text((pad - l + max(1, size // 14), pad - t + max(1, size // 14)), MARK_TEXT, font=font, fill=((255, 255, 255) if dark else (0, 0, 0)) + (int(255 * opacity * (0.55 if dark else 0.75)),))
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(1, size / 14)))
    face = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(face).text((pad - l, pad - t), MARK_TEXT, font=font, fill=((18, 32, 66) if dark else (255, 255, 255)) + (int(255 * opacity),))
    return Image.alpha_composite(shadow, face)


def place(im, box, cutout, mark, corner="br", inset=0.05):
    """Top-left of the mark: inside the content box, inset from its edges (crop-safe).
    Cutouts: choose the spot with the most opaque pixels under the mark, nearest the chosen corner."""
    x0, y0, x1, y1 = box; bw, bh = x1 - x0, y1 - y0; mw, mh = mark.size
    ix, iy = int(bw * inset), int(bh * inset)
    if not cutout or np is None:
        x = x1 - ix - mw if corner[1] == "r" else x0 + ix
        y = y1 - iy - mh if corner[0] == "b" else y0 + iy
        return x, y
    a = np.array(im)[:, :, 3] > 200
    best, step = None, max(2, mh // 3)
    ys = range(y0 + iy, y1 - iy - mh + 1, step) if bh > mh + 2 * iy else [y0]
    xs = range(x0 + ix, x1 - ix - mw + 1, step) if bw > mw + 2 * ix else [x0]
    for y in ys:
        for x in xs:
            frac = a[y:y + mh, x:x + mw].mean()
            lowness = (y - y0) / bh if corner[0] == "b" else 1 - (y - y0) / bh
            rightness = (x - x0) / bw if corner[1] == "r" else 1 - (x - x0) / bw
            score = (frac >= 0.9, lowness * 0.6 + rightness * 0.4, frac)
            if best is None or score > best[0]:
                best = (score, x, y)
    return best[1], best[2]


def sha(path):
    return hashlib.sha256(open(path, "rb").read()).hexdigest()


def save(im, path, title, quality):
    kw = dict(quality=quality, method=6, xmp=xmp_packet(title), exif=exif_block(title))
    im.save(path, "WEBP", **kw)


def verify(path, title):
    im = Image.open(path)
    xmp = im.info.get("xmp", b"")
    xmp = xmp.decode("utf-8", "replace") if isinstance(xmp, bytes) else xmp
    ex = im.getexif()
    checks = {
        "xmp_notice": NOTICE in xmp, "xmp_rights_url": RIGHTS_URL in xmp, "xmp_credit": CREDIT in xmp,
        "xmp_title": title.replace("&", "&amp;") in xmp, "xmp_contact": BUSINESS_EMAIL in xmp,
        "exif_copyright": "HAPPY DUDE(R)" in str(ex.get(0x8298, "")),
        "no_personal_identifiers": not any(f in (xmp + str(dict(ex))).lower() for f in FORBIDDEN) and all(m.lower() == BUSINESS_EMAIL for m in EMAIL_RE.findall(xmp + str(dict(ex)))),
    }
    return checks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True); ap.add_argument("--out", required=True); ap.add_argument("--title", required=True)
    ap.add_argument("--band", type=int, default=0); ap.add_argument("--mark-width", type=float, default=0.14)
    ap.add_argument("--opacity", type=float, default=0.62); ap.add_argument("--secondary", action="store_true")
    ap.add_argument("--no-mark", action="store_true"); ap.add_argument("--quality", type=int, default=90)
    ap.add_argument("--category", default="")
    a = ap.parse_args()
    src, stem = os.path.abspath(a.src), os.path.abspath(a.out)
    if os.path.abspath(stem + ".webp") == src or os.path.commonpath([os.path.dirname(stem), os.path.join(ROOT, "staging/assets")]) == os.path.join(ROOT, "staging/assets"):
        sys.exit("refusing: output would overwrite the source or write into staging/assets/ (production art is replaced only after owner approval)")
    before = sha(src)
    im = Image.open(src); im.load()
    if a.band:
        im = im.crop((0, 0, im.width, im.height - a.band))        # crop-only: removes the old overscan band
    im = im.convert("RGBA")
    box, cutout = content_box(im)
    record = {"category": a.category, "source": os.path.relpath(src, ROOT) if src.startswith(ROOT) else src, "source_sha256": before,
              "content_px": [im.width, im.height], "content_box": list(box), "cutout": cutout, "band_cropped": a.band, "marks": []}
    out = im.copy()
    if not a.no_mark:
        bw = box[2] - box[0]
        mw = max(96, int(bw * a.mark_width))
        for i, (corner, op) in enumerate((("br", a.opacity),) + ((("tl", a.opacity * 0.55),) if a.secondary else ())):
            m0 = render_mark(mw if i == 0 else int(mw * 0.8), op)
            x, y = place(im, box, cutout, m0, corner)
            # tone: dark mark on bright areas, white on dark/mid areas (legible either way, still low-contrast enough to stay discreet)
            patch = np.array(im.convert("RGBA"))[y:y + m0.height, x:x + m0.width] if np is not None else None
            lum = float((patch[:, :, :3] * [0.2126, 0.7152, 0.0722]).sum(axis=2)[patch[:, :, 3] > 200].mean()) if patch is not None and (patch[:, :, 3] > 200).any() else 0.0
            dark = lum > 165
            m = render_mark(mw if i == 0 else int(mw * 0.8), op, dark)
            out.alpha_composite(m, (x, y))
            record["marks"].append({"corner": corner, "xy": [x, y], "size": list(m.size), "opacity": round(op, 2), "tone": "dark" if dark else "light", "luminance_under_mark": round(lum, 1),
                                    "inset_of_content_box": [round((x - box[0]) / (box[2] - box[0]), 3), round((y - box[1]) / (box[3] - box[1]), 3)]})
    has_alpha = cutout or (np is not None and np.array(out)[:, :, 3].min() < 255)
    final = out if has_alpha else out.convert("RGB")
    os.makedirs(os.path.dirname(stem), exist_ok=True)
    full, small = stem + ".webp", stem + "-960.webp"
    save(final, full, a.title, a.quality)
    sm = final if final.width <= SMALL_W else final.resize((SMALL_W, round(final.height * SMALL_W / final.width)), Image.LANCZOS)
    save(sm, small, a.title, a.quality)
    record["outputs"] = {os.path.basename(p): {"px": list(Image.open(p).size), "bytes": os.path.getsize(p), "sha256": sha(p), "metadata": verify(p, a.title)} for p in (full, small)}
    assert sha(src) == before, "source file changed!"
    record["source_unchanged"] = True
    ok = all(all(v["metadata"].values()) for v in record["outputs"].values())
    record["metadata_survived_all_variants"] = ok
    json.dump(record, open(stem + ".audit.json", "w"), indent=1, ensure_ascii=False)
    print(json.dumps({k: record[k] for k in ("source", "content_px", "cutout", "marks", "metadata_survived_all_variants")}, ensure_ascii=False))
    if not ok:
        sys.exit("metadata verification failed")


if __name__ == "__main__":
    main()
