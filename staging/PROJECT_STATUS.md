# GB GAMER BROS™ — project status / handoff

Checkpoint: 2026-10-05 · dev branch `ccr-aefb96a7-5w3hgh`

## Live staging
- URL: https://gb.happydude.ca/staging/
- Live build: **`r-6f8645e4`** (handoff pass). **Production (root) = r-6f8645e4 since 2026-10-10, main a266aa9.**
- Root homepage and `/v2/` are untouched. Never change them.

## Publishing workflow (every user-visible change)
1. Edit on the dev branch.
2. `python3 staging/tools/revision.py` stamps revisions and runs checks (exit 0 = clean).
3. Test locally: `python3 -m http.server` from the repo root, then open `/staging/`.
4. Commit and push the dev branch.
5. `python3 staging/tools/publish.py` publishes the public `/staging/` files to main. It refuses if anything outside staging would change and never ships `*.md` or `tools/`.
6. Check the Pages run (GitHub Actions "pages build and deployment") and report the new build ID.

Shell note: don't run `pkill -f "http.server"` inside a compound command. It matches its own shell line and kills the whole command.

## PHASE 5 — block 1 (2026-10-10, build r-9fea5c71) — STAGING ONLY, awaiting owner review
Brief: 00B_CLAUDE_SITE_REFRESH_2026-10-10 (Drive doc 1yn2IjKOtJDdJzLfQYj8HiwvZJ1q-RiiMfbHeVsbz-rY). Production root untouched.
Done:
- NEW Gear & Tech panel (#gear, after Adventure Finds™): PATCHPAD™ GB Blue approved hero render (Drive 1yZT5_6dyh…),
  SMARTWATCH balanced four-colour lineup (1GlwsA05…, default) + angled showcase (1zq8LqUd…) toggle; both click to the
  dossier with full-size view/link. GlitchKey™ is a separate "More to come" placeholder (no image, no invented detail).
  Assets: assets/gear/{patchpad-hero,smartwatch-lineup,smartwatch-stage}. The 5 watch hardware/UI references are untouched.
- Entities: patchpad → new hero; new `smartwatch` entity (views Lineup/Showcase swap the full-size render);
  quickhack → software on the SMARTWATCH (self-made QuickHack mockups retired from display; files kept in assets/objects/quickhack);
  glitchkey → PENDING, no media, key-icon "More to come" placeholder. Fixed corrupted QuickHack copy ("assets/objects/n every…").
- Adventure Finds™ is now 8 finds (gadgets moved to Gear & Tech, no duplication); intro rewritten.
- Character Coins: Front · GB face / Back · Mountain face toggle across the 4 silver coins (one coin per colour, not eight);
  backs cut from CHARACTER_COIN_SYSTEM_SILVER.png → assets/objects/coin-{blue,red,yellow,purple}-back.
- NEW Claw Bot™ (was missing): from "Claw Bot Final Production Reference" (core finished source) — hero, Front/¾/Side/Back/Top/Bottom,
  states Idle, Walk/scuttle, Alert, Clamp A/B, Defeated A/B; 0.8 m. Bestiary after Rotor Bot™; evolution card now a full-width banner.
- Sentry Cannon™ dossier now leads with the hostile cannon (heroFirst), four hacked colours below (click-to-swap); in-world scene kept as a pick.
- Footer nav adds Adventure Finds / Gear & Tech.
Tests: func.js 23/23 (enemy list updated for Claw Bot); p5check.js all 6 viewports — no overflow, all 21 entity routes open, 0 errors;
gbmedia verify 449/449; screenshots desktop/tablet/phone of #gear, #enemies, #adventure-finds and dossiers.
Open / next:
- OWNER DECISION: brief says no "WISHLIST ON STEAM" CTA unless verified; staging/production still show two (non-linking toast buttons). Not removed — needs approval.
- Claw Bot™ card uses a studio cutout; needs an approved in-world scene to match the other enemy cards.
- Rotor Bot™: verify against "fixed nozzles, no propeller" — current art reads as thruster plumes; owner to confirm.
- Brief items not started: cast outfit galleries (2), evolution states (3), crystal/prism shapes, chest gold trim (5),
  region-portal set + flags (6), story/lore + PROTOTYPE tiles (7), polish/nav (8).

## PRODUCTION LAUNCH (2026-10-10)
- Promoted staging r-6f8645e4 to the site root: main 06d5f73 → a266aa9 (fast-forward, no deletions). Root index.html = staging page minus `<meta name="robots" content="noindex">`; root copies of staging.css/js and data files + revision.json; staging/assets merged into root assets/ (no name collisions; old root assets kept because v2/ uses ../assets/logo.png, map.jpg, hero-3.jpg). staging/, v2/, CNAME, .nojekyll unchanged.
- Backup: branch `backup/prod-2026-10-10` @ 06d5f73. Tag `prod-backup-2026-10-10` could NOT be pushed from the session (proxy 403 on tags) — create it manually.
- Pre-push verification on the assembled tree (local): /, /staging/, /v2/ across 6 viewports, no console/network errors, no overflow, no broken images; functional suite passes on root. Pages run 38061584281 succeeded.
- Live-domain check NOT performed from the session (container proxy denies gb.happydude.ca; fetch tool DNS down).
- Going forward: staging publishes still go through publish.py (staging/ only). Promoting a new staging build to production = repeat the root copy (index.html minus noindex, root css/js/data/revision.json, merge assets).

## COMPLETED — handoff pass (2026-10-05, build r-6f8645e4)
Authority: Drive `ASSET PRODUCTION — 2026-10-05/00_READ_ME_FIRST_CLAUDE_SITE_HANDOFF.md` + `06_HACKING_SYSTEM/00_HACKING_SYSTEM_SITE_USAGE_NOTES.md` (source sheets beat generated art; flags optional, never wrong).
- **Flag colours (handoff §4):** Riverworks™ red (was copper), Fallen Grounds™ copper/orange (was red), Creek Crossing™ dark blue; WORLD_ASSET_STANDARD.md updated. Summit Spine™ purple; Prism Ridge™ special treatment.
- **Fast Travel:** Portal Meadow™ (gold), Creek Crossing™ (dark blue), Clover Cliffs™ (green), Fallen Grounds™ (orange), Prism Ridge™ (purple); all cropped 4:3 on the portal. Creek/Fallen from CREEK_CLOVER_FALLEN_CLEAN_TRIPTYCH. Riverworks PASS_B removed (orange flags = wrong under the new canon). Riverworks™ + Frosty Peaks™ portals pending.
- **Sentry Cannon™:** all old art replaced from 08_SENTRY_CANNON locked system: Hostile + Hacked Blue/Red/Yellow/Purple (action states), Standard/Rotary/Missile (reference forms), in-game hostile view (card + dossier).
- **Springboard:** the locked red domed springboard only (09_SPRINGBOARD turnaround): states Neutral/Compressed/Rebound/Settling, five reference views, three audited action scenes (Portal Meadow gold, Riverworks red, Frosty light-blue flags — PASS). Old springboard deleted.
- **GB Crate:** Classic GB (preferred direction) with Intact/Damaged/Broken.
- **Hacking family (Adventure Finds™):** PatchPad™ = concept A Core Field Unit; GlitchKey™ = concept B Compact Access Chip; QuickHack™ = UI screens (code entry, scan, hacking, granted, denied) composited onto a simple black smartwatch with blue accent (sheet's bulky shells not used). One intro line explains the three roles.
- **Dossiers:** "In the world" scenes (multiple supported: GB_ENTITY_SCENE may be a list) → action states → reference views; Hero tile dropped when it duplicates a view.
- Tests: six viewports clean; functional suite updated for panorama mode, passes (logo-padding artefact aside).

### Pending
- Fast Travel: Riverworks™ (red flags) and Frosty Peaks™ (light-blue flags) in-environment portals.
- Rotor Bot™ action states; character-audited hero carousel scenes; QuickHack player-colour accents per character.

## COMPLETED — 360 panorama installed (2026-10-05, build r-e279f3d8)
- Source: owner-supplied `Adventure_Mountain_360_MASTER_ENRICHED_V1` (4608x1024, 4.5:1; same image as embedded in `Adventure_Mountain_360_Explore.html`). Master kept outside the repo.
- Validation: PASSED. 0 degree front sector (x~0.40) = the approved canonical front; one Prism crown, one Riverworks complex, Frosty/Riverworks continuous right, Clover/Fallen continuous left, no duplicated regions; seam visually clean (gbpano edge metric 20.5/255 = texture noise); painted art, not a clay/control render. Rear sectors are less landmark-dense than the front.
- Built: `gbpano.py build <master> --version pano-2026-10-05 --front 0.3993` -> assets/world/ (low 540 px x3 tiles, medium 1024 px x5, overview 2048). New manifest field `front` (viewer opens on the front).
- Coordinates LOCKED: coordinateAuthority "pano-2026-10-05"; seven region world {x,y} measured on the panorama. Pins live; "360 World" wording visible; portrait pins clickable in panorama mode.
- Fallback front map kept for rollback (`gbpano.py clear`).

## COMPLETED — Drive sync + repair pass (2026-10-05, build r-f1d7d996)
Source: Drive "ASSET PRODUCTION — 2026-10-05" (01_CHARACTERS, 02_WORLD_OBJECTS, 03_FAST_TRAVEL_PORTALS, 04_CRYSTAL_SYSTEM, 05_MASTER_MAP) + owner-supplied canon images.
- **Canon names:** Fallen Grounds™ (was Ruin Courtyard), Frosty Peaks™, Summit Spine™, Goom Bot™, Rumbler™ (was Rolling Boulder), Stone Walker™ (was Stone Golem), Prism Keeper™ (was Crystal Guardian). Brightback™ reserved (not used). Internal IDs/routes unchanged; new aliases #entity/goom-bot, rumbler, stone-walker, prism-keeper, crystal, prism-crystal. "Meet the Team" without ™ everywhere.
- **Crystal terminology:** Crystal → Crystal Shards; Prism Crystal → Prism Shards. "Adventure Crystal", "Secret Key / Rare Crystal", "gems" removed from public copy.
- **Adventure Finds™** (was World Objects; anchor #adventure-finds): Treasure Chest (Master Chest; Blue/Red/Yellow/Purple player chests as states), Crystal Chest, GB Coin (owner-chosen "GB Coin (Recommended)" gold coin, GB + Mountain faces), Character Coins (silver, 4 team colours), Crystal (+ Crystal Shards), Prism Crystal (+ Prism Shards), Springboard, GB Crate. Adventure Tech chests = TBD (not used). 4-column grid.
- **Fast Travel:** colour-swap studio portals deleted. Now in-environment portals: Portal Meadow™ (PASS_B, gold flags), Riverworks™ (PASS_B), Clover Cliffs™ (GREEN_CAVE final pass), Prism Ridge™ (PASS_B, purple). Rejected: FROST_PEAKS_PORTAL_FINAL_PASS (purple Prism flags), PRISM_RIDGE_PASS_A (red flags). Portal Meadow™ region colour changed to gold #E8A812 (WORLD_ASSET_STANDARD.md updated).
- **Gamer Girl Purple™:** previous visor transplant reverted; streetwear Front and Pose now come from GAMER_GIRL_PURPLE_SUPPLEMENTAL_REFERENCE (her own approved art, translucent visor, original eyes).
- **Map:** fallback map = Adventure_Mountain_CANONICAL_FRONT_ENRICHED_V1 (same approved 0° composition, 1920×1080, sharper detail; pins unchanged). The 360 master (Adventure_Mountain_360_MASTER_ENRICHED_V1.png, 11.8 MB) could NOT be downloaded (connector 10 MB limit) → not inspected, not installed; panorama mode still off.
- **UI:** enemy/Adventure Finds names on one system (heavy italic white with navy stroke on a blue plate); phone-portrait feature strip cards 42% wide (two cards + next peeking, edge fade); Fast Travel frame keeps the image aspect.
- **Turntable:** no 3D models / GLB / FBX / rotation sequences / video found in Drive → static reference views kept; action states stay first.

### Pending (stronger assets coming)
- Fast Travel: Creek Crossing™, Fallen Grounds™, Frosty Peaks™ in-environment portals (Frosty needs ice-blue flags).
- Sentry Cannon, hazards, more springboards, PatchPad™ / QuickHack™ / GlitchKey™ art (names reserved, nothing published).
- Rumbler/Stone Walker/Prism Keeper evolution images still carry legacy file names (assets only); "rubble/no corpse" defeat states to come.

## COMPLETED — README completion pass (2026-10-05, build r-754c2d45)
Authority: Drive `ASTRA_360_RECONSTRUCTION_V3_2026-10-04/README.md` (source roles, asset search rules, website fix list).
- **Map:** fallback map replaced with the approved **0° FRONT master** (`01_WORLD_0_FRONT_MASTER_REFERENCE`, cropped y 30–990 → `assets/adventure-mountain-front.webp`, minimap `-480`). Old overloaded map deleted. Region pins (region-coloured icon + name) now show on the front map; positions in world-data.js `fallback {x,y}` are valid for this image only. Panorama contract unchanged.
- **Locations:** Creek Crossing™ now open with CC01–03 (old waterfall render removed); Prism Ridge™ open with PR02–04 + SS01 Summit portal stairs (Drive folders found by visual search). All seven regions have real galleries.
- **Fast Travel:** the seven regional portals from the Visual Design Bible (correct banner colours) in `assets/systems/portals/`; panel has a region-colour switcher; portal dossier shows all seven.
- **World Objects (new section):** Springboard, GB Crate, Treasure Chest, Adventure Crystal, Coin, Secret Key / Rare Crystal: transparent cutouts keyed from Canonical World Assets v1; dossiers via the existing #entity routes. One subtle line: "Visualizations and designs are subject to change during development."
- **Enemies:** card descriptors removed, names larger/styled, ™ on all seven names. Dossiers: **Action states first, Reference views second**; empty "Not yet available" tiles and empty encounter sections removed. New action states keyed from the Game Asset Production sheet: Goom Idle/Walk/Alert/Charge (+ Defeated dizzy, Inactive), Sentry Cannon Idle/Tracking/Firing/Cooldown/Destroyed (+ Inactive). Evolution sequence ends on the strong `crystal-guardian-hero` final form (weak evo-crystal-guardian cutout deleted). Public "To be confirmed" copy replaced.
- **Meet the Team:** heading without ™; Gamer Girl Purple™ streetwear pose (card) now wears her visor (transplanted from her own front view); Gamer Bro Blue™ streetwear set completed with a Back view (from the official hoodie turnaround) and the "¾ view" label normalised (set = Pose/Front/Side/Back).
- **Hero:** slide 3 restored on phone portrait (3 dots everywhere).
- **Phone portrait feature strip:** compact horizontal cards (icon left), no truncation; other breakpoints unchanged.
- Tests: six viewports clean; functional suite passes (logo-padding check is a known scrolled-page artefact).

### Next assets to generate
- Rotor Bot™ action states (patrol, dive, turning, damaged): only hover/attack + defeated exist at usable resolution.
- 90° RIGHT and 270° LEFT world views for the 360 (per README §3).
- New hero carousel art (running toward camera, springboard launch, portal entry, Frost/Prism approach) in current character designs.
- Higher-resolution in-game renders for Spike Bot™ / Rotor Bot™ (current crops are 2× upscales); larger object renders (current cutouts are ~3× upscales from the board).

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
