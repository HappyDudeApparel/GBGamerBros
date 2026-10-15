#!/usr/bin/env python3
"""GlitchKey(TM) concept-preview derivatives from the owner's 2026-10-15 second image wave.

    python3 tools/build_wave2_gear.py <directory containing the original image files>

Originals are found by SHA-256 prefix (no private names/IDs in the repo) and never modified; derivatives are built with staging/tools/gbmedia.py
(full + 960 px WebP, current HAPPY DUDE(R) notice in metadata and overscan band). Only renders without baked headings or footers are published.
"""
import hashlib, os, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
SLOTS = {
    "gear/glitchkey-scene-blue": "ec8c67767d0d",    # blue card on a lit plinth
    "gear/glitchkey-scene-red": "abe00d9e79d5",     # red card, front, close (16:9)
    "gear/glitchkey-scene-yellow": "9823762bd5e9",  # yellow card on a lit floor
    "gear/glitchkey-scene-purple": "1c78ac85f753",  # purple card on a lit floor
}


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    for slot, h in SLOTS.items():
        if h not in found:
            raise SystemExit(f"source for {slot} ({h}...) not found")
        subprocess.check_call([sys.executable, GBMEDIA, "build", found[h], os.path.join(STAGING, "assets", slot)])
    print("built", len(SLOTS), "slots")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
