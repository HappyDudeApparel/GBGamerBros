#!/usr/bin/env python3
"""SMARTWATCH hardware showcase, composed ONLY from pixels of the approved reference sheet
(01_Hardware_Spec_Mountain_LED.png, "Player Wearable Watch - Final Production Reference").

    python3 tools/make_watch_showcase.py SHEET.png OUT.png

Nothing is redrawn or regenerated: every picture is an exact crop of the sheet (GB Blue hero, front / 3/4 / side views, four
close-ups), enlarged at most 1.5x with Lanczos, placed on cards and captioned with typeset text (labels use the sheet's own wording).
The sheet's header, footer (old copyright line) and unrelated panels are not used. Output is 1400x1000 and meant to be shown at <=1x.
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from export_public_image import brand_font   # Rubik, converted from the site's own font file

SHEET, OUT = sys.argv[1], sys.argv[2]
sh = Image.open(SHEET).convert("RGB")
CROPS = {  # (x0, y0, x1, y1) on the 1536x1152 sheet
    "hero": (22, 142, 252, 488), "front": (964, 142, 1098, 348), "q34": (1114, 142, 1274, 348),
    "sideR": (1284, 142, 1397, 348), "sideL": (1402, 142, 1515, 348),
    "cu1": (372, 590, 621, 777), "cu2": (636, 590, 907, 777), "cu3": (922, 590, 1217, 777), "cu4": (1230, 590, 1507, 777),
}
W, H = 1400, 1000
NAVY, PALE, INK = (11, 42, 107), (232, 240, 251), (11, 42, 107)
canvas = Image.new("RGB", (W, H), (7, 28, 79))
d = ImageDraw.Draw(canvas)
for y in range(H):                                   # background gradient
    t = y / H; d.line([(0, y), (W, y)], fill=(int(9 + 10 * t), int(36 + 30 * (1 - t)), int(96 + 40 * (1 - t))))

def put(key, x, y, scale, r=16):
    """Paste the crop (scaled) as a rounded card exactly its own size, so no background seam appears."""
    c = sh.crop(CROPS[key]); nw, nh = round(c.width * scale), round(c.height * scale)
    c = c.resize((nw, nh), Image.LANCZOS)
    m = Image.new("L", (nw, nh), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, nw - 1, nh - 1), r, fill=255)
    canvas.paste(c, (x, y), m); return nw, nh

def text(xy, s, size, fill=(255, 255, 255), anchor="la"):
    ImageDraw.Draw(canvas).text(xy, s, font=brand_font(size), fill=fill, anchor=anchor)

def wrap(cx, y, s, size, width, fill):
    f = brand_font(size); line = ""; lines = []
    for w_ in s.split():
        t = (line + " " + w_).strip()
        if ImageDraw.Draw(canvas).textlength(t, font=f) > width and line: lines.append(line); line = w_
        else: line = t
    lines.append(line)
    for i, l in enumerate(lines): text((cx, y + i * (size + 5)), l, size, fill, "ma")

# header
text((48, 34), "SMARTWATCH™", 56)
text((48, 100), "HARDWARE SHOWCASE  ·  GB BLUE", 22, (159, 208, 255))
# row A: GB Blue hero + four views, bottoms aligned
TOPY, BOTY = 150, 618
nw, nh = put("hero", 48, TOPY, 1.30); text((48 + nw // 2, BOTY + 4), "GB BLUE", 22, anchor="ma")
VS = 1.6
x = 48 + nw + 44
for key, lab in (("front", "FRONT"), ("q34", "3/4 VIEW"), ("sideR", "SIDE (RIGHT)"), ("sideL", "SIDE (LEFT)")):
    vh_ = round((CROPS[key][3] - CROPS[key][1]) * VS); y_ = TOPY + (nh - vh_) // 2
    vw, vh = put(key, x, y_, VS); text((x + vw // 2, y_ + vh + 12), lab, 20, anchor="ma"); x += vw + 34
# row B: close-ups with the sheet's own captions
cap = {"cu1": ("TACTILE BUTTONS", "Rugged, responsive controls built for adventure."), "cu2": ("PREMIUM METAL BUILD", "Durable materials, adventure-ready."),
       "cu3": ("STRAP & CLASP", "Tough, flexible and made for everyday wear."), "cu4": ("BACK PLATE", "Engraved Adventure Mountain\u2122 emblem.")}
cws = {k: CROPS[k][2] - CROPS[k][0] for k in cap}; total = sum(cws.values()) + 3 * 24; x = (W - total) // 2
for k in ("cu1", "cu2", "cu3", "cu4"):
    put(k, x, 690, 1.0); cw = cws[k]
    text((x + cw // 2, 888), cap[k][0], 19, anchor="ma"); wrap(x + cw // 2, 916, cap[k][1], 14, cw - 10, (207, 230, 255)); x += cw + 24
canvas.save(OUT); print("wrote", OUT, canvas.size)
