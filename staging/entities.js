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
    name: "Goom", type: "enemy", status: "APPROVED",
    // GOOM_SENTRY_CANNON_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "goom-hero", render: E + "goom-hero", icon: null },
    copy: { provisional: true, summary: "Basic enemy.", behaviour: "Wanders and patrols. Chases when you get close.", where: "Common across regions." },
    encounter: [],
    views: { "Front": E + "goom-front", "¾ view": E + "goom-threeq", "Side": E + "goom-side", "Back": E + "goom-back" },
    states: { "Active": E + "goom-active", "Inactive / defeated": E + "goom-defeated" },
    angles: angles("top", "bottom"), cardScale: 0.64, height: 0.5, scale: null,
  },
  "spike-bot": {
    name: "Spike Bot", type: "enemy", status: "APPROVED",
    // SPIKE_BOT_PRODUCTION_MASTER_V1 (approved production master)
    media: { thumb: E + "spike-bot-hero", render: E + "spike-bot-hero", icon: null },
    copy: { provisional: true, summary: "Spiked ground enemy.", behaviour: "Stays put or patrols. Damages on contact.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "spike-bot-front", "Side": E + "spike-bot-side", "Back": E + "spike-bot-back", "Top": E + "spike-bot-top", "Bottom": E + "spike-bot-bottom" },
    states: { "Idle": E + "spike-bot-idle", "Roll": E + "spike-bot-roll", "Alert": E + "spike-bot-alert", "Attack": E + "spike-bot-attack", "Defeated": E + "spike-bot-defeated" },
    angles: angles("top", "bottom"), cardScale: 0.68, height: 0.5, scale: null,
  },
  "rotor-bot": {
    name: "Rotor Bot", type: "enemy", status: "APPROVED",
    // ROTOR_BOT_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "rotor-bot-hero", render: E + "rotor-bot-hero", icon: null },
    copy: { provisional: true, summary: "Airborne enemy.", behaviour: "Flies in patterns.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "rotor-bot-front", "¾ view": E + "rotor-bot-threeq", "Side": E + "rotor-bot-side", "Back": E + "rotor-bot-back" },
    states: { "Hover / attack": E + "rotor-bot-active", "Defeated": E + "rotor-bot-defeated" },
    angles: angles(), cardScale: 0.86, height: 0.8, scale: null,
  },
  "sentry-cannon": {
    name: "Sentry Cannon", type: "enemy", status: "APPROVED",
    // GOOM_SENTRY_CANNON_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "sentry-cannon-hero", render: E + "sentry-cannon-hero", icon: null },
    copy: { provisional: true, summary: "Stationary cannon.", behaviour: "Fires from a fixed position. Find cover.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "sentry-cannon-front", "¾ view": E + "sentry-cannon-threeq", "Side": E + "sentry-cannon-side", "Back": E + "sentry-cannon-back" },
    states: { "Active": E + "sentry-cannon-active", "Inactive / defeated": E + "sentry-cannon-defeated" },
    angles: angles(), cardScale: 0.8, height: 1.0, scale: null,
  },
  "stone-golem": {
    name: "Stone Golem", type: "enemy", status: "APPROVED",
    // STONE_GOLEM_ANGLES_MASTER_V1 + STONE_GOLEM_STATES_MASTER_V1 (approved; the sheets' printed label is the superseded legacy name)
    media: { thumb: E + "stone-golem-hero", render: E + "stone-golem-hero", icon: null },
    copy: { provisional: true, summary: "Evolved rock enemy.", behaviour: "Chases and attacks up close.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "stone-golem-front", "¾ view": E + "stone-golem-threeq", "Side": E + "stone-golem-side", "Back": E + "stone-golem-back" },
    // the sheet's Defeated pose is not used: it shows a purple crystal fragment, and Phase 2 has no crystals
    states: { "Idle": E + "stone-golem-idle", "Walk / chase": E + "stone-golem-walk", "Attack": E + "stone-golem-attack", "Hit / stagger": E + "stone-golem-hit" },
    angles: angles(), cardScale: 1.25, height: 2.0, scale: null,
    evolution: { line: "boulder", phase: 2 },
  },
  "crystal-guardian": {
    name: "Crystal Guardian", type: "enemy", status: "APPROVED",
    // CRYSTAL_GUARDIAN_ANGLES_MASTER_V1 + CRYSTAL_GUARDIAN_STATES_MASTER_V1 (approved production masters)
    media: { thumb: E + "crystal-guardian-hero", render: E + "crystal-guardian-hero", icon: null },
    copy: { provisional: true, summary: "Advanced crystal form.", behaviour: "Guards key areas.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "crystal-guardian-front", "¾ view": E + "crystal-guardian-threeq", "Side": E + "crystal-guardian-side", "Back": E + "crystal-guardian-back" },
    states: { "Idle": E + "crystal-guardian-idle", "Charge": E + "crystal-guardian-charge", "Attack (slam)": E + "crystal-guardian-attack", "Hit / stagger": E + "crystal-guardian-hit", "Defeated": E + "crystal-guardian-defeated" },
    angles: angles(), cardScale: 1.28, height: 2.5, scale: null,
    evolution: { line: "boulder", phase: 3 },
  },
  // ---------------- hazards ----------------
  "rolling-boulder": {
    name: "Rolling Boulder", type: "hazard", status: "APPROVED",
    // ROLLING_BOULDER_PRODUCTION_MASTER_V1 (approved Phase 1 production master; replaces the old provisional crop)
    media: { thumb: E + "rolling-boulder-threeq", render: E + "rolling-boulder-threeq", icon: null },
    copy: { provisional: true, summary: "Environmental hazard.", behaviour: "Rolls downhill and smashes obstacles.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "rolling-boulder-front", "Side": E + "rolling-boulder-side", "Back": E + "rolling-boulder-back", "Top": E + "rolling-boulder-top" },
    states: { "Idle": E + "rolling-boulder-idle", "Rolling": E + "rolling-boulder-rolling", "Impact": E + "rolling-boulder-impact", "Cracked / hit": E + "rolling-boulder-cracked", "Destroyed": E + "rolling-boulder-destroyed" },
    angles: angles(), cardScale: 0.74, height: 1.5, scale: null,
    evolution: { line: "boulder", phase: 1 },
  },

  // ---------------- portals / props / collectibles ----------------
  "portal": {
    name: "Portal", type: "portal", status: "PROVISIONAL",
    media: { thumb: null, render: "assets/systems/fast-travel-portal", icon: null },
    copy: { provisional: true, summary: "Blue portal shrine.", behaviour: "Connects discovered areas of Adventure Mountain™.", where: "Found across Adventure Mountain™." },
    encounter: [],
    states: {}, angles: angles(), scale: null,
  },
  "springboard": {
    name: "Springboard", type: "prop", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Red springboard.", behaviour: "Launches upward.", where: "Found across Adventure Mountain™." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "crate": {
    name: "GB Crate", type: "prop", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Branded wooden crate.", behaviour: "To be confirmed.", where: "Found across Adventure Mountain™." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "coin": {
    name: "Coin", type: "collectible", status: "MISSING",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Common collectible.", behaviour: "Collectible.", where: "To be confirmed." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "adventure-crystal": {
    name: "Adventure Crystal", type: "collectible", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Common collectible.", behaviour: "Collectible.", where: "Found across Adventure Mountain™." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "secret-key": {
    name: "Secret Key / Rare Crystal", type: "collectible", status: "MISSING",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Rare collectible.", behaviour: "To be confirmed.", where: "To be confirmed." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "treasure-chest": {
    name: "Treasure Chest", type: "collectible", status: "MISSING",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Reward chest.", behaviour: "To be confirmed.", where: "To be confirmed." },
    encounter: [], states: {}, angles: angles(), scale: null,
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
      { src: X + "evo-boulder-idle", label: "Boulder", phase: 1 },
      { src: X + "evo-boulder-rolling", label: "Rolling", phase: 1 },
      { src: X + "evo-boulder-impact", label: "Impact", phase: 1 },
      { src: X + "evo-boulder-cracked", label: "Cracked", phase: 1 },
      { src: X + "evo-golem-forming", label: "Forming", phase: 2 },
      { src: X + "evo-stone-golem", label: "Stone Golem", phase: 2 },
      { src: X + "evo-crystal-guardian", label: "Crystal Guardian", phase: 3 },
    ],
    mechanics: [
      { src: X + "mech-core-ignition", label: "Core ignition", text: "Orange internal energy ignites, visible through cracks between the stone plates." },
      { src: X + "mech-plate-reconfiguration", label: "Plate reconfiguration", text: "Stone plates unlock and rotate, reconfiguring into limbs and torso." },
      { src: X + "mech-core-migration", label: "Core migration", text: "The energy gathers into the Stone Golem's eyes and core." },
      { src: X + "mech-crystal-nucleation", label: "Crystal nucleation", text: "Crystals grow from the core and pressure points while the rock body stays visible." },
    ],
    scenes: [
      { src: X + "evo-step-1", label: "Rolling Boulder", note: "Mossy segmented stone, dormant.", phase: 1 },
      { src: X + "evo-step-2", label: "Energized", note: "Energy glows through the cracks.", phase: 1 },
      { src: X + "evo-step-3", label: "Impact / fracture", note: "Plates break loose and begin to reconfigure.", phase: 1 },
      { src: X + "evo-step-4", label: "Stone Golem forming", note: "The same rock becomes limbs and torso.", phase: 2 },
      { src: X + "evo-step-5", label: "Crystal nucleation", note: "Crystals seed from the core and shoulders.", phase: 3 },
      { src: X + "evo-step-6", label: "Crystal Guardian", note: "The Stone Golem body remains beneath the crystals.", phase: 3 },
    ],
  },
};

// display order for the Enemies & Hazards section
window.GB_BESTIARY = ["goom", "spike-bot", "rotor-bot", "sentry-cannon", "rolling-boulder", "stone-golem", "crystal-guardian"];
// In-world backdrop behind each enemy on its card and dossier stage (soft, blurred region art),
// so renders read as part of Adventure Mountain™ rather than a studio asset sheet.
// Presentation only: NOT a claim about where the enemy is encountered.
const AR = "assets/areas/";
window.GB_ENTITY_ENV = {
  "goom": AR + "portal-meadow/pm02-open-meadow-routes",
  "spike-bot": AR + "ruin-courtyard/rc01-broad-dry-courtyard",
  "rotor-bot": AR + "riverworks/rw02-cliffside-waterworks",
  "sentry-cannon": AR + "ruin-courtyard/rc02-court-stairs-exits",
  "rolling-boulder": AR + "clover-cliffs/cl02-switchback-forest-route",
  "stone-golem": AR + "clover-cliffs/cl01-cliff-path-ruins",
  "crystal-guardian": AR + "frost-peaks/fp04-frost-to-summit-spine",
};

// legacy IDs keep working: #entity/<old> is rewritten to the canonical ID
window.GB_ENTITY_ALIASES = {
  "flying-enemy": "rotor-bot",
  "turret": "sentry-cannon",
  "rock-guy": "stone-golem",
  "gem": "adventure-crystal",
};
})();
