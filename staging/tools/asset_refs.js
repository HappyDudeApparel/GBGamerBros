// Prints every public asset reference in the site data as JSON lines {use, key}.
// "use" is the data path (e.g. GB_ENTITIES.goom.media.thumb). Entries under an `archived` key are kept
// for provenance only and are reported separately (use starts with "ARCHIVED:").
// Usage: node tools/asset_refs.js [path/to/staging]
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const ctx = { window: {}, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
for (const f of ["areas.js", "entities.js", "world-data.js", "characters.js"]) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f });
}
const out = [];
const norm = s => s.replace(/(-960|-720)?\.(webp|png|jpe?g)$/i, "");
function walk(v, use, archived) {
  if (typeof v === "string") {
    if (/^assets\//.test(v)) out.push({ use: (archived ? "ARCHIVED:" : "") + use, key: norm(v) });
    return;
  }
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${use}[${i}]`, archived));
  if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v)) walk(x, `${use}.${k}`, archived || k === "archived");
}
for (const [g, v] of Object.entries(ctx.window)) if (g.startsWith("GB_") && g !== "GB_MEDIA" && g !== "GB_PANORAMA") walk(v, g, false);
// static references in the page and stylesheet
for (const f of ["index.html", "staging.css"]) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, "utf8").matchAll(/assets\/[A-Za-z0-9_\/.-]+?\.(?:webp|png|jpe?g)/g)) out.push({ use: f, key: norm(m[0]) });
}
for (const f of ["staging.js", "world.js"]) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, "utf8").matchAll(/["'`](assets\/[A-Za-z0-9_\/.-]+)["'`]/g)) out.push({ use: f, key: norm(m[1]) });
}
process.stdout.write(JSON.stringify(out));
