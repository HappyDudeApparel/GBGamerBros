# GB GAMER BROS™ — project status / handoff

Checkpoint: 2026-10-01 · dev branch `ccr-aefb96a7-5w3hgh` @ `be84ebd`

## Live staging
- URL: https://gb.happydude.ca/staging/
- Live build: **`r-0c3aa5b5`**, published as main `b7a7acf` (built from dev `be84ebd`). GitHub Pages deploy succeeded.
- Root homepage and `/v2/` are untouched (byte-identical to main `919f2d0`). Never change them.

## Done
- **Pass A:** header, hero carousel, cloud transition and map.
- **Pass B:** area galleries with `#area/<id>/<n>` routes.
  - Open: Portal Meadow™, Riverworks™, Ruin Courtyard™, Prism Ridge™.
  - Creek Crossing™ is incomplete; Clover Cliffs™ and Frost Peaks™ need artwork.
- **Pass C:** feature cards, Explore Iconic Areas rail, Level Preview, Fast Travel, Bad Guys & Hazards, and the shared `#entity/<id>` dossier.
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
- **Goom, Spike Bot, Flying Enemy, Turret, Rock Guy and Crystal Guardian** show "Artwork in production". Their old crops were deleted because they didn't match the canonical designs.

For each production PNG:
1. Keep the master outside the public repo.
2. Run `python3 staging/tools/gbmedia.py build <png> staging/assets/entities/<id>-thumb` (likewise `-render`, `-icon`, `-<state>`). Transparent PNGs get a transparent band automatically.
3. In `entities.js`, set `media.thumb` / `media.render` / `media.icon` / `states[...]` to the new key and set `status` (PROVISIONAL or CANONICAL). The ID and route stay the same.
4. Follow the publishing workflow above.

Never crop the reference sheets (VISUAL_AUTHORITY.md boards A–M) into website art, and never publish them.

## Enemy naming cleanup (open items)
- **Canonical IDs:** `goom`, `spike-bot`, `flying-enemy`, `turret`, `rolling-boulder`, `rock-guy`, `crystal-guardian`.
- **Collectibles:** `coin`, `adventure-crystal` (formerly `gem`), `secret-key`, `treasure-chest`.
- **No routing aliases exist yet.** `#entity/gem` currently opens nothing. If old IDs or links need to keep working, add an alias map (e.g. `gem → adventure-crystal`) in the router.
- **Sheet text not adopted:** "Aerial Form" under Rock Guy (sheet error), "jump on to defeat" (design intent only). Crystal Guardian attack type is TBD.
- **Bad Guys & Hazards grid:** shows 6 cards; Rock Guy is reached only through the evolution links. Decide whether it gets its own card.

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
