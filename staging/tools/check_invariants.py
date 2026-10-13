#!/usr/bin/env python3
"""Regression guard for the GB GAMER BROS(tm) staging site.

Fails (exit 1) if a build drops or reverts the owner-approved corrections:
exact HAPPY DUDE(R) footer, no unfinished privacy policy, clean logo, Brightback(tm) apex card and
four-phase evolution, Meet the Team backdrop frame, and the privacy rule (no personal identifiers).

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
# Owner privacy rule: no personal name, address, personal phone or private email in public files.
# No names are stored in this repository. Generic detectors below; add the owner's private terms at run time with
#   GB_PRIVATE_TERMS="term1,term2" python3 tools/check_staging_invariants.py
APPROVED_EMAILS = {"info@happydude.ca"}
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}")
PHONE = re.compile(r"(?<![\d.])(?:\+?1[ .-])?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}(?![\d.])")
POSTAL = re.compile(r"\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d\b")
PRIVATE_TERMS = [t.strip().lower() for t in os.environ.get("GB_PRIVATE_TERMS", "").split(",") if t.strip()]
for root, _, files in os.walk(STAGING):
    for f in files:
        if not f.endswith(TEXT_EXT):
            continue
        p = os.path.join(root, f)
        rel = os.path.relpath(p, STAGING)
        txt = open(p, encoding="utf-8", errors="replace").read()
        need(not stale.search(txt), f"{rel}: outdated copyright notice present")
        bad_email = [m for m in EMAIL.findall(txt) if m.lower() not in APPROVED_EMAILS and not m.startswith("@")]
        need(not bad_email, f"{rel}: non-approved email address in a public file ({len(bad_email)}x)")
        need(not PHONE.search(txt), f"{rel}: phone-number-like text in a public file")
        need(not POSTAL.search(txt), f"{rel}: postal-code-like text in a public file")
        need(not any(t in txt.lower() for t in PRIVATE_TERMS), f"{rel}: contains a private term from GB_PRIVATE_TERMS")

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
need("#foes .foe--apex .foe__stage{" in css and "overflow:visible" in css.split("#foes .foe--apex .foe__stage{")[1].split("}")[0],
     "staging.css: Brightback breakout stage (overflow:visible) missing")
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


# ---- owner QA pass 2026-10-11 ---------------------------------------------------------------------------
need("In development" not in index and "in development" not in index.lower(), "index.html: unnecessary 'In development' label is back")
need("brightback-v1-cutout" in ent and 'media: { thumb: E + "brightback-v1-hero"' not in ent, "entities.js: Brightback must use the clean cutout, not the captioned hero scene")
need("brightback-v1-hero" not in ent.replace("(brightback-v1-hero.png)", ""), "entities.js: captioned Brightback hero scene is referenced in a public entity")
# 2026-10-13: the *-card derivatives had grey floor mats (owner QA); clean v14 derivatives replace them
need('thumb: E + "stone-golem-v14"' in ent and 'thumb: E + "crystal-guardian-v14"' in ent, "entities.js: Stone Walker/Prism Keeper cards must use the clean *-v14 derivatives")
need('"Defeated · prism rubble": E + "crystal-guardian-defeated-rubble"' in ent, "entities.js: Prism Keeper approved 'Defeated · prism rubble' state is missing")
portal_states = ent.split("Canonical region order")[1].split("angles: angles()")[0] if "Canonical region order" in ent else ""
for region in ("Portal Meadow", "Creek Crossing", "Riverworks", "Clover Cliffs", "Fallen Grounds", "Prism Ridge", "Frosty Peaks", "Summit Spine"):
    need(region in portal_states, f"entities.js: Fast Travel is missing {region}")
areas = read("areas.js")
# 2026-10-13 owner QA: only the Trail junction still is approved for Level Preview (springboard stills rejected)
need(areas.count('kind: "still"') >= 1, "areas.js: Level Preview still missing")
need("springboard/scene-" not in areas, "areas.js: rejected springboard stills are back in Level Preview")
need("v13/prism-ridge-final" in ent and "pr04-prism-ruin-landing" not in ent.split("Canonical region order")[-1].split("angles:")[0],
     "entities.js: Prism Ridge Fast Travel must use the final portal scene, not the pr04 fallback")
need("smartwatch-hardware" in ent and "smartwatch-hardware" in js and "smartwatch-stage" not in js, "SMARTWATCH Showcase must use the distinct hardware composite")

need(index.count("slide--art") >= 3 and "hero__fg" not in index, "index.html: hero must be three key-art slides with no detached foreground character layer")
need(all(os.path.exists(os.path.join(STAGING, f"assets/hero/hero-{n}{v}.webp")) for n in (1, 2, 3) for v in ("", "-p")), "assets/hero: wide + portrait key art missing")

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
