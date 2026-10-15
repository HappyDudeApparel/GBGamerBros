#!/usr/bin/env python3
"""PATCHPAD(TM) colour versions (Red, Yellow, Purple) from the owner's 2026-10-15 second image wave.

    python3 tools/build_wave2_patchpad.py <directory containing the original image files>

The Blue version is the existing owner-selected hero (assets/gear/patchpad-hero). Originals are found by SHA-256 prefix and never modified.
The yellow and purple renders carry a small baked "PLAYER WEARABLE ECOSYSTEM" line under the title, which the owner has ruled out of public
use; it is removed from the derivative only (as is the baked footer strip at the bottom of each source, whose rows are replaced by a mirrored, softened continuation of the floor), by interpolating the plain gradient behind it column by column (no device pixels are touched).
All three renders have the line. Derivatives are built with staging/tools/gbmedia.py.
"""
import hashlib, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
# slot -> (sha256 prefix, remove the subtitle line?)
SLOTS = {
    # owner QA 2026-10-15: every colour on the BLUE studio background (like the approved Blue hero), not on a background matched to the pad
    "gear/patchpad-red": ("1d713cd54f04", True),
    "gear/patchpad-yellow": ("ee3a8b42ea5d", True),
    "gear/patchpad-purple": ("977d03f9e4be", True),
}
BAND = (203, 233)        # rows to rebuild (title ends ~y200; device starts well below)
FOOTER = 28             # height of the baked footer strip at the bottom of the source renders
COLS = (40, 445)         # columns spanned by the baked line


def clean(im):
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    y0, y1 = BAND
    top, bot = a[y0 - 2:y0, COLS[0]:COLS[1]].mean(axis=0), a[y1:y1 + 2, COLS[0]:COLS[1]].mean(axis=0)
    for y in range(y0, y1):
        t = (y - y0) / (y1 - y0)
        a[y, COLS[0]:COLS[1]] = top * (1 - t) + bot * t
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGB")


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    tmp = tempfile.mkdtemp(prefix="gb-pp-")
    for slot, (h, strip) in SLOTS.items():
        if h not in found:
            raise SystemExit(f"source for {slot} ({h}...) not found")
        im = Image.open(found[h]).convert("RGB")
        if strip:
            im = clean(im)
        im = im.crop((0, 0, im.width, im.height - FOOTER))      # the bottom strip is a baked legacy copyright line: not published
        # restore the original 1448x1086 frame (same as the Blue hero) by mirroring the last, out-of-focus rows of floor
        pad = im.crop((0, im.height - FOOTER, im.width, im.height)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(3))
        full = Image.new("RGB", (im.width, im.height + FOOTER)); full.paste(im, (0, 0)); full.paste(pad, (0, im.height)); im = full
        out = os.path.join(tmp, os.path.basename(slot) + ".png")
        im.save(out)
        subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets", slot)])
    print("built", len(SLOTS), "slots")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
