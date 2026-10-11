#!/usr/bin/env python3
"""Stronger, subject-integrated HAPPY DUDE(R) mark samples for high-value artwork (characters, enemies, hero assets).

    python3 tools/export_protected_sample.py --src SRC --out OUT_STEM --title T --zone x0,y0,x1,y1 [--band N] [--level A|B|C] [--secondary x0,y0,x1,y1]

* Source is never modified; output is a sample (never written into staging/assets).
* The mark is printed ONTO the subject: it is clipped to the subject's own opaque pixels (cutouts) so it moves, scales and crops with the figure and
  cannot be removed by cropping empty canvas. It follows `--zone`, a rectangle (fractions of the subject's bounding box) the operator chooses to
  keep clear of faces, glowing cores, hardware and other defining detail.
* Levels:  A = large, low opacity (about 24 %), no outline;  B = large, medium opacity (about 38 %) with a fine contrast edge, plus a smaller
  second mark where --secondary is given;  C = larger, strong opacity (about 55 %), contrast edge, second mark.
* Mark colour adapts to the pixels underneath (light on dark areas, deep navy on light areas).  Metadata is the approved rights set (exact notice).
Limits: a printed mark can be edited out by a skilled retoucher and metadata is stripped by many platforms. This deters casual reuse; it does not prevent copying.
"""
import argparse, os, sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import export_public_image as E

ap = argparse.ArgumentParser()
ap.add_argument("--src", required=True); ap.add_argument("--out", required=True); ap.add_argument("--title", required=True)
ap.add_argument("--zone", required=True); ap.add_argument("--secondary", default=""); ap.add_argument("--band", type=int, default=0)
ap.add_argument("--level", choices="ABC", default="B"); ap.add_argument("--angle", type=float, default=-10.0)
a = ap.parse_args()
LEVEL = {"A": dict(op=0.24, w=0.74, edge=0.0), "B": dict(op=0.38, w=0.80, edge=0.30), "C": dict(op=0.55, w=0.90, edge=0.45)}[a.level]
src = os.path.abspath(a.src); stem = os.path.abspath(a.out)
if os.path.commonpath([os.path.dirname(stem), os.path.join(E.ROOT, "staging")]) == os.path.join(E.ROOT, "staging"):
    sys.exit("refusing: samples are never written under staging/")
before = E.sha(src)
im = Image.open(src); im.load()
if a.band: im = im.crop((0, 0, im.width, im.height - a.band))
im = im.convert("RGBA")
arr = np.array(im); alpha = arr[:, :, 3]
ys, xs = np.where(alpha > 16); bx0, by0, bx1, by1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
bw, bh = bx1 - bx0, by1 - by0
subject = (alpha > 16)
rec = {"source": os.path.basename(src), "source_sha256": before, "level": a.level, "subject_bbox": [int(bx0), int(by0), int(bx1), int(by1)], "marks": []}

def mark_layer(zone, width_frac, angle, op, edge):
    zx0, zy0, zx1, zy1 = [float(v) for v in zone.split(",")]
    X0, Y0, X1, Y1 = bx0 + zx0 * bw, by0 + zy0 * bh, bx0 + zx1 * bw, by0 + zy1 * bh
    zw, zh = X1 - X0, Y1 - Y0
    target_w = zw * width_frac
    f = E.brand_font(100); probe = ImageDraw.Draw(Image.new("L", (10, 10)))
    tw = probe.textlength(E.MARK_TEXT, font=f); size = max(12, round(100 * target_w / tw)); f = E.brand_font(size)
    l, t, r, b = probe.textbbox((0, 0), E.MARK_TEXT, font=f); w_, h_ = r - l + 8, b - t + 8
    # colour from the pixels in the zone
    reg = arr[int(Y0):int(Y1), int(X0):int(X1)]; m = reg[:, :, 3] > 200
    lum = float((reg[:, :, :3] * [0.2126, 0.7152, 0.0722]).sum(axis=2)[m].mean()) if m.any() else 120.0
    dark = lum > 150; fill = (16, 30, 66) if dark else (255, 255, 255); rim = (255, 255, 255) if dark else (10, 20, 50)
    txt = Image.new("L", (w_, h_), 0); ImageDraw.Draw(txt).text((4 - l, 4 - t), E.MARK_TEXT, font=f, fill=255)
    rot = txt.rotate(angle, expand=True, resample=Image.BICUBIC)
    cx, cy = (X0 + X1) / 2, (Y0 + Y1) / 2
    px, py = int(cx - rot.width / 2), int(cy - rot.height / 2)
    face = Image.new("L", im.size, 0); face.paste(rot, (px, py))
    # clip to the subject so the print follows the figure
    face = Image.fromarray((np.array(face).astype(np.float32) * (alpha.astype(np.float32) / 255.0)).astype(np.uint8))
    layer = Image.new("RGBA", im.size, fill + (0,)); layer.putalpha(face.point(lambda v: int(v * op)))
    out = layer
    if edge > 0:
        ring = face.filter(ImageFilter.MaxFilter(5)).point(lambda v: v)
        ring = Image.fromarray(np.clip(np.array(ring).astype(np.int16) - np.array(face).astype(np.int16), 0, 255).astype(np.uint8))
        rl = Image.new("RGBA", im.size, rim + (0,)); rl.putalpha(ring.point(lambda v: int(v * edge)))
        out = Image.alpha_composite(rl, layer)
    rec["marks"].append({"zone": zone, "px_width": int(rot.width), "angle": angle, "opacity": op, "edge": edge, "tone": "navy" if dark else "white", "luminance": round(lum, 1),
                         "share_of_subject_width": round(rot.width / bw, 2)})
    return out

res = im.copy()
res = Image.alpha_composite(res, mark_layer(a.zone, LEVEL["w"], a.angle, LEVEL["op"], LEVEL["edge"]))
if a.secondary and a.level in "BC":
    res = Image.alpha_composite(res, mark_layer(a.secondary, 0.62, -a.angle * 0.6, LEVEL["op"] * 0.7, LEVEL["edge"]))
os.makedirs(os.path.dirname(stem), exist_ok=True)
full, small = stem + ".webp", stem + "-960.webp"
E.save(res, full, a.title, 90)
sm = res if res.width <= 960 else res.resize((960, round(res.height * 960 / res.width)), Image.LANCZOS)
E.save(sm, small, a.title, 90)
rec["outputs"] = {os.path.basename(p): {"px": list(Image.open(p).size), "sha256": E.sha(p), "metadata": E.verify(p, a.title)} for p in (full, small)}
assert E.sha(src) == before; rec["source_unchanged"] = True
import json; json.dump(rec, open(stem + ".audit.json", "w"), indent=1)
print(a.level, rec["marks"][0]["share_of_subject_width"], "of subject width; metadata ok:", all(all(v["metadata"].values()) for v in rec["outputs"].values()))
