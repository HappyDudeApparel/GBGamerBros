#!/usr/bin/env python3
"""Hero carousel key art: approved character cutouts grounded in approved region scenes (static composites).

    python3 tools/make_hero_composites.py STAGING_ASSETS_DIR OUT_DIR

Every slide follows one recipe so the set reads as one art direction:
  * scene = an approved area image (staging/assets/areas/*), cropped 16:9, band removed; nothing painted over it;
  * characters = the approved sporty-pose cutouts (assets/characters/<id>/sporty-pose), never redrawn;
  * grounding = feet placed on the visible path; size follows a single perspective rule (figure height = k * (feet_y - horizon));
  * lighting = cutout tone nudged toward the scene's warm sun (10 %), plus a directional cast shadow (silhouette flattened onto the
    ground, falling back-right) and a soft contact shadow under the feet;
  * two compositions per slide: a 16:9 one (desktop, tablet, phone landscape; the hero crops it to a wide band, so figures stay in the
    middle of the picture) and a 1080x2000 portrait one for phones, with the same people and scene but larger figures and the headline zone left free.
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

A, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
W, H = 1672, 941
PW, PH = 1080, 2000      # portrait composites (hero is ~390 x 722 css px on phones)

SLIDES = [
  # id, scene file, crop box (x0,y0,x1) on the 1448-wide scene (height = width*9/16), horizon y (0-1 of output), k, characters [(id, centre x 0-1, feet y 0-1)]
  dict(id="hero-1", scene="areas/portal-meadow/pm01-broad-entry-path", crop=(0, 150, 1448), horizon=0.40, k=1.0,
       cast=[("blue", 0.385, 0.855), ("red", 0.465, 0.875), ("yellow", 0.545, 0.86), ("purple", 0.625, 0.875)],
       pcrop=(150, 0, 722), phorizon=0.40,
       pcast=[("yellow", 0.15, 0.715, 0.33), ("purple", 0.87, 0.72, 0.33), ("blue", 0.31, 0.79, 0.41), ("red", 0.65, 0.80, 0.42)]),
  dict(id="hero-2", scene="areas/prism-ridge/ss01-summit-portal-stairs", crop=(0, 215, 1448), horizon=0.46, k=1.0,
       cast=[("blue", 0.435, 0.885), ("red", 0.565, 0.89)],
       pcrop=(440, 0, 1012), phorizon=0.50,
       pcast=[("blue", 0.30, 0.79, 0.41), ("red", 0.68, 0.795, 0.42)]),
  dict(id="hero-3", scene="areas/riverworks/rw03-maintenance-walkway", crop=(0, 120, 1448), horizon=0.40, k=0.88,
       cast=[("yellow", 0.455, 0.885), ("purple", 0.555, 0.895)],
       pcrop=(560, 0, 1132), phorizon=0.42,
       pcast=[("yellow", 0.32, 0.79, 0.40), ("purple", 0.67, 0.80, 0.41)]),
]
K = 0.50   # figure height as a multiple of (feet_y - horizon) * H


def load_cut(char):
    im = Image.open(os.path.join(A, f"characters/{char}/sporty-pose.webp")).convert("RGBA")
    return im.crop((0, 0, im.width, im.height - 14))      # drop the overscan band


def tone(cut, scene_rgb):
    """Nudge the cutout toward the scene's sun colour without changing its design colours."""
    a = np.array(cut).astype(np.float32); rgb, al = a[:, :, :3], a[:, :, 3:]
    warm = np.array([1.05, 1.0, 0.93], np.float32)
    mixed = rgb * (0.90 + 0.10 * warm * (scene_rgb / 150.0))
    return Image.fromarray(np.dstack([np.clip(mixed, 0, 255), al]).astype(np.uint8), "RGBA")


def shadow_layers(fig, fx, fy, W=W, H=H):
    """(cast, contact) RGBA layers sized to the canvas for a figure whose feet centre is (fx, fy)."""
    fw, fh = fig.size
    alpha = fig.split()[3]
    # cast shadow: flip the silhouette about the feet line, flatten and shear toward the back-right
    flip = alpha.transpose(Image.FLIP_TOP_BOTTOM).resize((fw, int(fh * 0.30)), Image.BILINEAR)
    cast = Image.new("L", (W, H), 0)
    sheared = flip.transform(flip.size, Image.AFFINE, (1, 0.9, -0.9 * flip.height, 0, 1, 0), Image.BILINEAR)
    cast.paste(sheared, (int(fx - fw / 2 + fw * 0.10), int(fy - flip.height + 4)))
    cast = cast.filter(ImageFilter.GaussianBlur(fh * 0.012)).point(lambda v: int(v * 0.34))
    contact = Image.new("L", (W, H), 0)
    ew, eh = int(fw * 0.62), max(8, int(fh * 0.045))
    ell = Image.new("L", (ew, eh), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(ell).ellipse((0, 0, ew - 1, eh - 1), fill=255)
    contact.paste(ell, (int(fx - ew / 2), int(fy - eh * 0.55)))
    contact = contact.filter(ImageFilter.GaussianBlur(fh * 0.010)).point(lambda v: int(v * 0.55))
    return cast, contact


def build(s, portrait=False):
    global W, H
    cw_, ch_ = (PW, PH) if portrait else (1672, 941)
    sc = Image.open(os.path.join(A, s["scene"] + ".webp")).convert("RGB")
    if portrait:
        x0, y0, x1 = s["pcrop"]; wcrop = x1 - x0; hcrop = round(wcrop * PH / PW)
        base = sc.crop((x0, y0, x0 + wcrop, y0 + hcrop)).resize((PW, PH), Image.LANCZOS)
        cast, horizon, k = s["pcast"], s["phorizon"], s["k"]
    else:
        x0, y0, x1 = s["crop"]; wcrop = x1 - x0; hcrop = round(wcrop * 9 / 16)
        base = sc.crop((x0, y0, x0 + wcrop, y0 + hcrop)).resize((cw_, ch_), Image.LANCZOS)
        cast, horizon, k = s["cast"], s["horizon"], s["k"]
    scene_rgb = np.array(base.crop((int(cw_ * .3), int(ch_ * .72), int(cw_ * .7), int(ch_ * .95)))).reshape(-1, 3).mean(axis=0).astype(np.float32)
    canvas = base.convert("RGBA"); record = []; figs = []
    for item in cast:
        cid, cx, fy_ = item[:3]
        cut = load_cut(cid); fy = fy_ * ch_
        # landscape: perspective rule; portrait: explicit height fraction (4th value) because the hero is cropped much more tightly
        target_h = int(item[3] * ch_) if len(item) > 3 else int((fy - horizon * ch_) * K * k * 2.0)
        sc_ = target_h / cut.height
        fig = tone(cut, scene_rgb).resize((max(1, round(cut.width * sc_)), target_h), Image.LANCZOS)
        fig.putalpha(fig.split()[3].filter(ImageFilter.GaussianBlur(0.6)))
        figs.append((cid, fig, cx * cw_, fy)); record.append(dict(char=cid, height_px=target_h, feet=[round(cx * cw_), round(fy)]))
    figs.sort(key=lambda t: t[3])
    for cid, fig, fx, fy in figs:
        cast_l, contact_l = shadow_layers(fig, fx, fy, cw_, ch_)
        for lay in (cast_l, contact_l):
            blk = Image.new("RGBA", (cw_, ch_), (18, 26, 40, 255)); blk.putalpha(lay); canvas = Image.alpha_composite(canvas, blk)
        layer = Image.new("RGBA", (cw_, ch_), (0, 0, 0, 0)); layer.paste(fig, (int(fx - fig.width / 2), int(fy - fig.height)), fig)
        canvas = Image.alpha_composite(canvas, layer)
    return canvas.convert("RGB"), record


meta = {}
for s in SLIDES:
    img, rec = build(s)
    img.save(os.path.join(OUT, s["id"] + ".png"))
    pimg, prec = build(s, portrait=True)
    pimg.save(os.path.join(OUT, s["id"] + "-p.png"))
    meta[s["id"]] = dict(scene=s["scene"], figures=rec, portrait_figures=prec)
json.dump(meta, open(os.path.join(OUT, "hero-composites.json"), "w"), indent=1)
print(json.dumps(meta)[:300])
