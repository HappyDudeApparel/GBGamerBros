#!/usr/bin/env python3
"""Source-faithful web derivative of the GB GAMER BROS(tm) logo WITHOUT the obsolete embedded
copyright strip.  Crop-only: no pixel inside the kept region is repainted, resized or re-drawn.

    python3 tools/make_clean_logo.py <logo.(png|webp)> <out-stem>

The logo art ends in a fully transparent gap; the obsolete credit line sits below that gap.
The script finds the gap, keeps the art plus a few transparent rows, and refuses to run if
the cut would touch visible art (so it is safe to point at a high-resolution master).
Writes <out-stem>.webp (lossless) and <out-stem>.png.  The input file is never modified.
"""
import sys
import numpy as np
from PIL import Image

src, stem = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
alpha = np.array(im)[:, :, 3]
h = alpha.shape[0]
rowmax = alpha.max(axis=1)
solid = np.where(rowmax > 200)[0]           # rows holding opaque logo pixels
art_bottom = int(solid.max())               # last opaque row of the wordmark
# the first fully transparent run below the art ends the logo; the credit strip starts after it
gap = [y for y in range(art_bottom + 1, h) if rowmax[y] < 4]
if not gap:
    sys.exit("no transparent gap below the artwork; inspect the file manually")
pad = max(2, round(h * 0.008))
cut = min(art_bottom + 1 + pad, gap[-1] + 1 if len(gap) < pad else gap[pad - 1] + 1)
if rowmax[art_bottom + 1:cut].max() >= 4:
    sys.exit("cut would include non-transparent pixels; inspect the file manually")
out = im.crop((0, 0, im.width, cut))
out.save(stem + ".png", optimize=True)
out.save(stem + ".webp", lossless=True, exact=True, quality=100, method=6)
print(f"{src}: {im.width}x{h} -> {out.width}x{cut}  (last opaque row {art_bottom}, removed rows {cut}..{h - 1})")
