// GB GAMER BROS™ — Adventure Mountain™ world data (stable IDs + coordinate schema)
//
// COORDINATES ARE UNLOCKED. The corrected 360° panorama becomes the coordinate authority
// when it is installed. Until then:
//   * `world` is null for every region (no panorama-space position is claimed);
//   * `fallback` points { x, y } (0–1) are region pin positions measured on the CURRENT fallback map,
//     the approved 0° front master (assets/adventure-mountain-front.webp, cropped y 30–990 of
//     01_WORLD_0_FRONT_MASTER_REFERENCE). Valid ONLY for that image; never reused as panorama coordinates.
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
    { id: "portal", color: "#E8A812", area: "portal", name: "Portal Meadow™",   sub: "The Adventure Begins",          icon: "i-portal",
      fallback: { x: 0.49, y: 0.875 }, world: null },
    { id: "creek", color: "#1E6FD9",  area: "creek",  name: "Creek Crossing™",  sub: "Bridges & Rapids",              icon: "i-traversal",
      fallback: { x: 0.51, y: 0.635 }, world: null },
    { id: "river", color: "#B8692A",  area: "river",  name: "Riverworks™",      sub: "Waterfalls & Pipeways",         icon: "i-spiral",
      fallback: { x: 0.85, y: 0.59 }, world: null },
    { id: "clover", color: "#23864A", area: "clover", name: "Clover Cliffs™",   sub: "Forest Trails",                 icon: "i-tree",
      fallback: { x: 0.195, y: 0.47 }, world: null },
    { id: "ruin", color: "#C8283B",   area: "ruin",   name: "Fallen Grounds™",  sub: "Broken Arches & Old Stone",              icon: "i-secret",
      fallback: { x: 0.15, y: 0.18 }, world: null },
    { id: "prism", color: "#7A3CC8",  area: "prism",  name: "Prism Ridge™",     sub: "Crystal Peaks & Ancient Ruins", icon: "i-reward",
      fallback: { x: 0.5, y: 0.115 }, world: null },
    { id: "frost", color: "#7CC6F2",  area: "frost",  name: "Frosty Peaks™",     sub: "Icy Cliffs & Granite Roads",    icon: "i-snow",
      fallback: { x: 0.86, y: 0.21 }, world: null },
  ],

  // Geographic sub-regions that are NOT public areas (no card, no route, no pin).
  subregions: [
    { id: "summit-spine", name: "Summit Spine™", parent: "prism", public: false, world: null },
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
