#!/usr/bin/env python3
"""Build the public derivatives of the owner's 2026-10-13 "new images" library (Stone Walker, Prism Keeper and Brightback true-alpha renders,
crystal rubble studio renders, two in-world scenes).

    python3 tools/build_new_library.py <directory containing the original image files>

Originals are found by SHA-256 prefix (so no private file names, Drive IDs or links live in the repository) and are never modified.
Derivatives are built with staging/tools/gbmedia.py (full + 960 px WebP, current HAPPY DUDE(R) notice in metadata and overscan band).
Only the images listed here are published; the rest of the library stays private and unused.
"""
import hashlib, json, os, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")
# public slot (under staging/assets/) -> first 12 hex of the source file's SHA-256
SLOTS = {
    "entities/new/stone-walker-hero": "6b88fb4fc001",
    "entities/new/stone-walker-glare": "61598cb854c3",
    "entities/new/stone-walker-forming": "24b8b3f310b1",
    "entities/new/stone-walker-dynamic": "bcfd65f9c35c",
    "entities/new/stone-walker-collapsed": "477cefbac6a5",
    "entities/new/prism-keeper-hero": "96e19a3b0512",
    "entities/new/prism-keeper-guard": "9928276a5a65",
    "entities/new/prism-keeper-ready": "7ab35bd3df12",
    "entities/new/prism-keeper-impact": "3cda62fc18d6",
    "entities/new/prism-keeper-advance": "1c48928fe178",
    "objects/studio/crystal-rubble-a": "27dae4e1cb82",
    "objects/studio/crystal-rubble-b": "c3e82a9c0b91",
    "objects/studio/prism-rubble-a": "69f7d34c4921",
    "objects/studio/prism-rubble-b": "44fc43b51f54",
    "objects/studio/prism-rubble-c": "825c7c3cb689",
    "scenes/portal-meadow-pursuit": "c83b5ea1bb11",
    "scenes/creek-crossing-pursuit": "593e417191ac",
    "objects/studio/stone-walker-rubble": "9c2b514ec6b6",
}


def main(src):
    found = {}
    for root, _, files in os.walk(src):
        for f in files:
            if f.lower().endswith((".png", ".jpg", ".jpeg")):
                p = os.path.join(root, f)
                found[hashlib.sha256(open(p, "rb").read()).hexdigest()[:12]] = p
    audit = {}
    for slot, h in SLOTS.items():
        if h not in found:
            raise SystemExit(f"source for {slot} (sha256 {h}…) not found in {src}")
        subprocess.check_call([sys.executable, GBMEDIA, "build", found[h], os.path.join(STAGING, "assets", slot)])
        audit[slot] = {"source_sha256_prefix": h}
    out = os.path.join(STAGING, "tools/provenance/new-library-2026-10-13.json")
    json.dump({"note": "owner-supplied originals used whole; no recolour, redraw or crop", "slots": audit}, open(out, "w"), indent=1)
    print("built", len(SLOTS), "slots")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
