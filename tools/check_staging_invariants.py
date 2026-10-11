#!/usr/bin/env python3
"""Regression guard for the GB GAMER BROS(tm) staging site.

Fails (exit 1) if a build drops or reverts the owner-approved corrections:
exact HAPPY DUDE(R) footer, no unfinished privacy policy, clean logo, Brightback(tm) apex card and
four-phase evolution, Meet the Team backdrop frame, and the privacy rule (no personal name).

Why it exists: staging/ on main is *generated* by staging/tools/publish.py from the dev branch and
replaces the whole folder, so any fix that is not in the dev source is erased by the next publish.
This file lives in both places (main: tools/, dev: staging/tools/) and publish.py refuses to run if it fails.

    python3 tools/check_staging_invariants.py [path/to/staging]

Static checks only (no browser).  The rendered checks are in tools/qa/ (Playwright).
Needs Pillow for the logo pixel check; without it that one check is reported as SKIPPED, not passed.
"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) > 1:
    STAGING = os.path.abspath(sys.argv[1])
elif os.path.basename(os.path.dirname(HERE)) == "staging":      # dev layout: staging/tools/
    STAGING = os.path.dirname(HERE)
else:                                                           # main layout: tools/ next to staging/
    STAGING = os.path.join(os.path.dirname(HERE), "staging")

NOTICE = "© 2026 HAPPY DUDE®. All rights reserved."
TEXT_EXT = (".html", ".js", ".css", ".json")
problems, skipped = [], []


def read(name):
    with open(os.path.join(STAGING, name), encoding="utf-8") as f:
        return f.read()


def need(cond, msg):
    if not cond:
        problems.append(msg)


# ---- footer / rights ------------------------------------------------------------------------------
index = read("index.html")
need(f'<p class="site-foot__legal">{NOTICE}</p>' in index, "index.html: footer must be exactly '" + NOTICE + "'")
need("Privacy (Draft)" not in index and "privacy.html" not in index, "index.html: unfinished privacy policy is linked")
need(not os.path.exists(os.path.join(STAGING, "privacy.html")), "privacy.html (non-operative draft) must not be published")
need(os.path.exists(os.path.join(STAGING, "rights.html")), "rights.html is missing")
rights = read("rights.html") if os.path.exists(os.path.join(STAGING, "rights.html")) else ""
need(NOTICE in rights, "rights.html: exact copyright notice missing")
need("privacy.html" not in rights, "rights.html: links to the unfinished privacy draft")

# stale / conflicting notices and the privacy rule, across every public text file
stale = re.compile(r"GB Gamer Bros™? x Happy Dude|Copyright ©\s*GB Gamer", re.I)
private = re.compile(r"[redacted]|[redacted]", re.I)
for root, _, files in os.walk(STAGING):
    for f in files:
        if not f.endswith(TEXT_EXT):
            continue
        p = os.path.join(root, f)
        rel = os.path.relpath(p, STAGING)
        txt = open(p, encoding="utf-8", errors="replace").read()
        need(not stale.search(txt), f"{rel}: outdated copyright notice present")
        need(not private.search(txt), f"{rel}: personal name present (owner privacy rule)")

# HAPPY DUDE must always carry the registered mark in the pages we author
for name, txt in (("index.html", index), ("rights.html", rights)):
    bare = re.findall(r"HAPPY DUDE(?!®)", txt)
    need(not bare, f"{name}: 'HAPPY DUDE' without ® ({len(bare)}x)")

# ---- logo -----------------------------------------------------------------------------------------
need('assets/brand/gb-logo-clean.webp' in index and index.count("gb-logo-clean.webp") >= 3,
     "index.html: header, footer and favicon must use gb-logo-clean.webp")
need("gb-logo.webp" not in index and "gb-logo-960.webp" not in index, "index.html: still references a logo file with the old strip")
logo = os.path.join(STAGING, "assets/brand/gb-logo-clean.webp")
try:
    from PIL import Image
    import numpy as np
    if not os.path.exists(logo):
        raise FileNotFoundError(logo)
    im = Image.open(logo).convert("RGBA")
    a = np.array(im)[:, :, 3]
    need(im.size == (640, 260), f"gb-logo-clean.webp: expected 640x260, got {im.size}")
    opaque_rows = np.where(a.max(axis=1) > 200)[0]
    need(len(opaque_rows) and opaque_rows.max() >= 255, "gb-logo-clean.webp: wordmark bottom edge is cropped")
    need(a[opaque_rows.max() + 1:].max() == 0 if len(opaque_rows) else False, "gb-logo-clean.webp: stray pixels below the wordmark (old strip?)")
except ImportError:
    skipped.append("logo pixel check (Pillow/numpy not installed)")
except FileNotFoundError:
    problems.append("assets/brand/gb-logo-clean.webp is missing")

# ---- Meet the Team backdrop goes through the clipping frame ---------------------------------------
css = read("staging.css")
need('class="team__bg"' in index, "index.html: Meet the Team backdrop frame (.team__bg) missing")
need(".team__bg" in css, "staging.css: .team__bg rules missing")
need(not re.search(r"\.team\{background:[^}]*url\(assets/areas/portal-meadow/pm02", css),
     "staging.css: Meet the Team uses the raw banded image as a CSS background again")

# ---- Brightback apex card and evolution ----------------------------------------------------------
need("#foes > li.foes__apex{grid-column:1/-1 !important" in css, "staging.css: Brightback apex card full-width rule missing/overridable")
need("aspect-ratio:701/573" in css, "staging.css: Brightback hero ratio frame missing (would crop the art)")
need(".evo__phases" in css and ".evo__phase-h" in css, "staging.css: four-phase evolution layout missing")
js = read("staging.js")
need("evo__phases" in js and "evo__phase-h" in js, "staging.js: phase-grouped evolution markup missing")
need("evo__num--ref" in js, "staging.js: REFERENCE badge for the completed-form entry missing")
ent = read("entities.js")
need('"brightback": {' in ent and "brightback-v1-hero" in ent, "entities.js: Brightback V1 entity missing")
need("reference: true" in ent, "entities.js: Brightback in-world entry must be flagged reference: true")
need("brightback-v2" not in ent.lower() and "brightback-v2" not in js.lower(), "Brightback V2 (alternate) must not be used")
need('"brightback"' in ent.split("GB_BESTIARY")[-1], "entities.js: Brightback missing from the bestiary")
for f in ("hero", "turnaround", "face", "hand"):
    need(os.path.exists(os.path.join(STAGING, f"assets/entities/brightback-v1-{f}.png")), f"brightback-v1-{f}.png missing")

# ---- every ?v= local reference exists -------------------------------------------------------------
for m in re.finditer(r'(?:src|href)="([^"?#:]+)\?v=[0-9a-f]+"', index):
    need(os.path.exists(os.path.join(STAGING, m.group(1))), f"index.html references missing file {m.group(1)}")
need(json.loads(read("revision.json")).get("revision", "").startswith("r-"), "revision.json malformed")

for s in skipped:
    print("SKIPPED:", s)
if problems:
    print(f"STAGING INVARIANTS FAILED ({len(problems)}):")
    for p in problems:
        print("  -", p)
    sys.exit(1)
print(f"staging invariants OK ({STAGING})")
