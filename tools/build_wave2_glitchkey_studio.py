#!/usr/bin/env python3
"""GlitchKey(TM) concept preview: one matching studio tile per colour, plus the four-colour set, from the owner's 2026-10-15 true-alpha renders.

    python3 tools/build_wave2_glitchkey_studio.py <directory containing the original image files>

Source (found by SHA-256 prefix, never modified): the front four-colour sheet, true alpha.
Each colour's card is cut from the front sheet by its own alpha silhouette (no pixel inside a card is touched) and set on the same navy studio
background with a soft glow in its own colour and a faint floor reflection, so every colour reads as one family at one size (1448x1086).
No functions, mechanics or platform claims are drawn or implied. Tiles are built with staging/tools/gbmedia.py.
"""
import hashlib, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
FRONT = "cea00669e2ff"
W, H = 1448, 1086
GLOW = {"blue": (40, 120, 255), "red": (255, 50, 60), "yellow": (255, 190, 30), "purple": (160, 70, 255), "set": (60, 120, 230)}
ORDER = [("blue", 0, 0), ("red", 1, 0), ("yellow", 0, 1), ("purple", 1, 1)]   # (colour, column, row) in the front sheet


def studio(glow):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.clip(np.sqrt(((x / W - 0.5) / 0.8) ** 2 + ((y / H - 0.44) / 0.85) ** 2), 0, 1)[..., None]
    bg = np.array([14, 36, 84], np.float32) * (1 - d) + np.array([4, 12, 34], np.float32) * d
    g = np.exp(-(((x / W - 0.5) / 0.30) ** 2 + ((y / H - 0.46) / 0.26) ** 2))[..., None]
    bg = bg + g * np.array(glow, np.float32) * 0.30
    floor = np.exp(-(((x / W - 0.5) / 0.42) ** 2 + ((y / H - 0.80) / 0.05) ** 2))[..., None]
    bg = bg + floor * np.array(glow, np.float32) * 0.10
    return Image.fromarray(bg.clip(0, 255).astype(np.uint8), "RGB").convert("RGBA")


def place(tile, fig, cx, cy):
    refl = fig.transpose(Image.FLIP_TOP_BOTTOM)
    a = np.asarray(refl).astype(np.float32).copy()
    fade = np.linspace(0.30, 0.0, a.shape[0])[:, None]
    a[..., 3] *= fade
    refl = Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA").filter(ImageFilter.GaussianBlur(2))
    x0, y0 = round(cx - fig.width / 2), round(cy - fig.height / 2)
    tile.alpha_composite(refl, (x0, y0 + fig.height - 4))
    tile.alpha_composite(fig, (x0, y0))


def bbox(im):
    return im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    if FRONT not in found:
        raise SystemExit(f"source {FRONT}... not found")
    front = Image.open(found[FRONT]).convert("RGBA")
    tmp = tempfile.mkdtemp(prefix="gb-gk-")
    tiles = {}
    for colour, c, r in ORDER:
        cell = front.crop((c * W // 2, r * H // 2, (c + 1) * W // 2, (r + 1) * H // 2))
        card = cell.crop(bbox(cell))
        k = (0.72 * W) / card.width
        card = card.resize((round(card.width * k), round(card.height * k)), Image.LANCZOS)
        t = studio(GLOW[colour]); place(t, card, W / 2, H * 0.47); tiles["glitchkey-" + colour] = t
    for name, sheet, scale in (("glitchkey-set", front, 0.80),):
        fig = sheet.crop(bbox(sheet))
        k = scale * W / fig.width
        fig = fig.resize((round(fig.width * k), round(fig.height * k)), Image.LANCZOS)
        t = studio(GLOW["set"]); place(t, fig, W / 2, H * 0.40); tiles[name] = t
    for name, t in tiles.items():
        out = os.path.join(tmp, name + ".png")
        t.convert("RGB").save(out)
        subprocess.check_call([sys.executable, GBMEDIA, "build", out, os.path.join(STAGING, "assets/gear", name)])
    print("built", len(tiles), "tiles")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
