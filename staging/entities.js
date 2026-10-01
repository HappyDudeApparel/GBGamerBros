// GB GAMER BROS™ — canonical world entity registry (Pass C)
//
// ONE registry for every clickable thing in the world. The Bad Guys & Hazards section,
// the Fast Travel panel and (Pass E) hotspots inside area images all resolve through
// these IDs and open the SAME detail view:  #entity/<id>
//
//   areas.js hotspot →  { ref: "goom", x: 61, y: 42, w: 6, h: 9 }   (% of the content image)
//   section card     →  <button data-entity="goom">
//
// Replace art or copy here only; no section or dialog code changes are needed.
//
// type      enemy | hazard | portal | prop | collectible
// status    PROVISIONAL | CANONICAL | REPLACEMENT_REQUIRED | MISSING   (production status)
// copy      short working copy only; `provisional: true` shows a "Working copy" label
// media     thumb / render / icon: banded media keys (see media-manifest.js), or null
// encounter list of { area, view } pointing at area gallery images where the entity is
//           visible; `confirmed:false` = visual match still to be confirmed
// states    idle / active / defeated: media key or null (null = not yet available)
// refs      orthographic reference availability (front / threeQuarter / side / back / scale)

(() => {
const E = "assets/entities/";
const missingRefs = { front: null, threeQuarter: null, side: null, back: null, scale: null };
const noStates = { idle: null, active: null, defeated: null };

window.GB_ENTITIES = {
  // ---------------- enemies ----------------
  "goom": {
    name: "Goom", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "goom-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Basic enemy.", behaviour: "Patrols routes. Watch for them.", where: "Seen across several areas in current world concepts." },
    encounter: [{ area: "river", view: 2, confirmed: false }, { area: "ruin", view: 1, confirmed: false }],
    states: noStates, refs: missingRefs,
  },
  "spike-bot": {
    name: "Spike Bot", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "spike-bot-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Spiked enemy on the move.", behaviour: "Time your jumps.", where: "To be confirmed." },
    encounter: [{ area: "ruin", view: 2, confirmed: false }],
    states: noStates, refs: missingRefs,
  },
  "flying-enemy": {
    name: "Flying Enemy", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "flying-enemy-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Airborne enemy.", behaviour: "Patrols the skies.", where: "To be confirmed." },
    encounter: [], states: noStates, refs: missingRefs,
  },
  "turret": {
    name: "Turret", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "turret-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Stationary shooter.", behaviour: "Long-range shots. Find cover.", where: "To be confirmed." },
    encounter: [], states: noStates, refs: missingRefs,
  },
  "crystal-guardian": {
    name: "Crystal Guardian", type: "enemy", status: "PROVISIONAL",
    media: { thumb: E + "crystal-guardian-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Crystal enemy.", behaviour: "Guards key areas.", where: "To be confirmed." },
    encounter: [], states: noStates, refs: missingRefs,
  },
  // ---------------- hazards ----------------
  "rolling-boulder": {
    name: "Rolling Boulder", type: "hazard", status: "PROVISIONAL",
    media: { thumb: E + "rolling-boulder-thumb", render: null, icon: null },
    copy: { provisional: true, summary: "Environmental hazard.", behaviour: "Watch for falling rocks.", where: "To be confirmed." },
    encounter: [], states: noStates, refs: missingRefs,
  },

  // ---------------- portals / props / collectibles ----------------
  // Registered now so Pass E hotspots can point at them. Detail art follows normalisation
  // (see WORLD_ASSET_STANDARD.md).
  "portal": {
    name: "Portal", type: "portal", status: "PROVISIONAL",
    media: { thumb: null, render: "assets/systems/fast-travel-portal", icon: null },
    copy: { provisional: true, summary: "Blue portal shrine.", behaviour: "Connects discovered areas of Adventure Mountain™.", where: "Found across Adventure Mountain™." },
    encounter: [{ area: "portal", view: 2, confirmed: true }, { area: "river", view: 1, confirmed: true }],
    states: noStates, refs: missingRefs,
  },
  "springboard": {
    name: "Springboard", type: "prop", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Red springboard.", behaviour: "Launches upward.", where: "Seen in Riverworks™ and Portal Meadow™ concepts." },
    encounter: [{ area: "river", view: 3, confirmed: true }], states: noStates, refs: missingRefs,
  },
  "crate": {
    name: "GB Crate", type: "prop", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Branded wooden crate.", behaviour: "To be confirmed.", where: "Found across Adventure Mountain™." },
    encounter: [{ area: "river", view: 2, confirmed: true }], states: noStates, refs: missingRefs,
  },
  "gem": {
    name: "Gem", type: "collectible", status: "PROVISIONAL",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Gold gem collectible.", behaviour: "Collectible.", where: "Found across Adventure Mountain™." },
    encounter: [{ area: "river", view: 3, confirmed: true }], states: noStates, refs: missingRefs,
  },
  "coin": {
    name: "Coin", type: "collectible", status: "MISSING",
    media: { thumb: null, render: null, icon: null },
    copy: { provisional: true, summary: "Coin collectible.", behaviour: "Collectible.", where: "To be confirmed." },
    encounter: [], states: noStates, refs: missingRefs,
  },
};

// display order for the Bad Guys & Hazards section
window.GB_BESTIARY = ["goom", "spike-bot", "flying-enemy", "turret", "crystal-guardian", "rolling-boulder"];
})();
