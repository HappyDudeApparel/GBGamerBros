#!/usr/bin/env python3
"""Card-ready derivative of a transparent enemy cutout (crop-only + alpha-aware edge soften).

    python3 tools/make_enemy_card_cutout.py SRC.webp OUT.webp --band 14

Why: some cutouts end in a semi-transparent smoke/ground shadow that is sliced flat by the image edge. On a card
that slice shows as a grey rectangle over the title panel. This tool
  * drops the copyright overscan band (crop only),
  * fades ONLY semi-transparent pixels (alpha < 250) over the last 14 % of the picture to zero, so the shadow dissolves,
  * leaves every opaque pixel (rock, feet, crystals) bit-identical,
  * adds 3 % transparent padding below the last row.
The source file is never modified. Output is WebP quality 90 with lossless alpha (small enough for phones; the alpha edge is exact).
"""
import sys, argparse
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("out"); ap.add_argument("--band", type=int, default=0)
ap.add_argument("--feather", type=float, default=0.14)
a = ap.parse_args()
im = Image.open(a.src).convert("RGBA")
H = im.height - a.band
arr = np.array(im.crop((0, 0, im.width, H)))
alpha = arr[:, :, 3].astype(np.float32)
fh = max(2, int(H * a.feather))
before_opaque = arr[:, :, 3] >= 250
for y in range(H - fh, H):
    t = (y - (H - fh)) / fh                      # 0 -> 1 towards the bottom edge
    f = 1 - (t * t * (3 - 2 * t))                # smoothstep fade
    row = alpha[y]
    soft = row < 250
    row[soft] *= f
arr[:, :, 3] = alpha.astype(np.uint8)
assert (arr[:, :, 3][before_opaque] >= 250).all(), "an opaque pixel was altered"
pad = round(H * 0.03)
out = np.zeros((H + pad, im.width, 4), np.uint8); out[:H] = arr
Image.fromarray(out, "RGBA").save(a.out, "WEBP", quality=90, alpha_quality=100, method=6)
print(f"{a.src} -> {a.out}: {im.width}x{H + pad} (band {a.band} cropped, opaque pixels unchanged)")
