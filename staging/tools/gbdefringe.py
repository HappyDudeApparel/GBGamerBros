#!/usr/bin/env python3
"""GB GAMER BROS™ — remove white-matte halos from transparent public derivatives.

Edge pixels of cutouts exported against white carry white mixed into their colour, which
shows as a pale fringe on coloured cards. For every partly transparent pixel this removes the
white contribution (colour = (c - 255·(1-α)) / α) and slightly tightens near-invisible pixels.
The copyright band rows are left untouched; metadata is re-embedded via gbmedia.save().

  python3 staging/tools/gbdefringe.py <file.webp> [...]      # in place
  python3 staging/tools/gbdefringe.py --all                    # every alpha image in media-manifest.js
"""
import json, os, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gbmedia  # noqa: E402

def defringe(path, band):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    for y in range(h - band):
        for x in range(w):
            r, g, b, a = px[x, y]
            if 0 < a < 255:
                f = a / 255
                un = lambda c: max(0, min(255, round((c - 255 * (1 - f)) / f)))
                na = a if a > 60 else round(a * 0.7)
                px[x, y] = (un(r), un(g), un(b), na)
    gbmedia.save(im, path, quality=92)

def main(args):
    t = open(gbmedia.MANIFEST, encoding="utf-8").read()
    m = json.loads(t[t.index("{"): t.rindex("}") + 1])
    if args == ["--all"]:
        targets = [k for k, e in m.items() if e.get("alpha")]
    else:
        targets = [os.path.relpath(os.path.abspath(a), gbmedia.STAGING).replace(os.sep, "/").rsplit(".", 1)[0].removesuffix("-960") for a in args]
    for k in dict.fromkeys(targets):
        e = m[k]
        defringe(os.path.join(gbmedia.STAGING, k + ".webp"), e["band"])
        if e["sw"] < e["w"]:
            defringe(os.path.join(gbmedia.STAGING, k + "-960.webp"), e["sband"])
        print("defringed", k)

if __name__ == "__main__":
    if not sys.argv[1:]:
        raise SystemExit(__doc__)
    main(sys.argv[1:])
