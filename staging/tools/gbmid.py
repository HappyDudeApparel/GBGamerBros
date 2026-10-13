#!/usr/bin/env python3
"""GB GAMER BROS™ — add a mid-size (720 px) mobile tier to existing banded derivatives.

  python3 staging/tools/gbmid.py <media-key> [...] [--w 720]

Source = the image's approved full-size public derivative (content area only; the copyright band is re-made
at the new width by gbmedia.add_band). Writes <key>-720.webp and adds "mw","mh","mband" to media-manifest.js;
tools/revision.py stamps "mrev". Pixels are only resized (LANCZOS) — no sharpening, no regeneration.
Used for Fast Travel portals so 2–3x phones get a ~2x-density file instead of the 1254–1672 px full image.
"""
import json, os, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gbmedia  # noqa: E402
STAGING = os.path.dirname(HERE)
MAN = os.path.join(STAGING, "media-manifest.js")

def main(args):
    W = int(args[args.index("--w") + 1]) if "--w" in args else 720
    keys = [a for a in args if not a.startswith("--") and not a.isdigit()]
    t = open(MAN, encoding="utf-8").read()
    i = t.index("window.GB_MEDIA = ")
    m = json.loads(t[i + 18:].rstrip().rstrip(";"))
    for k in keys:
        e = m[k]
        if e.get("alpha"):
            raise SystemExit(f"{k}: transparent cutouts are not supported here")
        full = Image.open(os.path.join(STAGING, f"{k}.webp")).convert("RGB").crop((0, 0, e["w"], e["h"]))
        h = round(e["h"] * W / e["w"])
        mid = full.resize((W, h), Image.LANCZOS)
        out, band = gbmedia.add_band(mid)
        gbmedia.save(out, os.path.join(STAGING, f"{k}-{W}.webp"), quality=80)
        e.update({"mw": W, "mh": h, "mband": band})
        print(f"{k}-{W}.webp  {W}x{h}+{band}  {os.path.getsize(os.path.join(STAGING, f'{k}-{W}.webp')) // 1024} KB")
    open(MAN, "w", encoding="utf-8").write(t[:i] + "window.GB_MEDIA = " + json.dumps(m, indent=1, ensure_ascii=False) + ";\n")

if __name__ == "__main__":
    main(sys.argv[1:]) if len(sys.argv) > 1 else print(__doc__)
