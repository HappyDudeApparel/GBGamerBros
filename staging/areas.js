// GB GAMER BROS™ — area gallery data (Pass B)
// One entry per map location. The gallery is built entirely from this data.
//
// views[].kind     establishing | ground | traversal | landmark | closeup
// views[].label    working label for the view (not final marketing copy)
// views[].focus    0–1 horizontal focal point used when portrait screens crop the frame
// views[].hotspots Pass E: percentage boxes over the full image, e.g.
//                  { id:"spring-1", type:"spring", x:72, y:58, w:10, h:14, label:"Bounce pad" }
//                  x/y/w/h are % of image width/height, so they hold at every screen size.
//
// `ready: false` keeps an area closed until its gallery is approved.

window.GB_AREAS = {
  portal: { name: "Portal Meadow™",  sub: "The Adventure Begins",          ready: false, views: [] },
  creek:  { name: "Creek Crossing™", sub: "Bridges & Rapids",              ready: false, views: [] },
  river: {
    name: "Riverworks™",
    sub: "Waterfalls & Pipeways",
    ready: true,
    views: [
      {
        src: "assets/areas/riverworks/01-canyon_of_crystal_waterworks",
        kind: "establishing", label: "Pipeway canyon", focus: 0.48,
        alt: "Riverworks™ canyon from above: blue pipeways, stone bridges and waterfalls beside a glowing portal",
        hotspots: [],
      },
      {
        src: "assets/areas/riverworks/02-gb_waterfall_riverworks_adventure",
        kind: "ground", label: "Boardwalk", focus: 0.36,
        alt: "Player-height view along a wet boardwalk past a pipe waterfall, crates and a bounce pad",
        hotspots: [],
      },
      {
        src: "assets/areas/riverworks/03-riverworks_canyon_pipeline_adventure",
        kind: "traversal", label: "Pipeline route", focus: 0.66,
        alt: "Boardwalk route between large blue pipes with a bounce pad, gems and a signpost ahead",
        hotspots: [],
      },
      {
        src: "assets/areas/riverworks/04-cinematic_gb_mountain_waterfall_adventure",
        kind: "landmark", label: "Pipe falls", focus: 0.7,
        alt: "Cliffside walkway beside a pipe outflow waterfall, overlooking the terraced canyon",
        hotspots: [],
      },
    ],
  },
  clover: { name: "Clover Cliffs™",  sub: "Forest Trails",                 ready: false, views: [] },
  ruin:   { name: "Ruin Courtyard™", sub: "Forgotten Towers",              ready: false, views: [] },
  prism:  { name: "Prism Ridge™",    sub: "Crystal Peaks & Ancient Ruins", ready: false, views: [] },
  frost:  { name: "Frost Peaks™",    sub: "Icy Cliffs & Granite Roads",    ready: false, views: [] },
};
