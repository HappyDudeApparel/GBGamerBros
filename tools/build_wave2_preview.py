#!/usr/bin/env python3
"""Level Preview additions from the owner's 2026-10-15 second image wave: wide in-world scenes with a portal for each point of interest.

    python3 tools/build_wave2_preview.py <directory containing the original image files>

Originals are found by SHA-256 prefix (no private names/IDs in the repo) and never modified; the scenes are built unaltered with
staging/tools/gbmedia.py (full + 960 px WebP, current HAPPY DUDE(R) notice in metadata and overscan band).
"""
import hashlib, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))

REPO = os.path.dirname(HERE)
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
SCENES = {
    "scenes/riverworks-rush": "4967a905e3a4",       # Riverworks: red portal and flags
    "scenes/summit-spine-climb": "adc2d20efbaa",    # Summit Spine: purple portal and flags
    "scenes/clover-cliffs-charge": "159970c72823",  # Clover Cliffs: green portal and flags
}


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    for slot, h in SCENES.items():
        if h not in found:
            raise SystemExit(f"source for {slot} ({h}...) not found")
        subprocess.check_call([sys.executable, GBMEDIA, "build", found[h], os.path.join(STAGING, "assets", slot)])
    print("built", len(SCENES), "slots")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
