#!/usr/bin/env python3
"""Remove the tiny baked legacy copyright line that sits below the feet in the character cutouts (Meet the Team).

    python3 tools/clean_character_footers.py            # all staging/assets/characters/*/*.webp

Each cutout is a transparent figure followed by a short gap of empty rows and then one line of tiny text. Rows below that gap are made fully
transparent; the figure (everything above the gap) is not touched. Files are re-stamped with the current rights metadata (gbmedia.py stamp).
"""
import glob, os, subprocess, sys
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = os.path.join(REPO, "staging/assets/characters")
GBMEDIA = os.path.join(REPO, "staging/tools/gbmedia.py")


def cut_row(alpha):
    h = alpha.shape[0]
    cnt = (alpha > 24).sum(axis=1)
    y = h - 1
    seen_text = False
    while y > h - 60 and y > 0:            # walk up from the bottom through the text line
        if cnt[y] > 0:
            seen_text = True
            y -= 1
            continue
        gap = 0
        while y - gap >= 0 and cnt[y - gap] == 0 and gap < 10:
            gap += 1
        if seen_text and gap >= 3:
            return y - gap + 1            # first empty row of the gap: clear from here down
        y -= 1
    return None


def main():
    changed = []
    for f in sorted(glob.glob(os.path.join(CH, "*", "*.webp"))):
        im = Image.open(f).convert("RGBA")
        a = np.asarray(im).copy()
        y = cut_row(a[..., 3])
        if y is None or y >= a.shape[0] - 1:
            continue
        below = a[y:, :, 3]
        if below.max() == 0:
            continue
        a[y:, :, 3] = 0
        Image.fromarray(a, "RGBA").save(f, "WEBP", quality=90, method=6, lossless=False, exact=True)
        changed.append(f)
    if changed:
        subprocess.check_call([sys.executable, GBMEDIA, "stamp"] + changed)
    print("cleaned", len(changed), "of", len(glob.glob(os.path.join(CH, "*", "*.webp"))))


if __name__ == "__main__":
    main()
