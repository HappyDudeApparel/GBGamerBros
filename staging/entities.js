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
    angles: angles("top", "bottom"), height: 0.5, scale: null,
  },
  "spike-bot": {
    name: "Spike Bot", type: "enemy", status: "MISSING",
    media: { thumb: null, render: null, icon: null },   // old crop did not match the canonical design; production PNG pending
    copy: { provisional: true, summary: "Spiked ground enemy.", behaviour: "Stays put or patrols. Damages on contact.", where: "To be confirmed." },
    encounter: [],
    states: states("Idle", "Roll", "Alert", "Attack", "Defeated"), angles: angles(), height: 0.5, scale: null,
  },
  "rotor-bot": {
    name: "Rotor Bot", type: "enemy", status: "APPROVED",
    // ROTOR_BOT_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "rotor-bot-hero", render: E + "rotor-bot-hero", icon: null },
    copy: { provisional: true, summary: "Airborne enemy.", behaviour: "Flies in patterns.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "rotor-bot-front", "¾ view": E + "rotor-bot-threeq", "Side": E + "rotor-bot-side", "Back": E + "rotor-bot-back" },
    states: { "Hover / attack": E + "rotor-bot-active", "Defeated": E + "rotor-bot-defeated" },
    angles: angles(), height: 0.8, scale: null,
  },
  "sentry-cannon": {
    name: "Sentry Cannon", type: "enemy", status: "APPROVED",
    // GOOM_SENTRY_CANNON_PRODUCTION_ATLAS_V1 (approved production master)
    media: { thumb: E + "sentry-cannon-hero", render: E + "sentry-cannon-hero", icon: null },
    copy: { provisional: true, summary: "Stationary cannon.", behaviour: "Fires from a fixed position. Find cover.", where: "To be confirmed." },
    encounter: [],
    views: { "Front": E + "sentry-cannon-front", "¾ view": E + "sentry-cannon-threeq", "Side": E + "sentry-cannon-side", "Back": E + "sentry-cannon-back" },
    states: { "Active": E + "sentry-cannon-active", "Inactive / defeated": E + "sentry-cannon-defeated" },
    angles: angles(), height: 1.0, scale: null,
  },
  "stone-golem": {
    name: "Stone Golem", type: "enemy", status: "MISSING",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Evolved rock enemy.", behaviour: "Chases and attacks up close.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Walk / chase", "Melee attack", "Hit / stagger", "Defeated"), angles: angles(), height: 2.0, scale: null,
    evolution: { line: "boulder", phase: 2 },
  },
  "crystal-guardian": {
    name: "Crystal Guardian", type: "enemy", status: "MISSING",
    media: { thumb: null, render: null, icon: null },   // old crop did not match the canonical design; production PNG pending
    copy: { provisional: true, summary: "Advanced crystal form.", behaviour: "Guards key areas.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Charge", "Attack", "Damaged", "Defeated"), angles: angles(), height: 2.5, scale: null,
    evolution: { line: "boulder", phase: 3 },
  },
  // ---------------- hazards ----------------
  "rolling-boulder": {
    name: "Rolling Boulder", type: "hazard", status: "PROVISIONAL",
    media: { thumb: E + "rolling-boulder-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Environmental hazard.", behaviour: "Rolls downhill and smashes obstacles.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Rolling", "Impact", "Cracked", "Destroyed"), angles: angles(), height: 1.5, scale: null,
    evolution: { line: "boulder", phase: 1 },
  },

  // ---------------- portals / props / collectibles ----------------
  "portal": {
    name: "Portal", type: "portal", status: "PROVISIONAL",
    media: { thumb: null, render: "assets/systems/fast-travel-portal", icon: null },
    copy: { provisional: true, summary: "Blue portal shrine.", behaviour: "Connects discovered areas of Adventure Mountain™.", where: "Found across Adventure Mountain™." },
    encounter: [{ area: "portal", view: 2, confirmed: true }, { area: "river", view: 1, confirmed: true }],
    states: {}, angles: angles(), scale: null,
  },
  "springboard": {
    name: "Springboard", type: "prop", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Red springboard.", behaviour: "Launches upward.", where: "Seen in Riverworks™ and Portal Meadow™ concepts." },
    encounter: [{ area: "river", view: 3, confirmed: true }], states: {}, angles: angles(), scale: null,
  },
  "crate": {
    name: "GB Crate", type: "prop", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Branded wooden crate.", behaviour: "To be confirmed.", where: "Found across Adventure Mountain™." },
    encounter: [{ area: "river", view: 2, confirmed: true }], states: {}, angles: angles(), scale: null,
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
    encounter: [{ area: "river", view: 3, confirmed: true }], states: {}, angles: angles(), scale: null,
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

// display order for the Enemies & Hazards section
window.GB_BESTIARY = ["goom", "spike-bot", "rotor-bot", "sentry-cannon", "rolling-boulder", "stone-golem", "crystal-guardian"];

// legacy IDs keep working: #entity/<old> is rewritten to the canonical ID
window.GB_ENTITY_ALIASES = {
  "flying-enemy": "rotor-bot",
  "turret": "sentry-cannon",
  "rock-guy": "stone-golem",
  "gem": "adventure-crystal",
};
})();
