#!/usr/bin/env python3
"""Hero slide 2 (the four Gamers in streetwear): swap Gamer Bro Blue to the approved streetwear FRONT pose.

    python3 tools/swap_hero5_blue.py           # staging/assets/hero/hero-5*.webp (wide, portrait, and their 960 px versions)

The slide is a composite and its clean background plate is not kept, so the previous Blue (the three-quarter pose) is located in each
composite by template matching against its own cutout, its silhouette is repainted from the surrounding scene (OpenCV inpainting) wherever
the new figure does not cover it, and the front-pose cutout is placed on the same feet position at the same height. The other three Gamers,
the scene and the shadows are untouched. Re-stamped with the current rights metadata.
"""
import os, subprocess, sys
import cv2, numpy as np
from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ST = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(ST, "tools/gbmedia.py")
CH = os.path.join(ST, "assets/characters/blue")


def load(name):
    im = Image.open(os.path.join(CH, name + ".webp")).convert("RGBA")
    a = np.asarray(im)[..., 3]
    ys = np.where((a > 10).any(axis=1))[0]
    return im.crop((0, 0, im.width, ys.max() + 1))      # drop the transparent rows below the feet


def swap(path, old_name="street-threeq", new_name="street-front", hmin=520, hmax=1500, step=8):
    img = np.asarray(Image.open(path).convert("RGB"))
    bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    old = np.asarray(load(old_name))
    best = None
    for H in range(hmin, hmax, step):
        k = H / old.shape[0]
        t = cv2.resize(old, (round(old.shape[1] * k), H), interpolation=cv2.INTER_AREA)
        m = (t[..., 3] > 200).astype(np.uint8) * 255
        if t.shape[0] >= bgr.shape[0] or t.shape[1] >= bgr.shape[1]:
            break
        r = cv2.matchTemplate(bgr, cv2.cvtColor(t[..., :3], cv2.COLOR_RGB2BGR), cv2.TM_CCORR_NORMED, mask=cv2.merge([m, m, m]))
        _, mx, _, loc = cv2.minMaxLoc(r)
        if best is None or mx > best[0]:
            best = (mx, H, loc)
    mx, H, (x, y) = best
    if mx < 0.97:
        raise SystemExit(f"{path}: previous Blue not found (score {mx:.3f})")
    k = H / old.shape[0]
    t = cv2.resize(old, (round(old.shape[1] * k), H), interpolation=cv2.INTER_AREA)
    sil = np.zeros(img.shape[:2], np.uint8)
    sil[y:y + H, x:x + t.shape[1]] = (t[..., 3] > 10).astype(np.uint8) * 255
    sil_core = sil.copy()
    sil = cv2.dilate(sil, np.ones((7, 7), np.uint8))          # also catches the soft edge of the old cutout
    # new figure: feet on the old feet line; scale (up to +10 %) and shift chosen to cover as much of the old silhouette as possible
    new = load(new_name)
    feet_y, cx0 = y + H, x + t.shape[1] / 2
    best_c = None
    for sc in np.arange(1.0, 1.111, 0.02):
        hn = round(H * sc)
        nf0 = new.resize((round(new.width * hn / new.height), hn), Image.LANCZOS)
        na0 = np.asarray(nf0)[..., 3] > 200
        for dx in range(-24, 25, 4):
            nx0, ny0 = round(cx0 + dx - nf0.width / 2), feet_y - hn
            cv = np.zeros(img.shape[:2], bool)
            xa, xb = max(0, nx0), min(img.shape[1], nx0 + nf0.width); ya = max(0, ny0)
            cv[ya:ny0 + hn, xa:xb] = na0[ya - ny0:, xa - nx0:xb - nx0]
            over = (cv & (sil_core > 0)).sum() / max(1, (sil_core > 0).sum())
            if best_c is None or over > best_c[0]:
                best_c = (over, hn, nx0, ny0)
    over, hn, nx, ny = best_c
    nf = new.resize((round(new.width * hn / new.height), hn), Image.LANCZOS)
    nf.putalpha(nf.getchannel("A").filter(ImageFilter.GaussianBlur(0.6)))
    cover = np.zeros(img.shape[:2], np.uint8)
    na = np.asarray(nf)[..., 3]
    x0, x1 = max(0, nx), min(img.shape[1], nx + nf.width)
    cover[ny:ny + hn, x0:x1] = (na[:, x0 - nx:x1 - nx] > 250).astype(np.uint8) * 255
    cover = cv2.erode(cover, np.ones((3, 3), np.uint8))
    hole = cv2.bitwise_and(sil, cv2.bitwise_not(cover))
    hole = cv2.dilate(hole, np.ones((3, 3), np.uint8))
    healed = cv2.inpaint(bgr, hole, 3, cv2.INPAINT_NS)
    base = Image.fromarray(cv2.cvtColor(healed, cv2.COLOR_BGR2RGB)).convert("RGBA")
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    layer.paste(nf, (nx, ny), nf)
    out = Image.alpha_composite(base, layer).convert("RGB")
    return out, dict(score=round(mx, 4), height=H, pos=(x, y), covered=round(float(over), 3), new_height=hn)


def main():
    done = []
    for name, kw in (("hero-5", dict(hmin=520, hmax=760)), ("hero-5-p", dict(hmin=700, hmax=1500, step=12))):
        p = os.path.join(ST, "assets/hero", name + ".webp")
        out, info = swap(p, **kw)
        print(name, info)
        out.save(p, "WEBP", quality=86, method=6)
        w, h = out.size
        sw = 960
        out.resize((sw, round(h * sw / w)), Image.LANCZOS).save(os.path.join(ST, "assets/hero", name + "-960.webp"), "WEBP", quality=82, method=6)
        done += [p, os.path.join(ST, "assets/hero", name + "-960.webp")]
    subprocess.check_call([sys.executable, GBMEDIA, "stamp"] + done)


if __name__ == "__main__":
    main()
