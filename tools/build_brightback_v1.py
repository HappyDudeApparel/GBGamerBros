#!/usr/bin/env python3
"""Brightback(TM) V1 (the owner's accepted design) from the owner's true-alpha V1 cutout: card/dossier render + evolution tile.

    python3 tools/build_brightback_v1.py <directory containing the original image file>

The original (BRIGHTBACK_CUTOUT_TRUE_ALPHA_V1, 1536 px, found by SHA-256 prefix, never modified) shows the V1 design: squat build, wide
shoulders, the glowing chest core in its pointed crystal frame, the comb crown. It replaces the taller, slimmer renders (ring-shaped core)
that were published on 2026-10-13: those match the V2/"new candidate" look and are NOT the accepted design. They are no longer published.
The render is trimmed to its alpha bounds (plus a small margin) and otherwise untouched. Derivatives are built with staging/tools/gbmedia.py.
"""
import hashlib, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from make_evolution_tiles import studio_bg, W, H, BASELINE   # same studio gradient and baseline as the other evolution tiles

REPO = os.path.dirname(HERE)
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
SHA = "df2f14a508f0"
TILE_HEIGHT = 0.94 * (BASELINE - 8)      # px of tile height the figure may use: taller than the Prism Keeper tile figure, inside the frame


def main(src):
    found = None
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            if hashlib.sha256(open(p, "rb").read()).hexdigest().startswith(SHA):
                found = p
    if not found:
        raise SystemExit(f"source ({SHA}...) not found in {src}")
    im = Image.open(found).convert("RGBA")
    box = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    m = round(0.012 * im.width)
    box = (max(0, box[0] - m), max(0, box[1] - m), min(im.width, box[2] + m), min(im.height, box[3] + m))
    fig = im.crop(box)
    tmp = tempfile.mkdtemp(prefix="gb-bb-")
    hero = os.path.join(tmp, "brightback-hero.png"); fig.save(hero)
    subprocess.check_call([sys.executable, GBMEDIA, "build", hero, os.path.join(STAGING, "assets/entities/new/brightback-hero")])
    k = min(TILE_HEIGHT / fig.height, 0.92 * W / fig.width)
    f2 = fig.resize((round(fig.width * k), round(fig.height * k)), Image.LANCZOS)
    tile = studio_bg(); tile.alpha_composite(f2, ((W - f2.width) // 2, round(BASELINE - f2.height)))
    out = os.path.join(tmp, "seq-brightback.png"); tile.convert("RGB").save(out)
    subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets/entities/evolution/seq/seq-brightback")])
    print("built Brightback V1 hero + evolution tile")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
