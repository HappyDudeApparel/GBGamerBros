#!/usr/bin/env python3
"""Evolution sequence tiles for Forming / Stone Walker / Prism Keeper / Brightback from the owner's 2026-10-13 true-alpha renders.

    python3 tools/make_evolution_tiles.py <directory containing the original image files>

Rules
  * one shared source scale for every form (the renders keep the proportions they were supplied with; nothing is stretched or fitted to the
    box), all standing on one common baseline, so Brightback reads at least as large as Prism Keeper because its source is;
  * the figures are composited unaltered (their own soft contact shadows included) onto the same soft studio gradient as the other tiles;
  * originals are found by SHA-256 prefix and never modified; tiles are built with staging/tools/gbmedia.py.
"""
import hashlib, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
W, H = 960, 720
# tile -> sha256 prefix of the source render
TILES = {
    "seq-forming": "24b8b3f310b1",
    "seq-stone-walker": "6b88fb4fc001",
    "seq-prism-keeper": "96e19a3b0512",
    "seq-brightback": "56da479863ec",
}
SCALE = 0.90 * H / 1402          # the tallest source canvas (1402 px) fills 90 % of the tile height
BASELINE = 0.975 * H             # bottom of every source canvas


def studio_bg():
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((x / W - 0.5) / 0.75) ** 2 + ((y / H - 0.42) / 0.80) ** 2)
    t = np.clip(d, 0, 1)[..., None]
    centre, edge = np.array([229, 238, 252], np.float32), np.array([191, 212, 242], np.float32)
    bg = centre * (1 - t) + edge * t
    floor = np.exp(-(((x / W - 0.5) / 0.38) ** 2 + ((y / H - 0.93) / 0.07) ** 2))[..., None]
    bg = bg * (1 - 0.35 * floor) + np.array([208, 224, 245], np.float32) * 0.35 * floor
    return Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            if f.lower().endswith(".png"):
                p = os.path.join(root, f)
                found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    tmp = tempfile.mkdtemp(prefix="gb-evo-")
    for name, h in TILES.items():
        if h not in found:
            raise SystemExit(f"source for {name} ({h}…) not found in {src}")
        fig = Image.open(found[h]).convert("RGBA")
        fig = fig.resize((round(fig.width * SCALE), round(fig.height * SCALE)), Image.LANCZOS)
        tile = studio_bg()
        tile.alpha_composite(fig, ((W - fig.width) // 2, round(BASELINE - fig.height)))
        out = os.path.join(tmp, name + ".png")
        tile.convert("RGB").save(out)
        subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets/entities/evolution/seq", name)])
    print("built", len(TILES), "tiles")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
