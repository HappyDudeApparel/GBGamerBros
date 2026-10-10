// GB GAMER BROS™ — canonical world entity registry
//
// ONE registry for every clickable thing in the world. The Enemies & Hazards section,
// the Fast Travel panel and (Pass E) hotspots inside area images all resolve through
// these IDs and open the SAME detail view:  #entity/<id>
//
//   areas.js hotspot →  { ref: "goom", x: 61, y: 42, w: 6, h: 9 }   (% of the content image)
//   section card     →  <button data-entity="goom">
//
// Visual authority: Enemy & Hazard Bible v1 (revised) and Canonical World Assets v1 —
// see VISUAL_AUTHORITY.md. To replace art, rebuild the image with tools/gbmedia.py and
// point the media key here; IDs, routes and layout never change.
//
// type       enemy | hazard | portal | prop | collectible
// status     APPROVED | PROVISIONAL | CANONICAL | REPLACEMENT_REQUIRED | MISSING   (production status)
//            APPROVED = approved production art (renders isolated from the approved production atlas)
// copy       short working copy only; `provisional: true` shows "Working copy · not final"
// media      thumb / render / icon: banded media keys (media-manifest.js) or null
//            (null everywhere = public dossier shows "Artwork in production")
// encounter  [{ area, view, confirmed }] area gallery images where the entity is visible
// states     ordered { "Label": mediaKey|null } — the planned state set (null = not yet available)
// views      ordered { "Label": mediaKey } — public production views (angles) shown in the dossier
// angles     { front, threeQuarter, side, back, top?, bottom? } — production tracking, not shown publicly
// cardScale  relative size of the render on its Enemies & Hazards card (big evolved forms break the frame)
// height     design-reference height in metres (Gamer Bros = 1.8 m); may be tuned in Unreal
// scale      media key for a scale-reference image, or null
// evolution  { line, phase, of } — optional authored evolution; conditions are undecided

(() => {
const E = "assets/entities/";
const angles = (...extra) => ({ front: null, threeQuarter: null, side: null, back: null, ...Object.fromEntries(extra.map((k) => [k, null])) });
const states = (...labels) => Object.fromEntries(labels.map((l) => [l, null]));

window.GB_HERO_HEIGHT = 1.8;   // Gamer Bros reference height (m)

window.GB_ENTITIES = {
  // ---------------- enemies ----------------
  "goom": {
    name: "Goom Bot™", type: "enemy", status: "APPROVED",
    // GOOM_SENTRY_CANNON_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "goom-hero", render: E + "goom-hero", icon: null },
    copy: { provisional: true, summary: "Basic enemy.", behaviour: "Wanders and patrols. Chases when you get close.", where: "Common across regions." },
    encounter: [],
    views: { "Front": E + "goom-front", "¾ view": E + "goom-threeq", "Side": E + "goom-side", "Back": E + "goom-back" },
    states: { "Idle": E + "goom-idle", "Walk": E + "goom-walk", "Alert": E + "goom-alert", "Charge / attack": E + "goom-charge", "Defeated": E + "goom-defeated-dizzy", "Inactive": E + "goom-defeated" },
    angles: angles("top", "bottom"), cardScale: 0.64, height: 0.5, scale: null,
  },
  "claw-bot": {
    name: "Claw Bot™", type: "enemy", status: "APPROVED",
    // Claw Bot Final Production Reference (core finished source master)
    media: { thumb: E + "claw-bot-hero", render: E + "claw-bot-hero", icon: null },
    copy: { provisional: true, summary: "Crab-like ground enemy with two split-spike claws.", behaviour: "Patrols, spots you, raises its claws and clamps to attack.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Front": E + "claw-bot-front", "¾ view": E + "claw-bot-threeq", "Side": E + "claw-bot-side", "Back": E + "claw-bot-back", "Top": E + "claw-bot-top", "Bottom": E + "claw-bot-bottom" },
    states: { "Idle": E + "claw-bot-idle", "Walk / scuttle": E + "claw-bot-walk", "Alert": E + "claw-bot-alert", "Clamp A": E + "claw-bot-attack-a", "Clamp B": E + "claw-bot-attack-b", "Defeated A": E + "claw-bot-defeated-a", "Defeated B": E + "claw-bot-defeated-b" },
    angles: angles("top", "bottom"), cardScale: 0.95, height: 0.8, scale: null,
  },
  "spike-bot": {
    name: "Spike Bot™", type: "enemy", status: "APPROVED",
    // SPIKE_BOT_PRODUCTION_MASTER_V1 (approved production master)
    media: { thumb: E + "spike-bot-hero", render: E + "spike-bot-hero", icon: null },
    copy: { provisional: true, summary: "Spiked ground enemy.", behaviour: "Stays put or patrols. Damages on contact.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Front": E + "spike-bot-front", "Side": E + "spike-bot-side", "Back": E + "spike-bot-back", "Top": E + "spike-bot-top", "Bottom": E + "spike-bot-bottom" },
    states: { "Idle": E + "spike-bot-idle", "Roll": E + "spike-bot-roll", "Alert": E + "spike-bot-alert", "Attack": E + "spike-bot-attack", "Defeated": E + "spike-bot-defeated" },
    angles: angles("top", "bottom"), cardScale: 0.68, height: 0.5, scale: null,
  },
  "rotor-bot": {
    name: "Rotor Bot™", type: "enemy", status: "APPROVED",
    // ROTOR_BOT_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "rotor-bot-hero", render: E + "rotor-bot-hero", icon: null },
    copy: { provisional: true, summary: "Airborne enemy.", behaviour: "Flies in patterns.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Front": E + "rotor-bot-front", "¾ view": E + "rotor-bot-threeq", "Side": E + "rotor-bot-side", "Back": E + "rotor-bot-back" },
    states: { "Hover / attack": E + "rotor-bot-active", "Defeated": E + "rotor-bot-defeated" },
    angles: angles(), cardScale: 0.86, height: 0.8, scale: null,
  },
  "sentry-cannon": {
    name: "Sentry Cannon™", type: "enemy", status: "APPROVED",
    // 08_SENTRY_CANNON locked system (sole geometry/state source): hostile = red/orange hazard language,
    // hacked = player-colour energy + GB / mountain insignia; same structure across Standard, Rotary, Missile
    media: { thumb: "assets/entities/sentry/hostile", render: "assets/entities/sentry/hostile", icon: null },
    copy: { summary: "Stationary hostile cannon.", behaviour: "Locks on and fires from a fixed position. Hack one and it fights on your side in your colour.", where: "Found across Adventure Mountain™." },
    encounter: [],
    states: { "Hostile": "assets/entities/sentry/hostile", "Hacked · Blue": "assets/entities/sentry/blue", "Hacked · Red": "assets/entities/sentry/red", "Hacked · Yellow": "assets/entities/sentry/yellow", "Hacked · Purple": "assets/entities/sentry/purple" },
    views: { "Standard": "assets/entities/sentry/hostile", "Rotary": "assets/entities/sentry/rotary", "Missile": "assets/entities/sentry/missile" },
    heroFirst: true, heroLabel: "Hostile",
    angles: angles(), cardScale: 0.8, height: 1.0, scale: null,
  },
  "stone-golem": {
    name: "Stone Walker™", type: "enemy", status: "APPROVED",
    // STONE_GOLEM_ANGLES_MASTER_V1 + STONE_GOLEM_STATES_MASTER_V1 (approved; the sheets' printed label is the superseded legacy name)
    media: { thumb: E + "stone-golem-hero", render: E + "stone-golem-hero", icon: null },
    copy: { provisional: true, summary: "Awakened rock enemy.", behaviour: "Chases and attacks up close.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Front": E + "stone-golem-front", "¾ view": E + "stone-golem-threeq", "Side": E + "stone-golem-side", "Back": E + "stone-golem-back" },
    // the sheet's Defeated pose is not used: it shows a purple crystal fragment, and Phase 2 has no crystals
    states: { "Idle": E + "stone-golem-idle", "Walk / chase": E + "stone-golem-walk", "Attack": E + "stone-golem-attack", "Hit / stagger": E + "stone-golem-hit" },
    angles: angles(), cardScale: 1.25, height: 2.0, scale: null,
    evolution: { line: "boulder", phase: 2 },
  },
  "crystal-guardian": {
    name: "Prism Keeper™", type: "enemy", status: "APPROVED",
    // CRYSTAL_GUARDIAN_ANGLES_MASTER_V1 + CRYSTAL_GUARDIAN_STATES_MASTER_V1 (approved production masters)
    media: { thumb: E + "crystal-guardian-hero", render: E + "crystal-guardian-hero", icon: null },
    copy: { provisional: true, summary: "Rare evolved Prism form.", behaviour: "Guards key areas.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Front": E + "crystal-guardian-front", "¾ view": E + "crystal-guardian-threeq", "Side": E + "crystal-guardian-side", "Back": E + "crystal-guardian-back" },
    states: { "Idle": E + "crystal-guardian-idle", "Charge": E + "crystal-guardian-charge", "Attack (slam)": E + "crystal-guardian-attack", "Hit / stagger": E + "crystal-guardian-hit", "Defeated": E + "crystal-guardian-defeated" },
    angles: angles(), cardScale: 1.28, height: 2.5, scale: null,
    evolution: { line: "boulder", phase: 3 },
  },
  // ---------------- hazards ----------------
  "rolling-boulder": {
    name: "Rumbler™", type: "hazard", status: "APPROVED",
    // ROLLING_BOULDER_PRODUCTION_MASTER_V1 (approved Phase 1 production master; replaces the old provisional crop)
    media: { thumb: E + "rolling-boulder-threeq", render: E + "rolling-boulder-threeq", icon: null },
    copy: { provisional: true, summary: "Energized rolling boulder.", behaviour: "Rolls downhill and smashes obstacles.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Front": E + "rolling-boulder-front", "Side": E + "rolling-boulder-side", "Back": E + "rolling-boulder-back", "Top": E + "rolling-boulder-top" },
    states: { "Idle": E + "rolling-boulder-idle", "Rolling": E + "rolling-boulder-rolling", "Impact": E + "rolling-boulder-impact", "Cracked / hit": E + "rolling-boulder-cracked", "Destroyed": E + "rolling-boulder-destroyed" },
    angles: angles(), cardScale: 0.74, height: 1.5, scale: null,
    evolution: { line: "boulder", phase: 1 },
  },

  // ---------------- portals / props / collectibles ----------------
  "portal": {
    name: "Portal", type: "portal", status: "APPROVED",
    media: { thumb: null, render: "assets/systems/fast-travel-portal", icon: null },
    copy: { summary: "Regional fast-travel portal.", behaviour: "Connects discovered areas of Adventure Mountain™.", where: "Found across Adventure Mountain™." },
    encounter: [],
    states: { "Portal Meadow™": "assets/systems/portals/portal-meadow", "Creek Crossing™": "assets/systems/portals/portal-creek", "Clover Cliffs™": "assets/systems/portals/portal-clover", "Fallen Grounds™": "assets/systems/portals/portal-fallen", "Prism Ridge™": "assets/systems/portals/portal-prism" }, angles: angles(), scale: null,
  },
  "springboard": {
    name: "Springboard", type: "prop", status: "APPROVED",
    // 09_SPRINGBOARD/SPRINGBOARD_TURNAROUND_LOCKED (the only approved springboard)
    media: { thumb: "assets/objects/springboard/front", render: "assets/objects/springboard/front", icon: null },
    copy: { summary: "Red domed springboard on a GB base.", behaviour: "Jump on it to launch to higher ledges and hidden routes.", where: "Found across Adventure Mountain™." },
    encounter: [],
    states: { "Neutral": "assets/objects/springboard/neutral", "Compressed": "assets/objects/springboard/compressed", "Rebound": "assets/objects/springboard/rebound", "Settling": "assets/objects/springboard/settling" },
    views: { "Front": "assets/objects/springboard/front", "Left side": "assets/objects/springboard/left", "Back": "assets/objects/springboard/back", "Right ¾": "assets/objects/springboard/threeq", "Top": "assets/objects/springboard/top" },
    angles: angles(), scale: null,
  },
  "crate": {
    name: "GB Crate", type: "prop", status: "APPROVED",
    // 07_CRATES preferred direction: Classic GB
    media: { thumb: "assets/objects/crate-intact", render: "assets/objects/crate-intact", icon: null },
    copy: { summary: "Classic wooden GB crate.", behaviour: "Break it open for rewards; it cracks before it breaks.", where: "Found across Adventure Mountain™." },
    encounter: [], states: { "Intact": "assets/objects/crate-intact", "Damaged": "assets/objects/crate-damaged", "Broken": "assets/objects/crate-broken" }, angles: angles(), scale: null,
  },
  "patchpad": {
    name: "PATCHPAD™", type: "gadget", status: "APPROVED",
    media: { thumb: "assets/gear/patchpad-hero", render: "assets/gear/patchpad-hero", icon: null },
    copy: { summary: "Handheld hacking device, shown in GB Blue.", behaviour: "Metallic dial and vertical thumbwheel. Four controls: red Action/Acquire, blue Scan/Monitor, yellow App/Program Selector and purple Settings.", where: "Carried by the Gamers. Designed for hacking machines such as the Sentry Cannon™." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "smartwatch": {
    name: "SMARTWATCH", type: "gadget", status: "APPROVED",
    media: { thumb: "assets/gear/smartwatch-lineup", render: "assets/gear/smartwatch-lineup", icon: null },
    copy: { summary: "The Gamers' smartwatch, in Blue, Red, Yellow and Purple.", behaviour: "Runs QuickHack™, the fast hacking software, alongside the watch face.", where: "Worn by every Gamer." },
    encounter: [], states: {}, views: { "Lineup": "assets/gear/smartwatch-lineup", "Showcase": "assets/gear/smartwatch-stage" }, angles: angles(), scale: null,
  },
  "quickhack": {
    name: "QuickHack™", type: "gadget", status: "APPROVED",
    media: { thumb: "assets/gear/smartwatch-lineup", render: "assets/gear/smartwatch-lineup", icon: null },
    copy: { summary: "Fast hacking software on the Gamers' SMARTWATCH.", behaviour: "Runs on the SMARTWATCH in every player colour.", where: "On every Gamer's watch." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "glitchkey": {
    name: "GlitchKey™", type: "gadget", status: "PENDING",
    media: { thumb: null, render: null, icon: null },
    copy: { summary: "Final design in development.", behaviour: "More to come.", where: "More to come." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "coin": {
    name: "GB Coin", type: "collectible", status: "APPROVED",
    media: { thumb: "assets/objects/coin", render: "assets/objects/coin", icon: null },
    copy: { summary: "Gold GB Coin: GB face and Adventure Mountain™ face.", behaviour: "Collect them on every route.", where: "Found across Adventure Mountain™." },
    encounter: [], states: { "GB face": "assets/objects/coin", "Mountain face": "assets/objects/coin-back" }, angles: angles(), scale: null,
  },
  "adventure-crystal": {
    name: "Crystal", type: "collectible", status: "APPROVED",
    media: { thumb: "assets/objects/crystal", render: "assets/objects/crystal", icon: null },
    copy: { summary: "The common Crystal.", behaviour: "Breaks into Crystal Shards.", where: "Found across Adventure Mountain™." },
    encounter: [], states: { "Crystal Shards": "assets/objects/crystal-shards" }, angles: angles(), scale: null,
  },
  "secret-key": {
    name: "Prism Crystal", type: "collectible", status: "APPROVED",
    media: { thumb: "assets/objects/prism-crystal", render: "assets/objects/prism-crystal", icon: null },
    copy: { summary: "The rarer Prism Crystal.", behaviour: "Breaks into Prism Shards.", where: "Found across Adventure Mountain™." },
    encounter: [], states: { "Prism Shards": "assets/objects/prism-shards" }, angles: angles(), scale: null,
  },
  "crystal-chest": {
    name: "Crystal Chest", type: "collectible", status: "APPROVED",
    media: { thumb: "assets/objects/crystal-chest", render: "assets/objects/crystal-chest", icon: null },
    copy: { summary: "Special chest with glowing crystal panels.", behaviour: "A rarer reward chest.", where: "Found across Adventure Mountain™." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "character-coins": {
    name: "Character Coins", type: "collectible", status: "APPROVED",
    media: { thumb: "assets/objects/coin-blue", render: "assets/objects/coin-blue", icon: null },
    copy: { summary: "One silver coin per Gamer, in team colour: GB logo on the front, Adventure Mountain™ on the back.", behaviour: "Each player automatically earns their own character coin on entering the world.", where: "Found across Adventure Mountain™." },
    encounter: [], states: { "Blue": "assets/objects/coin-blue", "Red": "assets/objects/coin-red", "Yellow": "assets/objects/coin-yellow", "Purple": "assets/objects/coin-purple" },
    flip: { "assets/objects/coin-blue": "assets/objects/coin-blue-back", "assets/objects/coin-red": "assets/objects/coin-red-back", "assets/objects/coin-yellow": "assets/objects/coin-yellow-back", "assets/objects/coin-purple": "assets/objects/coin-purple-back" },
    angles: angles(), scale: null,
  },
  "treasure-chest": {
    name: "Treasure Chest", type: "collectible", status: "APPROVED",
    media: { thumb: "assets/objects/chest", render: "assets/objects/chest", icon: null },
    copy: { summary: "The GB treasure chest.", behaviour: "Holds rewards for curious explorers.", where: "Found across Adventure Mountain™." },
    encounter: [], states: { "Blue": "assets/objects/chest-blue", "Red": "assets/objects/chest-red", "Yellow": "assets/objects/chest-yellow", "Purple": "assets/objects/chest-purple" }, angles: angles(), scale: null,
  },
};

// optional authored evolution lines (no trigger is hard-coded; conditions are undecided)
window.GB_EVOLUTION = {
  boulder: ["rolling-boulder", "stone-golem", "crystal-guardian"],
};

// evolution detail (approved EVOLUTION_MECHANICS masters): cutout sequence, mechanics close-ups, in-world steps
const X = E + "evolution/";
window.GB_EVOLUTION_DETAIL = {
  boulder: {
    sequence: [
      { src: X + "evo-boulder-idle", label: "Rumbler", phase: 1 },
      { src: X + "evo-boulder-rolling", label: "Rolling", phase: 1 },
      { src: X + "evo-boulder-impact", label: "Impact", phase: 1 },
      { src: X + "evo-boulder-cracked", label: "Cracked", phase: 1 },
      { src: X + "evo-golem-forming", label: "Forming", phase: 2 },
      { src: X + "evo-stone-golem", label: "Stone Walker™", phase: 2 },
      { src: E + "crystal-guardian-hero", label: "Prism Keeper™", phase: 3 },
    ],
    mechanics: [
      { src: X + "mech-core-ignition", label: "Core ignition", text: "Orange internal energy ignites, visible through cracks between the stone plates." },
      { src: X + "mech-plate-reconfiguration", label: "Plate reconfiguration", text: "Stone plates unlock and rotate, reconfiguring into limbs and torso." },
      { src: X + "mech-core-migration", label: "Core migration", text: "The energy gathers into the Stone Walker™'s eyes and core." },
      { src: X + "mech-crystal-nucleation", label: "Crystal nucleation", text: "Crystals grow from the core and pressure points while the rock body stays visible." },
    ],
    scenes: [
      { src: X + "evo-step-1", label: "Rumbler™", note: "Mossy segmented stone, dormant.", phase: 1 },
      { src: X + "evo-step-2", label: "Energized", note: "Energy glows through the cracks.", phase: 1 },
      { src: X + "evo-step-3", label: "Impact / fracture", note: "Plates break loose and begin to reconfigure.", phase: 1 },
      { src: X + "evo-step-4", label: "Stone Walker™ forming", note: "The same rock becomes limbs and torso.", phase: 2 },
      { src: X + "evo-step-5", label: "Crystal nucleation", note: "Prism crystals seed from the core and shoulders.", phase: 3 },
      { src: X + "evo-step-6", label: "Prism Keeper™", note: "The Stone Walker™ body remains beneath the Prism crystals.", phase: 3 },
    ],
  },
};

// display order for the Enemies & Hazards section
// display order for the Adventure Finds™ section
window.GB_OBJECTS = ["treasure-chest", "crystal-chest", "coin", "character-coins", "adventure-crystal", "secret-key", "springboard", "crate"];
window.GB_BESTIARY = ["goom", "spike-bot", "rotor-bot", "claw-bot", "sentry-cannon", "rolling-boulder", "stone-golem", "crystal-guardian"];
// In-game view of each enemy (cropped from the approved production masters' in-game renders):
// the enemy card image and the dossier's opening view. Production cutouts stay as selectable views.
const SC = "assets/entities/scenes/";
window.GB_ENTITY_SCENE = {
  "goom": { src: SC + "goom-ingame", fx: 45 },
  "spike-bot": { src: SC + "spike-bot-ingame", fx: 50 },
  "rotor-bot": { src: SC + "rotor-bot-ingame", fx: 52 },
  "sentry-cannon": { src: SC + "sentry-cannon-ingame", fx: 40 },
  "springboard": [{ src: "assets/objects/springboard/scene-portal-meadow", fx: 45, label: "Portal Meadow™" }, { src: "assets/objects/springboard/scene-riverworks", fx: 45, label: "Riverworks™" }, { src: "assets/objects/springboard/scene-frost-peaks", fx: 45, label: "Frosty Peaks™" }],
  "rolling-boulder": { src: SC + "rolling-boulder-ingame", fx: 62 },
  "stone-golem": { src: SC + "stone-golem-ingame", fx: 50 },
  "crystal-guardian": { src: SC + "crystal-guardian-ingame", fx: 50 },
};

// legacy IDs keep working: #entity/<old> is rewritten to the canonical ID
window.GB_ENTITY_ALIASES = {
  "flying-enemy": "rotor-bot",
  "turret": "sentry-cannon",
  "rock-guy": "stone-golem",
  "gem": "adventure-crystal",
  "goom-bot": "goom",
  "rumbler": "rolling-boulder",
  "stone-walker": "stone-golem",
  "prism-keeper": "crystal-guardian",
  "crystal": "adventure-crystal",
  "prism-crystal": "secret-key",
  "patch-pad": "patchpad",
  "glitch-key": "glitchkey",
  "quick-hack": "quickhack",
  "smart-watch": "smartwatch",
  "clawbot": "claw-bot",
  "claw": "claw-bot",
  "watch": "smartwatch",
};
})();
