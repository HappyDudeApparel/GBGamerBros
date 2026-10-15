#!/usr/bin/env python3
"""Level Preview additions from the owner's 2026-10-15 second image wave: two wide in-world scenes and two true-alpha poster compositions.

    python3 tools/build_wave2_preview.py <directory containing the original image files>

Originals are found by SHA-256 prefix (no private names/IDs in the repo) and never modified.
  * scenes/riverworks-rush, scenes/summit-spine-climb: the wide scenes, built unaltered.
  * scenes/enemy-squad-poster, scenes/stone-line-poster: the owner's true-alpha group renders (Goom/Spike/Rotor/Claw squad; Stone Walker /
    Prism Keeper / Brightback family) set whole, unscaled in proportion, on the same soft studio gradient as the enemy cards (4:3).
Derivatives are built with staging/tools/gbmedia.py.
"""
import hashlib, os, subprocess, sys, tempfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from make_evolution_tiles import studio_bg, W, H, BASELINE

REPO = os.path.dirname(HERE)
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
SCENES = {"scenes/riverworks-rush": "4967a905e3a4", "scenes/summit-spine-climb": "adc2d20efbaa"}
POSTERS = {"scenes/enemy-squad-poster": "8d8472e86485", "scenes/stone-line-poster": "a76d1ccf69f1"}


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    tmp = tempfile.mkdtemp(prefix="gb-lp-")
    for slot, h in SCENES.items():
        if h not in found:
            raise SystemExit(f"source for {slot} ({h}...) not found")
        subprocess.check_call([sys.executable, GBMEDIA, "build", found[h], os.path.join(STAGING, "assets", slot)])
    for slot, h in POSTERS.items():
        if h not in found:
            raise SystemExit(f"source for {slot} ({h}...) not found")
        fig = Image.open(found[h]).convert("RGBA")
        box = fig.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        fig = fig.crop(box)
        k = min(0.94 * (BASELINE - 10) / fig.height, 0.92 * W / fig.width)
        fig = fig.resize((round(fig.width * k), round(fig.height * k)), Image.LANCZOS)
        tile = studio_bg()
        tile.alpha_composite(fig, ((W - fig.width) // 2, round(BASELINE - fig.height)))
        out = os.path.join(tmp, os.path.basename(slot) + ".png")
        tile.convert("RGB").save(out)
        subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets", slot)])
    print("built", len(SCENES) + len(POSTERS), "slots")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
