#!/usr/bin/env python3
"""Build the public 2026-10-13 enemy studio derivatives from the owner-approved 1254x1254 standalone renders.

    python3 tools/build_enemy_studio.py <source-dir-with-goom-rotor-spike-claw-subfolders>

Rules (owner handoff 2026-10-13):
  * originals are opaque 1254x1254 RGB studio renders: used whole, never cropped, never alpha-extracted;
  * each source's SHA-256 is recorded in staging/tools/provenance/enemy-studio-2026-10-13.json (hashes only,
    no private paths or links);
  * public derivatives are named assets/entities/studio/<slot>-hd and built with staging/tools/gbmedia.py
    (full + 960 px WebP, current HAPPY DUDE(R) notice in metadata and in the overscan band).
Only the images listed in SLOTS are published; the rest of the approved library stays private and unused.
"""
import hashlib, json, os, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(REPO, "staging")
GBMEDIA = os.path.join(STAGING, "tools", "gbmedia.py")

# slot -> (subfolder, source file)
SLOTS = {
    # Goom Bot
    "goom-idle": ("goom", "GOOM_01_IDLE_STUDIO_APPROVED_2026-10-13.png"),
    "goom-alert": ("goom", "GOOM_02_ALERT_SURPRISED_APPROVED_2026-10-13.png"),
    "goom-attack": ("goom", "GOOM_04_ATTACK_ANGRY_APPROVED_2026-10-13.png"),
    "goom-charge": ("goom", "GOOM_05_CHARGE_ACTION_APPROVED_2026-10-13.png"),
    "goom-defeated": ("goom", "GOOM_06_DEFEATED_X_EYES_APPROVED_2026-10-13.png"),
    "goom-face": ("goom", "GOOM_07_ATTACK_FACE_CLOSEUP_APPROVED_2026-10-13.png"),
    # Spike Bot
    "spike-bot-hero": ("spike", "SPIKE_BOT_01_HERO_APPROVED_2026-10-13.png"),
    "spike-bot-alert": ("spike", "SPIKE_BOT_06_ALERT_READY_APPROVED_2026-10-13.png"),
    "spike-bot-roll": ("spike", "SPIKE_BOT_04_ROLL_ACTION_APPROVED_2026-10-13.png"),
    "spike-bot-charge": ("spike", "SPIKE_BOT_05_CHARGE_SPARKS_APPROVED_2026-10-13.png"),
    "spike-bot-attack": ("spike", "SPIKE_BOT_03_ATTACK_ENERGY_EFFECT_APPROVED_2026-10-13.png"),
    "spike-bot-defeated": ("spike", "SPIKE_BOT_02_DEFEATED_INACTIVE_APPROVED_2026-10-13.png"),
    # Rotor Bot
    "rotor-bot-hover": ("rotor", "ROTOR_BOT_01_HOVER_APPROVED_2026-10-13.png"),
    "rotor-bot-thrust": ("rotor", "ROTOR_BOT_03_ATTACK_MAX_THRUST_APPROVED_2026-10-13.png"),
    "rotor-bot-flight": ("rotor", "ROTOR_BOT_04_ATTACK_ANGLED_FLIGHT_APPROVED_2026-10-13.png"),
    "rotor-bot-inactive": ("rotor", "ROTOR_BOT_05_DEFEATED_NO_FLAMES_APPROVED_2026-10-13.png"),
    "rotor-bot-core": ("rotor", "ROTOR_BOT_06_CORE_CLOSEUP_APPROVED_2026-10-13.png"),
    "rotor-bot-nozzle": ("rotor", "ROTOR_BOT_07_THRUSTER_CLOSEUP_APPROVED_2026-10-13.png"),
    "rotor-bot-spike": ("rotor", "ROTOR_BOT_08_RED_SPIKE_COLLAR_CLOSEUP_APPROVED_2026-10-13.png"),
    # Claw Bot
    "claw-bot-idle": ("claw", "CLAW_BOT_01_IDLE_HERO_APPROVED_STUDIO_2026-10-13.png"),
    "claw-bot-scuttle": ("claw", "CLAW_BOT_02_WALK_SCUTTLE_APPROVED_STUDIO_2026-10-13.png"),
    "claw-bot-alert": ("claw", "CLAW_BOT_07_ALERT_RAISED_SPLIT_CLAWS_SITE_APPROVED_2026-10-13.png"),
    "claw-bot-clamp": ("claw", "CLAW_BOT_04_ATTACK_CLAMP_A_APPROVED_STUDIO_2026-10-13.png"),
    "claw-bot-clamp-forward": ("claw", "CLAW_BOT_09_ATTACK_FORWARD_CLAMP_SITE_APPROVED_2026-10-13.png"),
    "claw-bot-defeated": ("claw", "CLAW_BOT_06_DEFEATED_APPROVED_STUDIO_2026-10-13.png"),
    "claw-bot-claw-closed": ("claw", "CLAW_BOT_11_MECHANICAL_CLOSED_SPLIT_CLAW_DETAIL_SITE_APPROVED_2026-10-13.png"),
    "claw-bot-claw-open": ("claw", "CLAW_BOT_12_MECHANICAL_OPEN_SPLIT_CLAW_DETAIL_SITE_APPROVED_2026-10-13.png"),
    "claw-bot-hinge": ("claw", "CLAW_BOT_13_MECHANICAL_HINGE_ACTUATOR_DETAIL_SITE_APPROVED_2026-10-13.png"),
}


def main(src):
    audit = {}
    for slot, (sub, name) in SLOTS.items():
        p = os.path.join(src, sub, name)
        raw = open(p, "rb").read()
        audit[slot] = {"source_file": name, "source_sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw)}
        base = os.path.join(STAGING, "assets/entities/studio", slot + "-hd")
        subprocess.check_call([sys.executable, GBMEDIA, "build", p, base])
    out = os.path.join(STAGING, "tools/provenance/enemy-studio-2026-10-13.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump({"note": "owner-approved 1254x1254 RGB studio renders used whole (no crop, no alpha extraction)", "slots": audit},
              open(out, "w"), indent=1)
    print("built", len(SLOTS), "slots")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
