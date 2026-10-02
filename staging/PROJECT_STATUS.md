# GB GAMER BROS™ — project status / handoff

Checkpoint: 2026-10-01 · dev branch `ccr-aefb96a7-5w3hgh`

## Live staging
- URL: https://gb.happydude.ca/staging/
- Live build: **`r-1b8a1997`**, main `815fe56` (dev `cf60fd9`).
- Root homepage and `/v2/` are untouched (byte-identical to main `919f2d0`). Never change them.

## Done
- **Pass A:** header, hero carousel, cloud transition and map.
- **Pass B:** area galleries with `#area/<id>/<n>` routes.
  - Open: Portal Meadow™, Riverworks™, Ruin Courtyard™, Prism Ridge™.
  - Creek Crossing™ is incomplete; Clover Cliffs™ and Frost Peaks™ need artwork.
- **Pass C:** feature cards, Explore Iconic Areas rail, Level Preview, Fast Travel, Enemies & Hazards, and the shared `#entity/<id>` dossier.
- **Entity registry** (`entities.js`): canonical IDs, heights (Gamer Bros 1.8 m), sheet-based states, and the evolution line rolling-boulder → rock-guy → crystal-guardian (optional; no trigger is coded).
- **Copyright pipeline:** XMP/EXIF metadata plus a pixel overscan band; all images verify.
- **Cache busting:** content-hash `?v=` revisions, `revision.json` freshness reload, and the build ID in the footer.

## Publishing workflow (every user-visible change)
1. Edit on the dev branch.
2. `python3 staging/tools/revision.py` stamps revisions and runs checks (exit 0 = clean).
3. Test locally: `python3 -m http.server` from the repo root, then open `/staging/`.
4. Commit and push the dev branch.
5. `python3 staging/tools/publish.py` publishes the public `/staging/` files to main. It refuses if anything outside staging would change and never ships `*.md` or `tools/`.
6. Check the Pages run (GitHub Actions "pages build and deployment") and report the new build ID.

Shell note: don't run `pkill -f "http.server"` inside a compound command. It matches its own shell line and kills the whole command.

## Next: standalone production enemy assets
Current public state:
- **Rolling Boulder** has the only enemy image left (provisional crop).
- **Goom, Spike Bot, Rotor Bot, Turret, Stone Golem and Crystal Guardian** show "Artwork in production". Their old crops were deleted because they didn't match the canonical designs.

For each production PNG:
1. Keep the master outside the public repo.
2. Run `python3 staging/tools/gbmedia.py build <png> staging/assets/entities/<id>-thumb` (likewise `-render`, `-icon`, `-<state>`). Transparent PNGs get a transparent band automatically.
3. In `entities.js`, set `media.thumb` / `media.render` / `media.icon` / `states[...]` to the new key and set `status` (PROVISIONAL or CANONICAL). The ID and route stay the same.
4. Follow the publishing workflow above.

Never crop the reference sheets (VISUAL_AUTHORITY.md boards A–M) into website art, and never publish them.

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

## Enemies & Hazards production pass 2 (manifest V2)
- All 7 enemy cards use approved production art (no "Artwork in production" left in the section).
- Dossiers: hero + production views + visual states (tap to swap the hero); phone galleries are swipe rails.
- Evolution component in the Rolling Boulder / Stone Golem / Crystal Guardian dossiers: tabs Sequence (7 cutouts) / Mechanics (4 close-ups) / In the world (6 scene steps); still optional, no trigger.
- Evolution teaser band under the grid ("See how it evolves" opens the Rolling Boulder dossier at the evolution block).
- Data: `GB_EVOLUTION_DETAIL` in entities.js; assets in `assets/entities/evolution/`.

## Approved state (previous)
Build `r-01839066` is provisionally approved. Keep it unchanged until new production assets arrive. Don't redesign the Pass C.5 layout.

## Queued for the next asset-driven update
1. **Phone portrait only:** if the Purple/Yellow hero slide still conflicts with the fixed Adventure Mountain™ sign, suppress that slide at that breakpoint (e.g. hide the slide and its dot under `max-aspect-ratio:1/1` + phone width). Do not reposition the global sign.
2. **Source-art corrections:** crown banners, crown coins and old enemy designs inside the newer scenes are fixed in the source art only. Never hide or repaint them with CSS; swap in the corrected scene masters when they arrive (same paths via gbmedia.py, so no layout change).
3. **Character references:** official Blue, Red, Purple and Yellow turnaround/reference material exists and will be supplied before the final Meet the Team™ implementation. Wait for it; don't build character pages from incomplete assets.

## Loose assets installed (see CHARACTER_ASSETS.md)
- Hero character layer is now the clean Blue/Red high-five (no cropped hand).
- Hero: 3 slides (high-five on world plate; Blue world action; Purple/Yellow world action).
- Level Preview: Blue/Red cliffside, Purple/Yellow boardwalk, four-character climb, trail junction.
- Video stills retired from the hero and Level Preview.
- revision.py now stamps `srcset` and includes the HTML in the build hash.

## Re-upload packs (Drive: Gamer Bros folder)
- B_EVOLUTION: opened and verified; README read. Its two sheets are byte-identical to boards H (`c6f1c0764b8d4c6b`) and I (`d1733f7ccd97c54f`), so nothing new to register.
- A_ENEMIES, C_HERO, D_GIRLS, E_TEAM: not retrieved. The Drive connector's session expires on every large download after the first ("session expired"); search still works. The archives themselves are probably fine.

## Blocked earlier: LATEST packs 01–03 arrived corrupted
Re-upload needed (or put the files loose in Drive, each under 10 MB, for connector download). Waiting on them:
- clean Blue/Red high-five (to replace the hero layer with the cropped hand)
- character scenes for carousel / Level Preview / Meet the Team™
- any standalone enemy art

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
- `tools/`: `gbmedia.py`, `revision.py`, `publish.py`.
