#!/usr/bin/env python3
"""Approved-asset allowlist for the GB GAMER BROS(tm) staging site.

Every image the public site shows is pinned here per *use* (entity + slot, area view, evolution step, page
reference). A build fails when:
  * a public use points at an asset that is not the approved one for that use (silent swap / fallback),
  * a public use is new and has not been approved yet,
  * a SUPERSEDED or HOLD asset is referenced anywhere public (rejected, archived or not-yet-approved art),
  * an asset listed under an entity's `archived` block is shown publicly,
  * a referenced asset file does not exist.

    python3 tools/asset_allowlist.py            # check (exit 1 on failure)
    python3 tools/asset_allowlist.py --write    # re-pin approved-assets.json from the current data
                                                # (only after the owner approved the change; refuses superseded art)

References are collected by tools/asset_refs.js (node) from areas.js, entities.js, world-data.js, characters.js,
index.html, staging.css, staging.js and world.js.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
STAGING = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.dirname(HERE)
ALLOW = os.path.join(HERE, "approved-assets.json")

# Superseded / rejected / held art. Key -> reason. A "scope" limits the ban to uses starting with that prefix.
SUPERSEDED = {
    "assets/entities/goom-hero": "superseded 2026-10-13 by goom-v14 (clean 1536 px source)",
    "assets/entities/spike-bot-hero": "superseded 2026-10-13 by spike-bot-v14",
    "assets/entities/claw-bot-hero": "superseded 2026-10-13 by claw-bot-v14",
    "assets/entities/crystal-guardian-card": "grey mat under feet (owner QA 2026-10-13); use crystal-guardian-v14",
    "assets/entities/crystal-guardian-hero": "smoke under foot",
    "assets/entities/crystal-guardian-defeated": "shows the living form crouching (not rubble)",
    "assets/entities/stone-golem-card": "grey floor under feet (owner QA 2026-10-13); use stone-golem-v14",
    "assets/entities/stone-golem-hero": "grey floor under feet (owner QA 2026-10-13)",
    "assets/entities/stone-golem-front": "grey floor; use stone-golem-front-v14",
    "assets/entities/stone-golem-attack": "grey floor block",
    "assets/entities/stone-golem-side": "apparent third fist",
    "assets/entities/evolution/evo-stone-golem": "grey mat under feet in the evolution sequence (owner QA 2026-10-13)",
    "assets/entities/rotor-bot-hero": "propeller-era design, superseded by rotor-bot-v13-a/b/c",
    "assets/entities/rotor-bot-idle": "superseded by rotor-bot-v13 finals",
    "assets/entities/rotor-bot-patrol": "superseded by rotor-bot-v13 finals",
    "assets/entities/rolling-boulder-threeq": "351 px; superseded by the owner-confirmed Rumbler still",
    "assets/entities/goom-defeated-dizzy": "grey dust mat",
    "assets/entities/goom-defeated": "grey dust mat",
    "assets/entities/brightback-v1-hero": "captioned reference scene",
    "assets/entities/brightback-candidate-v14": "HOLD: new Brightback candidate awaits owner approval; V1 stays canonical",
    "assets/objects/springboard/scene-riverworks": {"reason": "rejected for Level Preview (owner QA 2026-10-13)", "scope": "GB_AREAS"},
    "assets/objects/springboard/scene-frost-peaks": {"reason": "rejected for Level Preview (owner QA 2026-10-13)", "scope": "GB_AREAS"},
    "assets/areas/prism-ridge/pr04-prism-ruin-landing": {"reason": "temporary Fast Travel fallback; replaced by the final Prism Ridge portal", "scope": "GB_ENTITIES.portal"},
    # 2026-10-13 full correction pass: small cutout state crops replaced by studio tiles (subject unaltered)
    "assets/entities/goom-walk": "superseded by studio tile", "assets/entities/goom-alert": "superseded by studio tile",
    "assets/entities/goom-charge": "superseded by studio tile", "assets/entities/spike-bot-alert": "superseded by studio tile",
    "assets/entities/spike-bot-attack": "superseded by studio tile", "assets/entities/spike-bot-defeated": "superseded by studio tile",
    "assets/entities/claw-bot-walk": "92-201 px sheet crop; superseded by animation-bundle studio tile",
    "assets/entities/claw-bot-alert": "superseded by animation-bundle studio tile",
    "assets/entities/claw-bot-attack-a": "superseded by animation-bundle studio tile",
    "assets/entities/scenes/goom-ingame-solo": "wrong-region flag (owner QA 2026-10-13)",
    "assets/systems/fast-travel-portal": "generic generated portal image, not an established portal design (owner QA 2026-10-13)",
    "assets/entities/scenes/goom-ingame": "wrong-region flag and malformed background Goom",
}
# 2026-10-13 (new library): true-alpha 1122-1254 px renders replace the earlier cutouts of the stone line
for _k, _why in (("stone-golem-v14", "grey-floor-era cutout"), ("crystal-guardian-v14", "cutout superseded by the true-alpha render"), ("stone-golem-front-v14", "superseded"),
                 ("brightback-v1-cutout", "679 px cutout with a faded foot; superseded by the true-alpha V1 render")):
    SUPERSEDED[f"assets/entities/{_k}"] = f"{_why} (2026-10-13 new library)"
SUPERSEDED["assets/entities/studio/stone-golem-walk-st"] = "444 px sheet tile; superseded 2026-10-13"
SUPERSEDED["assets/entities/studio/crystal-guardian-idle-st"] = "532 px sheet tile; superseded 2026-10-13"
SUPERSEDED["assets/systems/preview-04-trail-junction"] = "rejected by the owner 2026-10-13 (wrong enemies, inaccurate flag); no replacement trail scene approved yet"
# 2026-10-13 (quality pass): owner-approved 1254 px standalone studio renders replace the earlier cutouts and sheet-crop tiles
for _k in ("goom", "spike-bot", "claw-bot"):
    SUPERSEDED[f"assets/entities/{_k}-v14"] = "superseded 2026-10-13 by the approved 1254 px studio renders (studio/*-hd)"
for _k in ("goom-walk-st", "goom-alert-st", "goom-charge-st", "spike-bot-alert-st", "spike-bot-attack-st", "spike-bot-defeated-st",
           "claw-bot-walk-st", "claw-bot-alert-st", "claw-bot-attack-st"):
    SUPERSEDED[f"assets/entities/studio/{_k}"] = "444 px sheet-crop tile; superseded 2026-10-13 by the approved 1254 px studio renders"
for _r in ("meadow", "creek", "river", "clover", "fallen", "frost", "summit", "prism", "prism-ridge"):
    SUPERSEDED[f"assets/systems/portals/portal-{_r}"] = "pre-v13 Fast Travel scene"
# whole families that must never be shown publicly
BANNED_PREFIXES = {
    "assets/entities/evolution/mech-": "evolution mechanics are not disclosed publicly (owner QA 2026-10-13)",
    "assets/objects/quickhack/": "software name not owner-approved",
}


def refs():
    out = subprocess.run(["node", os.path.join(HERE, "asset_refs.js"), STAGING], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def banned(key, use):
    for pre, why in BANNED_PREFIXES.items():
        if key.startswith(pre):
            return why
    s = SUPERSEDED.get(key)
    if s is None:
        return None
    if isinstance(s, dict):
        return s["reason"] if use.startswith(s.get("scope", "")) else None
    return s


def public_map(rs):
    """use -> key for data uses; page/stylesheet/runtime uses are pinned as sets per file."""
    data, static = {}, {}
    for r in rs:
        if r["use"].startswith("ARCHIVED:"):
            continue
        if "." in r["use"].split("[")[0] and r["use"].startswith("GB_"):
            data[r["use"]] = r["key"]
        else:
            static.setdefault(r["use"], set()).add(r["key"])
    return data, {k: sorted(v) for k, v in static.items()}


def exists(key):
    return any(os.path.exists(os.path.join(STAGING, key + ext)) for ext in (".webp", ".png", ".jpg", ".jpeg", ""))


def main():
    rs = refs()
    data, static = public_map(rs)
    problems = []
    archived = {r["key"] for r in rs if r["use"].startswith("ARCHIVED:")}
    for use, key in list(data.items()) + [(f, k) for f, ks in static.items() for k in ks]:
        why = banned(key, use)
        if why:
            problems.append(f"{use}: superseded asset {key} ({why})")
        # archived = withdrawn as a separate gallery/state tile; still allowed as the entity's own hero (media)
        if key in archived and not use.endswith((".media.thumb", ".media.render")):
            problems.append(f"{use}: {key} is listed as archived but shown publicly")
        if not exists(key):
            problems.append(f"{use}: missing file {key}")
    if "--write" in sys.argv:
        if problems:
            print("refusing to pin: fix these first:\n  - " + "\n  - ".join(problems))
            sys.exit(1)
        json.dump({"_note": "Approved public asset per use. Regenerate only after owner approval: tools/asset_allowlist.py --write",
                   "data": dict(sorted(data.items())), "static": dict(sorted(static.items()))},
                  open(ALLOW, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        print(f"pinned {len(data)} data uses + {sum(len(v) for v in static.values())} page references -> {os.path.relpath(ALLOW)}")
        return
    if not os.path.exists(ALLOW):
        problems.append("approved-assets.json missing (run with --write after owner approval)")
    else:
        allow = json.load(open(ALLOW, encoding="utf-8"))
        ad, ast = allow.get("data", {}), allow.get("static", {})
        for use, key in data.items():
            if use not in ad:
                problems.append(f"{use}: {key} is not on the approved-asset allowlist")
            elif ad[use] != key:
                problems.append(f"{use}: shows {key}, approved is {ad[use]}")
        for use in ad:
            if use not in data:
                problems.append(f"{use}: approved asset {ad[use]} is no longer shown (re-pin if intended)")
        for f, ks in static.items():
            extra = sorted(set(ks) - set(ast.get(f, [])))
            if extra:
                problems.append(f"{f}: unapproved asset reference(s): {', '.join(extra)}")
    if problems:
        print(f"ASSET ALLOWLIST FAILED ({len(problems)}):")
        for p in problems:
            print("  -", p)
        sys.exit(1)
    print(f"asset allowlist OK: {len(data)} data uses + {sum(len(v) for v in static.values())} page references, "
          f"{len(SUPERSEDED)} superseded keys blocked")


if __name__ == "__main__":
    main()
