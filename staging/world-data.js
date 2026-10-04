// GB GAMER BROS™ — Adventure Mountain™ world data (stable IDs + coordinate schema)
//
// COORDINATES ARE UNLOCKED. The corrected 360° panorama becomes the coordinate authority
// when it is installed. Until then:
//   * `world` is null for every region (no panorama-space position is claimed);
//   * `fallback` boxes { l, t, w, h } (left/top/width/height, 0–1) are measured against the CURRENT fallback map
//     (assets/adventure-mountain-map.webp) — they sit over that image's baked labels and
//     are valid ONLY for it. They are never reused as panorama coordinates.
//
// World coordinate system (panorama mode):
//   x = 0–1 around the world circumference (wraps: 1.0 ≡ 0.0)
//   y = 0–1 from the panorama's top edge to its bottom edge
//   a point marker is { x, y }; an area marker adds { w, h } (also 0–1, centred on x/y)
//
// To lock coordinates after the panorama arrives: measure each region on the panorama
// master, set `world: { x, y }`, set GB_WORLD.coordinateAuthority to the panorama version
// from panorama-manifest.js, and the viewer shows region pins in panorama mode.
(() => {
window.GB_WORLD = {
  schema: 1,
  coordinateAuthority: null,          // e.g. "pano-2026-10-20" once measured; null = unlocked

  // Seven public regions. `area` is the gallery id in areas.js (routes #area/<id>).
  // `color` = canonical region banner field (WORLD_ASSET_STANDARD.md §1): cards, pins, placeholders.
  regions: [
    { id: "portal", color: "#16A38A", area: "portal", name: "Portal Meadow™",   sub: "The Adventure Begins",          icon: "i-portal",
      fallback: { l: .055, t: .645, w: .156, h: .147 }, world: null },
    { id: "creek", color: "#1E6FD9",  area: "creek",  name: "Creek Crossing™",  sub: "Bridges & Rapids",              icon: "i-traversal",
      fallback: { l: .301, t: .537, w: .148, h: .136 }, world: null },
    { id: "river", color: "#B8692A",  area: "river",  name: "Riverworks™",      sub: "Waterfalls & Pipeways",         icon: "i-spiral",
      fallback: { l: .531, t: .558, w: .146, h: .141 }, world: null },
    { id: "clover", color: "#23864A", area: "clover", name: "Clover Cliffs™",   sub: "Forest Trails",                 icon: "i-tree",
      fallback: { l: .231, t: .212, w: .137, h: .134 }, world: null },
    { id: "ruin", color: "#C8283B",   area: "ruin",   name: "Ruin Courtyard™",  sub: "Forgotten Towers",              icon: "i-secret",
      fallback: { l: .585, t: .335, w: .165, h: .132 }, world: null },
    { id: "prism", color: "#7A3CC8",  area: "prism",  name: "Prism Ridge™",     sub: "Crystal Peaks & Ancient Ruins", icon: "i-reward",
      fallback: { l: .474, t: .180, w: .167, h: .136 }, world: null },
    { id: "frost", color: "#7CC6F2",  area: "frost",  name: "Frost Peaks™",     sub: "Icy Cliffs & Granite Roads",    icon: "i-snow",
      fallback: { l: .791, t: .190, w: .169, h: .134 }, world: null },
  ],

  // Geographic sub-regions that are NOT public areas (no card, no route, no pin).
  subregions: [
    { id: "summit-spine", name: "Summit Spine", parent: "prism", public: false, world: null },
  ],

  // Phase 2 gameplay overlays. Reversible: they never touch the base imagery.
  // Each entry: { id, ref (entities.js id, optional), x, y, [w, h], label? }
  // Empty until placements are approved against the corrected panorama.
  markers: {
    flags: [], portals: [], spawns: [], enemies: [], hazards: [],
    springboards: [], collectibles: [], objectives: [],
  },
};
})();
