# GB GAMER BROS™ — project status / handoff

Checkpoint: 2026-10-05 · dev branch `ccr-aefb96a7-5w3hgh`

## Live staging
- URL: https://gb.happydude.ca/staging/
- Live build: **`r-46ccc427`**, main `767d14f` (visual correction pass; see below). Previous: `r-93f82a77`.
- Root homepage and `/v2/` are untouched. Never change them.

## Publishing workflow (every user-visible change)
1. Edit on the dev branch.
2. `python3 staging/tools/revision.py` stamps revisions and runs checks (exit 0 = clean).
3. Test locally: `python3 -m http.server` from the repo root, then open `/staging/`.
4. Commit and push the dev branch.
5. `python3 staging/tools/publish.py` publishes the public `/staging/` files to main. It refuses if anything outside staging would change and never ships `*.md` or `tools/`.
6. Check the Pages run (GitHub Actions "pages build and deployment") and report the new build ID.

Shell note: don't run `pkill -f "http.server"` inside a compound command. It matches its own shell line and kills the whole command.

## COMPLETED — target match pass (2026-10-05)
- **Enemies:** cards and dossier opening views now use in-game renders (`GB_ENTITY_SCENE` in entities.js, assets/entities/scenes/*-ingame) cropped from the production masters' in-game panels: Goom/Sentry Cannon (Game Asset Production sheet), Spike Bot and Rotor Bot (Enemy & Hazard Assets v1), Rolling Boulder / Stone Golem / Crystal Guardian (owner-uploaded production masters). By owner direction this supersedes the "never crop boards" rule for these in-game panels only; no labels/text are included. Blurred-terrain backdrops removed. Dossier: "In the world" view first; production cutouts remain selectable views.
- **Goom:** new **Defeated** state (X-eyes, squashed) keyed to a transparent cutout (`goom-defeated-dizzy`); states are now Active / Inactive / Defeated.
- **Meet the Team™:** rebuilt to the approved target strip: wide team-colour cards (order Purple, Blue, Red, Yellow), streetwear figures large and breaking out above the card, colour word + name + target tagline + "View character"; scenic background; phone = snap carousel with peek.
- **Portrait hero:** target composition: one GB logo heading a compact top-left cluster (headline, tagline, Steam, icons); high-five characters large and centred below; sign lower right; scene slides fill the whole hero (per-slide portrait focus `--psx`).

## COMPLETED — visual correction pass (2026-10-05, build r-46ccc427)
- **Locations:** replaced the old floating-island "waterfall/bridge overload" renders (blue banners in every region) with the canonical Drive region sequences (folder "01_Portal_Meadow" … "07_Frost_Peaks"): Portal Meadow™ PM01–03, Riverworks™ RW02–04, Ruin Courtyard™ RC01–03, Clover Cliffs™ CL01–04 (now open), Frost Peaks™ FP01, FP02, FP04 (now open). Not used: collages FP03 / RW01 / RW05 and the busy "Ruin Courtyard Exiting towards Summit Spine" overview. Masters stay private (scratch only); derivatives via gbmedia.py.
- **Prism Ridge™:** all four old views carried non-canonical blue banners → removed; purple region-identity card (`identity.theme: "crystal"`) until approved Prism Ridge art exists. **Creek Crossing™** keeps its single plank-bridge view (blue = its canonical colour); still waiting for a full set.
- **Region colour coding:** canonical banner fields (WORLD_ASSET_STANDARD.md §1) added as `color` in world-data.js; area cards carry a region colour bar.
- **Transparency:** all cutout sources verified to have alpha; white-matte halos removed from all 102 cutouts with new `tools/gbdefringe.py` (not idempotent: run once per newly built cutout). Stale encounter links to replaced views cleared (portal, springboard, crate, adventure crystal).
- **Enemies / dossiers:** cards and dossier stages now sit on soft in-world backdrops (`GB_ENTITY_ENV` in entities.js; presentation only, not encounter claims); dossier hero reduced and framed with vignette/blur; thumbnails on navy instead of white studio tiles.
- **Meet the Team™:** shaped team-colour panels (cut top-right corner), whole figure inside the card (no head overflow / leg crop), equal card heights, phone carousel heading fits on one line.
- **Portrait hero:** headline, tagline, CTA and pillar icons form one top-left cluster with a local shade (the full-height dark band is gone); topbar GB logo hidden in portrait because the Adventure Mountain™ sign already carries it; figure and sign repositioned so neither covers the other. Desktop/landscape unchanged (approved target keeps the header logo).
- **Clouds:** solid bright puffs (no 85 % grey layer); area gallery/Level Preview srcsets now use real derivative widths.
- Tests: six viewports clean (no console errors, no failed requests, no overflow); functional suite passes.

## Waiting on approved art (visual)
- Prism Ridge™ views (purple banners), Creek Crossing™ additional views.
- Hero world plate, Level Preview stills and the fallback front map still contain blue banners in every region (source-art correction; never repainted in CSS).
- Drive also holds `Adventure_Mountain_360_FINAL_Panorama_14400x3200.png` and `Adventure_Mountain_FINAL_MASTER_A_v3_3x2.png` — not installed (panorama is its own upgrade; see below).

## COMPLETED — site completion pass (2026-10-04, build r-93f82a77)
- **Hero/carousel:** phone portrait (<600 px, portrait) hides the carousel arrows (dots + swipe remain) and skips slide 3 (`data-skip="phone-portrait"`; dots/labels renumber, rotation re-syncs on orientation change). Tablet portrait arrows moved to the outer ends of the dot row (off the feet). Phone landscape logo has 10 px safe top padding (smaller min size so it clears the headline). `viewport-fit=cover` safe-area insets applied to logo, menu, copy and arrows.
- **Cloud transition:** clouds grouped in `.cloudfx` (transition layer only, `pointer-events:none`, z above the map, below hero characters). They fade to 30 % once the visitor drags the map (`.is-exploring`). Fixed a portrait seam: the map's top fade now equals the hero overlap (−44 --p). No animation, so reduced motion is unaffected.
- **Map component:** new `world.js` viewer + `world-data.js` + `panorama-manifest.js` (see "Map / panorama contract"). Old scroll-based map JS, the HTML hotspot list, dormant `data-labels` logic and all superseded map/minimap/pin CSS removed. Visible title "Explore Adventure Mountain™" (chip on the lower-right cloud bank on landscape; below the map on portrait). "360° World" badge and wording only appear in panorama mode (`[data-when]`).
- **Portrait fallback map:** opens at zoom 2 framed on x = 0.715 so the visible baked labels (Prism Ridge™, Ruin Courtyard™, Riverworks™, Frost Peaks™) are whole; drag/swipe with momentum, pan buttons (moved off the labels), minimap, "Whole map" / "Zoom in".
- **Enemies & Hazards:** card bottoms aligned per row; Stone Golem / Crystal Guardian capped at 106 % card width so they no longer spill into neighbours (they still read heavier: taller and wider than Rolling Boulder).
- **Copy cleanup (public):** removed "Asset previews, not in-game screenshots", "Gameplay video not yet available", dossier status labels ("Approved production art"/"Provisional concept"), "Working copy · not final", "match to confirm", "Concept thumbnail…", the character-sheet note. "Artwork in production" → "Coming soon". "Play Together" keeps its "In development" chip. Title no longer says "(Staging)". Dead nav link `#media` → `#level-preview`.
- **Footer:** staging note removed; footer nav (World, Areas, Enemies & Hazards, Meet the Team™); approved notice; approved line "Adventure Mountain™ artwork, characters, environments and visual assets are original project material." Build ID kept in a hidden element (`#gbRev`, still stamped by revision.py).
- **Image deterrence (not DRM):** no drag-out / long-press save on published art (CSS), no context menu on map images, map art not in links. Masters stay private; gbmedia metadata + band unchanged (273/273 rasters verify).
- **Dead code:** dead CSS rules for retired selectors removed (evo-teaser, slide--still/blue-*, stage-floor, dossier__flag, char__note, staging-note, panel__note…). Untracked `tools/__pycache__`.
- **Tests run:** six viewports (1920×1080, 1366×768, 1180×820, 820×1180, 844×390, 390×844): no console errors, no failed requests, no body overflow. Functional: carousel, slide gating, rotation, map zoom/pan/minimap, hotspot → `#area/…`, Esc, `#entity/rock-guy` alias, `#character/…`, Tab focus ring, reduced motion (no transition, no autoplay). Panorama mode exercised in an isolated scratch copy built from a 2304×512 preview image (drag, momentum, keys, wrap, lazy tiles; not committed).

## WAITING ONLY FOR THE CORRECTED PANORAMA
1. **Source:** final master path (keep it outside the repo).
2. **Derivatives:** `python3 staging/tools/gbpano.py check <master>` (size + wrap-seam report), then `python3 staging/tools/gbpano.py build <master> --version pano-YYYY-MM-DD`. Writes `assets/world/` tiers (540/1080/2160 px, 1024 px strips) + overview and `panorama-manifest.js`. The site switches to panorama mode automatically.
3. **Manifest:** produced by step 2; `revision.py` stamps tile revisions and checks every tile exists.
4. **Coordinates:** measure the seven regions on the master; set `world: { x, y }` in `world-data.js` and `coordinateAuthority` to the version. Region pins appear only after that. Do NOT reuse the fallback boxes or the first Astra panorama's numbers.
5. **Minimap:** uses the panorama overview automatically; check its framing.
6. **Panorama QA:** six viewports, seam at x = 0/1, tier choice on phones, overlay wrap, cloud overlap, then publish.
- Rollback to fallback: `python3 staging/tools/gbpano.py clear`.
- Note: the 2304×512 preview attached on 2026-10-04 reports a wrap-seam difference of 30/255 (left/right edges don't match). The corrected master should loop.

## Map / panorama contract
- `world.js` → `window.GBWorld.create(root, { panorama })`. Mode = `panorama` if `GB_PANORAMA` validates, else `fallback` (the `<img class="map__img">` in index.html; size from its width/height attributes, never from the file).
- Shared: drag, touch swipe (vertical scroll left to the page), momentum, ← → Home End, horizontal wheel, pan buttons, minimap, overlays via `addOverlay(el, {x,y} | {l,t,w,h})` in 0–1 coordinates (wrap-aware).
- `world-data.js`: stable region ids/names/icons, `fallback` boxes (valid only for the current fallback map), `world: null` (unlocked), non-public sub-region Summit Spine, empty Phase 2 marker arrays (flags, portals, spawns, enemies, hazards, springboards, collectibles, objectives).
- Fallback map has baked labels; a label-free map is only expected with the panorama.

## Pass C.5 (done in this run)
- Enemy names migrated: Rotor Bot, Sentry Cannon, Stone Golem; section renamed Enemies & Hazards; 7-card grid; legacy aliases via `GB_ENTITY_ALIASES` (`#bad-guys` anchor kept).
- Phone/tablet portrait map: the whole world is shown first; "Explore the map" or a tap zooms in (centred on the tap) with arrows and the minimap; "Whole map" returns.
- Clover Cliffs™ / Frost Peaks™ cards use region-identity placeholders (forest green + tree, ice blue + snowflake).
- "Artwork in production" tiles redesigned (navy tile with icon).

## Major asset + Meet the Team™ update (this run)
- Meet the Team™ section (`#characters`, alias `#team`) after Enemies & Hazards: 4 cards (desktop 4 across; 720–899 2×2; phone snap carousel with arrows).
- Character routes `#character/<id>[/sporty|streetwear]` (blue, red, purple, yellow): Sporty/Streetwear selector, views gallery, team switcher; Back/Esc/history like the dossier.
- Goom, Rotor Bot, Sentry Cannon: approved production art (cards, dossier hero, production views, states). See CHARACTER_ASSETS.md / ENEMY_ASSET_STANDARD.md.
- Enemies & Hazards is now a full-width panel (7 across / 4 / 2); Level Preview + Fast Travel share a row; branding footer with the approved copyright line.
- `gbmedia.py build` accepts an optional small width.

## Visual convergence pass (target: WEBSITE_TARGET_REFINEMENT_2026-10-01/PRIMARY_TARGET_FINAL_LAYOUT.png)
- One cloud system: the same puff scale at every size (`--cw`/`--ch` on .world), bank dissolves into the shared cloud white (`--cloud`); page continues on the cloud sea; feature row overlaps the cloud edge.
- Portrait map opens zoomed in (world art dominant), "Whole map" + minimap still available.
- Region labels: baked into adventure-mountain-map.webp (inpainting rejected: artefacts). Superseded 2026-10-04: pins now belong to panorama mode (world.js).
- Lower row: Level Preview / Fast Travel / Enemies & Hazards in one three-part row; enemy cards 4-up with per-enemy `cardScale` (Stone Golem / Crystal Guardian break the frame); evolution teaser is now the 8th tile.
- Area rail: 5:4 image cards, soft faded ends, edge arrows, peeking card.
- Meet the Team™: team-colour panels, figures rise above the frame; no new copy.
- Dossier/character views: no labels over the art (caption below).
- Crystal Guardian "Defeated" derivative re-cut (holes in rock body fixed); master untouched.
- Fixed a tablet/phone layout-viewport overflow (grid min-content blowout of .systems__inner / .rail-block).

## Enemies & Hazards production pass 2 (manifest V2)
- All 7 enemy cards use approved production art (no "Artwork in production" left in the section).
- Dossiers: hero + production views + visual states (tap to swap the hero); phone galleries are swipe rails.
- Evolution component in the Rolling Boulder / Stone Golem / Crystal Guardian dossiers: tabs Sequence (7 cutouts) / Mechanics (4 close-ups) / In the world (6 scene steps); still optional, no trigger.
- Evolution teaser band under the grid ("See how it evolves" opens the Rolling Boulder dossier at the evolution block).
- Data: `GB_EVOLUTION_DETAIL` in entities.js; assets in `assets/entities/evolution/`.

## Loose assets installed (see CHARACTER_ASSETS.md)
- Hero character layer is now the clean Blue/Red high-five (no cropped hand).
- Hero: 3 slides (high-five on world plate; Blue world action; Purple/Yellow world action).
- Level Preview: Blue/Red cliffside, Purple/Yellow boardwalk, four-character climb, trail junction.
- Video stills retired from the hero and Level Preview.
- revision.py now stamps `srcset` and includes the HTML in the build hash.

## Enemy naming cleanup (old notes)
- **Canonical IDs:** `goom`, `spike-bot`, `rotor-bot`, `sentry-cannon`, `rolling-boulder`, `stone-golem`, `crystal-guardian`.
- **Collectibles:** `coin`, `adventure-crystal` (formerly `gem`), `secret-key`, `treasure-chest`.
- **No routing aliases exist yet.** `#entity/gem` currently opens nothing. If old IDs or links need to keep working, add an alias map (e.g. `gem → adventure-crystal`) in the router.
- **Sheet text not adopted:** "Aerial Form" under Stone Golem (sheet error), "jump on to defeat" (design intent only). Crystal Guardian attack type is TBD.
- **Enemies & Hazards grid:** shows 6 cards; Stone Golem is reached only through the evolution links. Decide whether it gets its own card.

## Not started (wait for instruction)
- Meet the Team™ (Pass D): waiting for the character production assets.
- Pass E world-object hotspots. The data model is ready: `{ ref, x, y, w, h }` in `areas.js`.
- World-asset normalisation (banners/crates/springboards) of gallery images.

## Key files (dev branch)
- `VISUAL_AUTHORITY.md`: authority boards and precedence.
- `ENEMY_ASSET_STANDARD.md`: per-enemy tracking, states and the Unreal/Astra reference.
- `WORLD_ASSET_STANDARD.md`: region colours and the banner/crate/springboard specs.
- `ASSET_ASSIGNMENTS.md`: per-image area assignments and status.
- `ASSET_AUDIT.md`: Pass A sources.
- `tools/`: `gbmedia.py`, `revision.py`, `publish.py`, `gbpano.py`.
- Site: `index.html`, `staging.css`, `staging.js`, `world.js`, `world-data.js`, `panorama-manifest.js`, `areas.js`, `entities.js`, `characters.js`.
