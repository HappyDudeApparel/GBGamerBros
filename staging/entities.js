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
    media: { thumb: E + "goom-v14", render: E + "goom-v14", icon: null },
    copy: { provisional: true, summary: "Basic enemy.", behaviour: "Wanders and patrols. Chases when you get close.", where: "Common across regions." },
    encounter: [],
    views: {  },
    states: { "Walk": "assets/entities/studio/goom-walk-st", "Alert": "assets/entities/studio/goom-alert-st", "Charge / attack": "assets/entities/studio/goom-charge-st" },
    angles: angles("top", "bottom"), cardScale: 0.64, height: 0.5, scale: null,
    // PUBLIC CURATION 2026-10-11: hero + in-world (cropped to drop the malformed background Goom) + 3 actions. Archived: Idle/Inactive (dupes), Defeated + dizzy Defeated (grey dust mat, owner QA 05), 4 turnarounds.
    archived: { "Superseded hero (2026-10-13)": E + "goom-hero", "Idle": "assets/entities/goom-idle", "Defeated": "assets/entities/goom-defeated-dizzy", "Inactive": "assets/entities/goom-defeated", "Front": "assets/entities/goom-front", "¾ view": "assets/entities/goom-threeq", "Side": "assets/entities/goom-side", "Back": "assets/entities/goom-back" },
  },
  "claw-bot": {
    name: "Claw Bot™", type: "enemy", status: "APPROVED",
    // Sources: Claw Bot Final Production Reference (hero, views, idle, alert, clamp A, defeated A/B) and
    // Claw Bot Animation Bundle Reference (walk = front scuttle; attack = front attack). Re-extracted 2026-10-10 (no streaks/shadows).
    media: { thumb: E + "claw-bot-v14", render: E + "claw-bot-v14", icon: null },
    copy: { provisional: true, summary: "Crab-like ground enemy with two split-spike claws.", behaviour: "Patrols, spots you, raises its claws and clamps to attack.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: {},
    states: { "Walk / scuttle": "assets/entities/studio/claw-bot-walk-st", "Alert · claws raised": "assets/entities/studio/claw-bot-alert-st", "Clamp attack": "assets/entities/studio/claw-bot-attack-st" },
    // PUBLIC CURATION 2026-10-11 (owner strategy): hero + 3 distinctive actions. Source cells are only 92–201 px
    // (Final Production Reference sheet), so they are shown at native size, never stretched. Kept for provenance,
    // not shown publicly: routine turnarounds, the redundant idle, the head-spike-clipped front attack, defeated states.
    archived: { "Superseded hero (2026-10-13)": E + "claw-bot-hero", "Idle": E + "claw-bot-idle", "Attack · open claws (spike + feet clipped)": E + "claw-bot-attack-front", "Defeated A": E + "claw-bot-defeated-a", "Defeated B": E + "claw-bot-defeated-b",
      "Front": E + "claw-bot-front", "¾ view": E + "claw-bot-threeq", "Side": E + "claw-bot-side", "Back": E + "claw-bot-back", "Top": E + "claw-bot-top", "Bottom": E + "claw-bot-bottom" },
    angles: angles("top", "bottom"), cardScale: 0.95, height: 0.8, scale: null,
  },
  "spike-bot": {
    name: "Spike Bot™", type: "enemy", status: "APPROVED",
    // SPIKE_BOT_PRODUCTION_MASTER_V1 (approved production master)
    media: { thumb: E + "spike-bot-v14", render: E + "spike-bot-v14", icon: null },
    copy: { provisional: true, summary: "Spiked ground enemy.", behaviour: "Stays put or patrols. Damages on contact.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: {  },
    states: { "Alert": "assets/entities/studio/spike-bot-alert-st", "Attack": "assets/entities/studio/spike-bot-attack-st", "Defeated": "assets/entities/studio/spike-bot-defeated-st" },
    angles: angles("top", "bottom"), cardScale: 0.68, height: 0.5, scale: null,
    // PUBLIC CURATION 2026-10-11: in-world + hero + Alert (red eye), Attack (thruster flame), Defeated. Archived: Idle/Roll (same pose as hero), 5 turnarounds incl. top/bottom.
    archived: { "Superseded hero (2026-10-13)": E + "spike-bot-hero", "Idle": "assets/entities/spike-bot-idle", "Roll": "assets/entities/spike-bot-roll", "Front": "assets/entities/spike-bot-front", "Side": "assets/entities/spike-bot-side", "Back": "assets/entities/spike-bot-back", "Top": "assets/entities/spike-bot-top", "Bottom": "assets/entities/spike-bot-bottom" },
  },
  "rotor-bot": {
    name: "Rotor Bot™", type: "enemy", status: "APPROVED",
    // Source: Rotor Bot Production Spec Sheet (final fixed-nozzle design: 3 red spikes, 4 angled red thruster
    // nozzles, 1 bottom stabilization nozzle, no propellers). Replaces ROTOR_BOT_PRODUCTION_ATLAS_V1 (propeller fins).
    // Charge/Attack A and Attack/Dive B are omitted until a transparent export exists (exhaust plumes can't be cleanly matted from the sheet).
    media: { thumb: E + "rotor-bot-v13-a", render: E + "rotor-bot-v13-a", icon: null },
    copy: { provisional: true, summary: "Fast, agile flying enemy with a spherical core and fixed thruster nozzles.", behaviour: "Hovers, patrols, spots you and attacks from above.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Thrusters firing · B": E + "rotor-bot-v13-b", "Thrusters firing · C": E + "rotor-bot-v13-c" },
    states: {},
    angles: angles("top", "bottom"), cardScale: 0.86, height: 0.8, scale: null,
    // PUBLIC CURATION 2026-10-11: final fixed-nozzle design: hero + Idle/hover + Patrol (thruster flame). Source cells 139–195 px; shown at native size. Archived: Alert/Inactive (near-dupes), Defeated A/B (dirt residue), 6 turnarounds.
    archived: { "Alert": "assets/entities/rotor-bot-alert", "Inactive": "assets/entities/rotor-bot-inactive", "Defeated A": "assets/entities/rotor-bot-defeated-a", "Defeated B": "assets/entities/rotor-bot-defeated-b", "Front": "assets/entities/rotor-bot-front", "¾ view": "assets/entities/rotor-bot-threeq", "Side": "assets/entities/rotor-bot-side", "Back": "assets/entities/rotor-bot-back", "Top": "assets/entities/rotor-bot-top", "Bottom": "assets/entities/rotor-bot-bottom" },
    // 2026-10-13: owner-locked final renders A/B/C (1254 px, 3 fixed spikes, 4 side thrusters + bottom nozzle, full flames) replace the
    // 139–408 px sheet crops. Previous public hero + Idle/Patrol kept as files: rotor-bot-hero, rotor-bot-idle, rotor-bot-patrol.
  },
  "sentry-cannon": {
    name: "Sentry Cannon", type: "enemy", status: "APPROVED",
    // 08_SENTRY_CANNON locked system (sole geometry/state source): hostile = red/orange hazard language,
    // hacked = player-colour energy + GB / mountain insignia; same structure across Standard, Rotary, Missile
    media: { thumb: "assets/entities/sentry/hostile", render: "assets/entities/sentry/hostile", icon: null },
    copy: { summary: "Stationary hostile cannon.", behaviour: "Locks on and fires from a fixed position. Hack one and it fights on your side in your colour.", where: "Found across Adventure Mountain™." },
    encounter: [],
    states: { "Hostile": "assets/entities/sentry/hostile", "Hacked · Blue": "assets/entities/sentry/blue", "Hacked · Red": "assets/entities/sentry/red", "Hacked · Yellow": "assets/entities/sentry/yellow", "Hacked · Purple": "assets/entities/sentry/purple" },
    views: { "Standard": "assets/entities/sentry/hostile", "Rotary": "assets/entities/sentry/rotary", "Missile": "assets/entities/sentry/missile" },
    heroFirst: true, heroLabel: "Hostile", viewsLabel: "Weapon configurations",
    angles: angles(), cardScale: 0.8, height: 1.0, scale: null,
  },
  "stone-golem": {
    name: "Stone Walker™", type: "enemy", status: "APPROVED",
    // STONE_GOLEM_ANGLES_MASTER_V1 + STONE_GOLEM_STATES_MASTER_V1 (approved; the sheets' printed label is the superseded legacy name)
    media: { thumb: E + "stone-golem-v14", render: E + "stone-golem-v14", icon: null },
    copy: { provisional: true, summary: "Awakened rock enemy.", behaviour: "Chases and attacks up close.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Full stance": E + "stone-golem-front-v14" },
    // the sheet's Defeated pose is not used: it shows a purple crystal fragment, and Phase 2 has no crystals
    states: { "Walk / chase": "assets/entities/studio/stone-golem-walk-st" },
    angles: angles(), cardScale: 1.25, height: 2.0, scale: null,
    evolution: { line: "boulder", phase: 2 },
    // PUBLIC CURATION 2026-10-11: approved in-world (preserved) + card hero + Walk + full stance. Archived: Side (apparent third fist, owner QA 11), Attack (grey floor block, owner QA 12), Hit (grey debris), Idle (dupe), ¾/Back. Defeated amber-crystal rubble: source missing.
    archived: { "Superseded card (grey floor, 2026-10-13)": E + "stone-golem-card", "Superseded hero": E + "stone-golem-hero", "Superseded full stance": E + "stone-golem-front", "Idle": "assets/entities/stone-golem-idle", "Attack": "assets/entities/stone-golem-attack", "Hit / stagger": "assets/entities/stone-golem-hit", "¾ view": "assets/entities/stone-golem-threeq", "Side": "assets/entities/stone-golem-side", "Back": "assets/entities/stone-golem-back" },
  },
  "crystal-guardian": {
    name: "Prism Keeper™", type: "enemy", status: "APPROVED",
    // CRYSTAL_GUARDIAN_ANGLES_MASTER_V1 + CRYSTAL_GUARDIAN_STATES_MASTER_V1 (approved production masters)
    media: { thumb: E + "crystal-guardian-v14", render: E + "crystal-guardian-v14", icon: null },
    copy: { provisional: true, summary: "Rare evolved Prism form.", behaviour: "Guards key areas.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: { "Ready stance": "assets/entities/studio/crystal-guardian-idle-st" },
    // Defeated = approved "Guardian Rubble B" (Crystals Shards and Evolution Remains Reference): stone rubble with purple prism shards
    states: { "Defeated · prism rubble": "assets/entities/studio/crystal-guardian-defeated-rubble-st" },
    // PUBLIC CURATION 2026-10-11: lead = approved in-world image (1368 px), the clean studio hero and the full-body ready stance.
    // Not shown publicly (kept for provenance): Charge (grey smoke mat at its left edge), Attack (slam) and Hit (grey debris/ghosting baked into the cutouts),
    // Defeated (shows the living form crouching; canon defeated = rubble with purple Prism Shards: source missing),
    // the four routine turnarounds, and the smoky original hero.
    archived: { "Superseded card (2026-10-13)": E + "crystal-guardian-card", "Charge (grey smoke mat)": E + "crystal-guardian-charge", "Attack (slam)": E + "crystal-guardian-attack", "Hit / stagger": E + "crystal-guardian-hit", "Defeated (wrong: living crouch)": E + "crystal-guardian-defeated",
      "Front": E + "crystal-guardian-front", "¾ view": E + "crystal-guardian-threeq", "Side": E + "crystal-guardian-side", "Back": E + "crystal-guardian-back", "Hero (smoke under foot)": E + "crystal-guardian-hero" },
    leadScene: true,
    angles: angles(), cardScale: 1.28, height: 2.5, scale: null,
    evolution: { line: "boulder", phase: 3 },
  },
  "brightback": {
    name: "Brightback™", type: "enemy", status: "APPROVED",
    // Preferred Brightback V1 imagery only; V2 is an unapproved alternate.
    // Stage 4 follows Prism Keeper; do not borrow this silhouette or its cyan/magenta shards for stage 3.
    // Clean V1 derivative: the figure cut out of the approved V1 sheet (Brightback Final Evolution V1.jpg), so the sheet's baked caption
    // and header strip are gone. The captioned scene crop (brightback-v1-hero.png) stays in the repo as a reference but is not shown publicly.
    scenicHero: true, heroFirst: true, heroLabel: "Hero (V1)",
    media: { thumb: E + "brightback-v1-cutout", render: E + "brightback-v1-cutout", icon: null },
    copy: { summary: "The towering fourth evolution of the Rumbler™ line, with deeper violet stone and larger Prism Shards.", behaviour: "An imposing apex form.", where: "Prism Ridge™." },
    encounter: [],
    views: {}, states: {}, angles: angles(), cardScale: 1.0, height: null, scale: null,
    evolution: { line: "boulder", phase: 4 },
  },
  // ---------------- hazards ----------------
  "rolling-boulder": {
    name: "Rumbler™", type: "hazard", status: "APPROVED",
    // ROLLING_BOULDER_PRODUCTION_MASTER_V1 (approved Phase 1 production master; replaces the old provisional crop)
    media: { thumb: E + "rumbler-v13", render: E + "rumbler-v13", icon: null },
    copy: { provisional: true, summary: "Energized rolling boulder.", behaviour: "Rolls downhill and smashes obstacles.", where: "Found across Adventure Mountain™." },
    encounter: [],
    views: {  },
    states: { "Rolling": "assets/entities/studio/rolling-boulder-rolling-st", "Fracture": "assets/entities/studio/rolling-boulder-fracture-st", "Impact": "assets/entities/studio/rolling-boulder-impact-st" },
    angles: angles(), cardScale: 0.74, height: 1.5, scale: null,
    evolution: { line: "boulder", phase: 1 },
    // PUBLIC CURATION 2026-10-11: in-world + Rolling + Impact. Archived: Destroyed (grey rubble WITHOUT the canonical amber/yellow crystals: wrong, source missing), Idle/Cracked (dupes), 4 turnarounds.
    archived: { "Idle": "assets/entities/rolling-boulder-idle", "Cracked / hit": "assets/entities/rolling-boulder-cracked", "Destroyed": "assets/entities/rolling-boulder-destroyed", "Front": "assets/entities/rolling-boulder-front", "Side": "assets/entities/rolling-boulder-side", "Back": "assets/entities/rolling-boulder-back", "Top": "assets/entities/rolling-boulder-top" },
    // 2026-10-13: owner-confirmed Rumbler still (1254 px) replaces the 351 px hero (file kept: rolling-boulder-threeq).
  },

  // ---------------- portals / props / collectibles ----------------
  "portal": {
    name: "Portal", type: "portal", status: "APPROVED",
    // 2026-10-13 owner QA: the generic generated portal image is retired; the dossier leads with the established
    // Portal Meadow™ design (the starting portal). Every regional portal follows below.
    media: { thumb: null, render: "assets/systems/portals/v13/meadow", icon: null },
    copy: { summary: "Regional fast-travel portal.", behaviour: "Connects discovered areas of Adventure Mountain™.", where: "Found across Adventure Mountain™." },
    encounter: [],
    // Canonical region order (03_CANONICAL_REGION_REFERENCE_INDEX). Every entry shows approved portal artwork.
    // 2026-10-13 owner-approved regional portal scenes (private Drive originals unchanged; public derivatives only).
    // Order = owner's final route: … Fallen Grounds → Frosty Peaks → Summit Spine → Prism Ridge (final destination).
    states: { "Portal Meadow™": "assets/systems/portals/v13/meadow", "Creek Crossing™": "assets/systems/portals/v13/creek", "Riverworks™": "assets/systems/portals/v13/river", "Clover Cliffs™": "assets/systems/portals/v13/clover", "Fallen Grounds™": "assets/systems/portals/v13/fallen", "Frosty Peaks™": "assets/systems/portals/v13/frost", "Summit Spine™": "assets/systems/portals/v13/summit", "Prism Ridge™": "assets/systems/portals/v13/prism-ridge-final" },
  },
  "springboard": {
    name: "Springboard", type: "prop", status: "APPROVED",
    // 09_SPRINGBOARD/SPRINGBOARD_TURNAROUND_LOCKED (the only approved springboard)
    media: { thumb: "assets/objects/springboard/front", render: "assets/objects/springboard/front", icon: null },
    copy: { summary: "Red domed springboard on a GB base.", behaviour: "Jump on it to launch to higher ledges and hidden routes.", where: "Found across Adventure Mountain™." },
    encounter: [],
    states: { "Neutral": "assets/objects/springboard/neutral", "Compressed": "assets/objects/springboard/compressed", "Rebound": "assets/objects/springboard/rebound" },
    views: {  },
    angles: angles(), scale: null,
    // PUBLIC CURATION 2026-10-11: 3 in-world scenes + Neutral/Compressed/Rebound. Archived: Settling (dupe), 5 turnarounds.
    archived: { "Settling": "assets/objects/springboard/settling", "Front": "assets/objects/springboard/front", "Left side": "assets/objects/springboard/left", "Back": "assets/objects/springboard/back", "Right ¾": "assets/objects/springboard/threeq", "Top": "assets/objects/springboard/top" },
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
    copy: { summary: "Handheld hacking device, shown in GB Blue.", behaviour: "Metallic dial and vertical thumbwheel. Four controls: red Action/Acquire, blue Scan/Monitor, yellow App/Program Selector and purple Settings.", where: "Carried by the Gamers. Designed for hacking machines such as the Sentry Cannon." },
    encounter: [], states: {}, angles: angles(), scale: null,
  },
  "smartwatch": {
    name: "SMARTWATCH", type: "gadget", status: "APPROVED",
    media: { thumb: "assets/gear/smartwatch-lineup", render: "assets/gear/smartwatch-lineup", icon: null },
    copy: { summary: "The Gamers' smartwatch, in Blue, Red, Yellow and Purple.", behaviour: "Runs the Gamers' hacking software alongside the watch face.", where: "Worn by every Gamer." },
    encounter: [], states: {}, views: { "Lineup": "assets/gear/smartwatch-lineup", "Showcase": "assets/gear/smartwatch-hardware" }, angles: angles(), scale: null,
  },
  "glitchkey": {
    name: "GlitchKey™", type: "gadget", status: "PENDING",
    media: { thumb: null, render: null, icon: null },
    copy: { summary: "More to come.", behaviour: "More to come.", where: "More to come." },
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
  boulder: ["rolling-boulder", "stone-golem", "crystal-guardian", "brightback"],
};

// evolution detail: cutout sequence and in-world steps (no mechanics captions in public files)
const X = E + "evolution/";
window.GB_EVOLUTION_DETAIL = {
  boulder: {
    // uniform 4:3 studio tiles (approved form art, subject unaltered) so every step reads at the same size
    sequence: [
      { src: X + "seq/seq-rumbler", label: "Dormant", phase: 1 },
      { src: X + "seq/seq-rolling", label: "Rolling", phase: 1 },
      { src: X + "seq/seq-impact", label: "Impact", phase: 1 },
      { src: X + "seq/seq-cracked", label: "Fracture", phase: 1 },
      { src: X + "seq/seq-forming", label: "Forming", phase: 2 },
      { src: X + "seq/seq-stone-walker", label: "Stone Walker™", phase: 2 },
      { src: X + "seq/seq-prism-keeper", label: "Prism Keeper™", phase: 3 },
      { src: X + "seq/seq-brightback", label: "Brightback™", phase: 4 },
    ],
    // 2026-10-13 owner QA: transformation mechanics are not disclosed publicly (spoilers). The Mechanics tab shows each
    // form's public summary and behaviour copy from its own dossier instead.
    scenes: [
      { src: X + "evo-step-1", label: "Rumbler™", phase: 1 },
      { src: X + "evo-step-2", label: "Energized", phase: 1 },
      { src: X + "evo-step-3", label: "Fracture", phase: 1 },
      { src: X + "evo-step-4", label: "Stone Walker™ forming", phase: 2 },
      { src: E + "scenes/stone-golem-ingame", label: "Stone Walker™", phase: 2 },
      { src: E + "scenes/crystal-guardian-ingame", label: "Prism Keeper™", phase: 3 },
      // no approved in-world Brightback™ scene without a wrong-region banner: the approved V1 form tile stands in
      { src: X + "seq/seq-brightback", label: "Brightback™", phase: 4, reference: true },
    ],
  },
};

// Fast Travel extras per portal: `area` = the region's area guide (only linked while that area is open); `note` = honest status text;
// `color` = dot colour when the region is not in GB_WORLD.regions. Summit Spine™ is a canonical region (Visual Design Bible, region index) but is not a
// public area yet (world-data.js lists it as a sub-region of Prism Ridge™), so it is shown as a portal preview only.
// 2026-10-13: Prism Ridge™ (final destination) uses the owner-approved final scene with the giant cyan summit portal; Summit Spine™
// keeps its own smaller purple base portal. Earlier temporary/rejected Prism Ridge images (pr04 as FT, portal-prism-ridge crop) not used here.
window.GB_PORTAL_META = {
  "Portal Meadow™": { area: "portal", fx: "62%" }, "Creek Crossing™": { area: "creek", fx: "34%" }, "Riverworks™": { area: "river", fx: "30%" }, "Clover Cliffs™": { area: "clover", fx: "74%" },
  "Fallen Grounds™": { area: "ruin", fx: "78%" }, "Frosty Peaks™": { area: "frost", fx: "84%" },
  "Summit Spine™": { note: "The climb toward Prism Ridge™ begins here. Portal preview only: its area guide is not published yet.", color: "#8d4fe0", fx: "76%" },
  "Prism Ridge™": { area: "prism", fx: "50%", fy: "20%" },
};

// display order for the Enemies & Hazards section
// display order for the Adventure Finds™ section
window.GB_OBJECTS = ["treasure-chest", "crystal-chest", "coin", "character-coins", "adventure-crystal", "secret-key", "springboard", "crate"];
window.GB_BESTIARY = ["goom", "spike-bot", "rotor-bot", "claw-bot", "sentry-cannon", "rolling-boulder", "stone-golem", "crystal-guardian", "brightback"];
// In-game view of each enemy (cropped from the approved production masters' in-game renders):
// the enemy card image and the dossier's opening view. Production cutouts stay as selectable views.
const SC = "assets/entities/scenes/";
window.GB_ENTITY_SCENE = {
  // crop of the approved final-goom scene (x 0–425): drops the malformed background Goom (owner QA 07); original kept
  // Goom in-world withdrawn 2026-10-13 (owner QA): the scene's blue flag does not match its region and cannot be
  // cropped out without cutting Goom's spike. Goom leads with its clean hero until an approved in-world image exists.
  "spike-bot": { src: SC + "spike-bot-ingame", fx: 50 },
  // Rotor Bot™ in-world scene removed 2026-10-10: it showed the superseded propeller-fin design.
  // Owner explicitly rejected former Sentry Cannon "In the world" image: unapproved
  // person and beam scene. Hostile canonical model will be the main hero without it.
  // Do not re-enable this source until an approved in-world replacement exists.
  "springboard": [{ src: "assets/objects/springboard/scene-portal-meadow", fx: 45, label: "Portal Meadow™" }, { src: "assets/objects/springboard/scene-riverworks", fx: 45, label: "Riverworks™" }, { src: "assets/objects/springboard/scene-frost-peaks", fx: 45, label: "Frosty Peaks™" }],
  // Rolling hero from the approved Rolling Boulder Full Reference Card (1117 px; was 704 px)
  "rolling-boulder": { src: SC + "rolling-boulder-rolling-hero", fx: 50 },
  "stone-golem": { src: SC + "stone-golem-ingame", fx: 50 },
  "crystal-guardian": { src: SC + "crystal-guardian-ingame", fx: 50 },
  "brightback": [
    // "Four-view turnaround" removed from public view 2026-10-11 (technical turnaround; thin strip left a large blank stage); file kept
    { src: E + "brightback-v1-face-clean", fx: 50, label: "Face and core detail" },
    // "Prism Shard detail" (brightback-v1-hand-clean, 288 px) removed from public view 2026-10-11: shown at 0.4x density on phones; file kept
  ],
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
  // 2026-10-13: the software name is not owner-approved; old #entity/quickhack links resolve to the SMARTWATCH
  "quickhack": "smartwatch", "quick-hack": "smartwatch",
  "smart-watch": "smartwatch",
  "clawbot": "claw-bot",
  "claw": "claw-bot",
  "watch": "smartwatch",
};
})();
