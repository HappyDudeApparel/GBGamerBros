// GB GAMER BROS™ — canonical world entity registry
//
// ONE registry for every clickable thing in the world. The Bad Guys & Hazards section,
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
// status     PROVISIONAL | CANONICAL | REPLACEMENT_REQUIRED | MISSING   (production status)
// copy       short working copy only; `provisional: true` shows "Working copy · not final"
// media      thumb / render / icon: banded media keys (media-manifest.js) or null
//            (null everywhere = public dossier shows "Artwork in production")
// encounter  [{ area, view, confirmed }] area gallery images where the entity is visible
// states     ordered { "Label": mediaKey|null } — the planned state set (null = not yet available)
// angles     { front, threeQuarter, side, back } — production tracking, not shown publicly
// scale      media key for a scale reference, or null
// evolution  { line, phase, of } — optional authored evolution; conditions are undecided

(() => {
const E = "assets/entities/";
const angles = () => ({ front: null, threeQuarter: null, side: null, back: null });
const states = (...labels) => Object.fromEntries(labels.map((l) => [l, null]));

window.GB_ENTITIES = {
  // ---------------- enemies ----------------
  "goom": {
    name: "Goom", type: "enemy", status: "MISSING",
    media: { thumb: null, render: null, icon: null },   // old crop was non-canonical; production PNG pending
    copy: { provisional: true, summary: "Basic enemy.", behaviour: "Wanders and patrols. Chases when you get close.", where: "Common across regions." },
    encounter: [{ area: "river", view: 2, confirmed: false }, { area: "ruin", view: 1, confirmed: false }],
    states: states("Idle", "Movement", "Alert / attack", "Defeated"), angles: angles(), scale: null,
  },
  "spike-bot": {
    name: "Spike Bot", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "spike-bot-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Spiked ground enemy.", behaviour: "Stays put or patrols. Damages on contact.", where: "To be confirmed." },
    encounter: [{ area: "ruin", view: 2, confirmed: false }],
    states: states("Idle", "Rolling / movement", "Alert / attack"), angles: angles(), scale: null,
  },
  "flying-enemy": {
    name: "Flying Enemy", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "flying-enemy-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Airborne enemy.", behaviour: "Flies in patterns.", where: "To be confirmed." },
    encounter: [], states: states("Hover", "Patrol", "Attack", "Defeated"), angles: angles(), scale: null,
  },
  "turret": {
    name: "Turret", type: "enemy", status: "MISSING",
    media: { thumb: null, render: null, icon: null },   // old crop was non-canonical; production PNG pending
    copy: { provisional: true, summary: "Stationary cannon.", behaviour: "Fires from a fixed position. Find cover.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Tracking", "Firing", "Cooldown / inactive"), angles: angles(), scale: null,
  },
  "rock-guy": {
    name: "Rock Guy", type: "enemy", status: "MISSING",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Evolved rock enemy.", behaviour: "Chases and attacks up close.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Chase / move", "Melee attack", "Defeated"), angles: angles(), scale: null,
    evolution: { line: "boulder", phase: 2 },
  },
  "crystal-guardian": {
    name: "Crystal Guardian", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "crystal-guardian-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Advanced crystal form.", behaviour: "Guards key areas.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Charge", "Attack", "Defeated / inactive"), angles: angles(), scale: null,
    evolution: { line: "boulder", phase: 3 },
  },
  // ---------------- hazards ----------------
  "rolling-boulder": {
    name: "Rolling Boulder", type: "hazard", status: "PROVISIONAL",
    media: { thumb: E + "rolling-boulder-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Environmental hazard.", behaviour: "Rolls downhill and smashes obstacles.", where: "To be confirmed." },
    encounter: [], states: states("Idle", "Rolling", "Hit / cracked", "Destroyed"), angles: angles(), scale: null,
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
  boulder: ["rolling-boulder", "rock-guy", "crystal-guardian"],
};

// display order for the Bad Guys & Hazards section (six-card grid; Rock Guy is reached
// through the evolution line and its own #entity/rock-guy route until its art exists)
window.GB_BESTIARY = ["goom", "spike-bot", "flying-enemy", "turret", "crystal-guardian", "rolling-boulder"];
})();
