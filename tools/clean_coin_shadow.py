#!/usr/bin/env python3
"""Remove the baked ground-shadow "puddle" and the tiny legacy footer line below the gold GB coin renders.

    python3 tools/clean_coin_shadow.py        # staging/assets/objects/coin.webp and coin-back.webp (full and -960)

The coin is saturated gold; the puddle under it is a pale peach smear. In each column, from the lower rim down, the first pixel that is no
longer saturated gold (or anything below the coin's lowest rim row) is made transparent, together with everything under it. The coin face and
rim above are untouched. The bottom edge is softened by one pixel. Re-stamped with the current rights metadata.
"""
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OBJ = os.path.join(REPO, "staging/assets/objects")
GBMEDIA = os.path.join(REPO, "staging/tools/gbmedia.py")


def clean(path):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).copy()
    h, w, _ = a.shape
    f = a[..., :3].astype(float) / 255
    mx, mn = f.max(axis=2), f.min(axis=2)
    S = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    cnt = (a[..., 3] > 20).sum(axis=1)
    lo, hi = int(h * 0.88), int(h * 0.96)
    rim = lo + int(np.argmin(cnt[lo:hi]))              # lowest row of the coin: the puddle is wider than the coin below this
    start = int(h * 0.88) - 6
    alpha = a[..., 3].copy()
    for x in range(w):
        for y in range(start, h):
            if y >= rim + 2 or (alpha[y, x] > 20 and S[y, x] < 0.50):
                alpha[y:, x] = 0
                break
    alpha = np.asarray(Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.7)))
    a[..., 3] = np.minimum(alpha, a[..., 3])
    Image.fromarray(a, "RGBA").save(path, "WEBP", quality=92, method=6, exact=True)
    return rim


def main():
    files = []
    for n in ("coin", "coin-back"):
        for suf in ("", "-960"):
            p = os.path.join(OBJ, n + suf + ".webp")
            print(os.path.basename(p), "rim row", clean(p)); files.append(p)
    subprocess.check_call([sys.executable, GBMEDIA, "stamp"] + files)


if __name__ == "__main__":
    main()
