#!/usr/bin/env python3
"""Hero carousel slides 7-10 from the owner's 2026-10-15 second image wave (wide 1672x941 in-world scenes).

    python3 tools/build_wave2_hero.py <directory containing the original image files>

Originals are found by SHA-256 prefix (no private names/IDs in the repo) and never modified. Each is exported unaltered at 1672x941 and 960 px
as WebP and stamped with the current HAPPY DUDE(R) notice (staging/tools/gbmedia.py stamp), like the other hero slides.
"""
import hashlib, os, subprocess, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
SLOTS = {
    "hero-7": "8a62ed71ac80",   # Riverworks, red portal and flags
    "hero-8": "a7bdff79f469",   # Portal Meadow, gold portal and flags, Stone Walker
    "hero-9": "159970c72823",   # Clover Cliffs, green portal and flags
    "hero-10": "ffb17d7ea071",  # Summit Spine, purple portal and flags, Prism Keeper
}


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    outs = []
    for slot, h in SLOTS.items():
        if h not in found:
            raise SystemExit(f"source for {slot} ({h}...) not found")
        im = Image.open(found[h]).convert("RGB")
        assert im.size == (1672, 941), im.size
        full = os.path.join(STAGING, "assets/hero", slot + ".webp")
        small = os.path.join(STAGING, "assets/hero", slot + "-960.webp")
        im.save(full, "WEBP", quality=84, method=6)
        im.resize((960, round(960 * 941 / 1672)), Image.LANCZOS).save(small, "WEBP", quality=82, method=6)
        outs += [full, small]
    subprocess.check_call([sys.executable, GBMEDIA, "stamp"] + outs)


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
