#!/usr/bin/env python3
"""Treasure Chest colour set (Blue / Red / Yellow / Purple) from the owner's 2026-10-15 "player colour variants" render.

    python3 tools/build_chests.py <directory containing the original image file>

The original (found by SHA-256 prefix, never modified) is a white-background sheet with a title, four name labels, a footer and each chest's
floor reflection. Nothing but the chests is published: each chest is cut out by flood-filling the plain white background from its borders
(chest pixels are never altered; the edge is softened by half a pixel), cropped above its reflection, and built as a transparent
derivative (assets/objects/chest-<colour>). A 2x2 set (assets/objects/chest-set) leads the Treasure Chest card. Built with staging/tools/gbmedia.py.
"""
import hashlib, os, subprocess, sys, tempfile
import numpy as np
from collections import deque
from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
SHA = None   # set from the file found (only one image is supplied); recorded in provenance below
BOXES = {"blue": (10, 285, 430, 600), "red": (428, 285, 833, 600), "yellow": (838, 285, 1244, 600), "purple": (1244, 285, 1656, 600)}
SIZE = (1672, 941)


def cut(im):
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    h, w, _ = a.shape
    white = a.min(axis=2) > 200
    bg = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and white[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((ny, nx))
    # floor reflection: below the lowest solid (dark/saturated) pixel of each column there is only pale reflection, which is dropped
    solid = a.min(axis=2) < 150
    for x in range(w):
        ys = np.where(solid[:, x])[0]
        bg[(ys.max() + 3 if len(ys) else 0):, x] = True
    alpha = Image.fromarray(((~bg) * 255).astype(np.uint8), "L").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out = im.convert("RGBA"); out.putalpha(alpha)
    return out


def main(src):
    found = None
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            try:
                if Image.open(p).size == SIZE: found = p
            except Exception:
                pass
    if not found:
        raise SystemExit(f"source image ({SIZE[0]}x{SIZE[1]}) not found in {src}")
    sheet = Image.open(found).convert("RGB")
    tmp = tempfile.mkdtemp(prefix="gb-chest-")
    figs = {}
    for name, box in BOXES.items():
        fig = cut(sheet.crop(box))
        bbox = fig.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
        pad = 6
        fig = fig.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(fig.width, bbox[2] + pad), min(fig.height, bbox[3] + pad)))
        figs[name] = fig
        out = os.path.join(tmp, f"chest-{name}.png"); fig.save(out)
        subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets/objects", f"chest-{name}")])
    # 2x2 set on a transparent square
    S = 1254
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cw = 560
    cells = {"blue": (0, 0), "red": (1, 0), "yellow": (0, 1), "purple": (1, 1)}
    for name, (cx, cy) in cells.items():
        f = figs[name]; k = cw / f.width
        f = f.resize((cw, round(f.height * k)), Image.LANCZOS)
        x = round(S / 2 + (cx - 0.5) * 600 - f.width / 2)
        y = round(S / 2 + (cy - 0.5) * 430 - f.height / 2)
        canvas.alpha_composite(f, (x, y))
    out = os.path.join(tmp, "chest-set.png"); canvas.save(out)
    subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets/objects/chest-set")])
    print("built 4 chests + set")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
