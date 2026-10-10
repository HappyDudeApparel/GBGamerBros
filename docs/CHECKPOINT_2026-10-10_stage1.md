# GB GAMER BROS™ / ADVENTURE MOUNTAIN™ — QA checkpoint, stage 1 (2026-10-10)

Scope: `gb.happydude.ca/staging/` and this repo only. The main happydude.ca WordPress site is ChatGPT/WPVibe's and was not touched.
Branch: `ccr-68e61a03-ykulfu`. **Nothing here is deployed.** GitHub Pages serves `main`; this branch is unmerged and no PR was opened.
Evidence = real Chromium renders of these files served locally at 360, 390, 768, 844×390, 932×430 and 1280 px. `gb.happydude.ca` was not reachable from the build container, so the live URL has **not** been viewed.

## Completed in this stage
| Item | Change | Rendered evidence |
|---|---|---|
| Footer | `© 2026 HAPPY DUDE®. All rights reserved.` replaces the old line; plus Rights & IP / Privacy (Draft) links | `docs/qa-2026-10-10/footer_m360_*` |
| Stale notice in rasters | "Meet the Team" backdrop was a raw CSS background that exposed the image's baked old notice on tall crops; now drawn through the `.gbm` clipping frame | `team-backdrop_m390_before/after` |
| Stale notice in data | `panorama-manifest.js` copyright string updated (it is not rendered anywhere) | — |
| Clean logo | `assets/brand/gb-logo-clean.{webp,png}`: crop-only (rows 0–259 of 272); verified bit-identical to the source rows, last opaque row 257, nothing below row 259. Header, footer and favicon now use it. Originals untouched. Recipe: `tools/make_clean_logo.py` | `logo_old-vs-clean_*` |
| Legal pages | `rights.html`, `privacy.html` ported from draft PR #3 (content unchanged) rather than merging that stale branch | — |
| Brightback™ card | Was one narrow grid cell, wordmark cut off (a `grid-column:auto!important` rule beat the apex span). Now a full-width row, hero shown at its own 701:573 ratio (no crop), smaller title | `brightback-card_*` |
| Evolution sequence | Grouped by phase, each phase labelled once (no repeated "Phase 1"), uniform square thumbnails, no overlap at any tested width; wraps on tablet/landscape, swipe rail on phones; Brightback thumb uses `contain` | `evolution_*` |
| "In the world" tab | Brightback entry is now labelled "Brightback™ (completed form)" with a REFERENCE badge and the note that no in-world transformation scene is documented; no art invented | `evolution_inworld-reference_m390_after` |
| Regression run | All 17 entity dossiers × every evolution tab and state pick × 6 viewports: 0 console errors, 0 failed/404 requests, 0 broken images, 0 horizontal overflow; character, area and legal-page routes load clean | `tools/qa/functional.py` |

## Unresolved — NOT fixed, do not report as done
1. **Rotor Bot™ blur / missing states.** Measured: states (idle, patrol, alert, inactive, defeated, views) are 139–195 px wide and are displayed at 2.4× native on a 1× desktop and about 6× on a 3× phone. Idle and Alert are visually near-identical, and there is no Attack state (the existing code notes it is omitted until a transparent export exists). The design itself (fixed thrusters, no propeller) is correct. **Blocker:** the approved high-resolution masters (`Rotor Bot Production Reference Sheet.png`, Library file_000000009bd081f4…; canonical Slides sheet `1w4RNqy5…`) cannot be pulled into this container, since the Drive connector returns base64 into chat and drive.google.com is not on the egress list. Needed: transparent PNG exports ≥1200 px of Idle, Patrol, Alert, Attack, with the full flame plume inside the canvas, committed to the repo or placed where the container can read them. No upscaling was done.
2. **Brightback hero has baked source text.** `brightback-v1-hero.png` contains a "BRIGHTBACK™ 3/4 FRONT VIEW (HERO)" caption at bottom-left and a header-strip remnant at the top; the crown tip overlaps the strip and the caption overlaps a foot, so any crop would cut art. Left uncropped. Needs a cleaner crop from `Brightback Final Evolution V1.jpg` (Drive `1VPqGajM…`), which is the same blocker as above.
3. **Image protection pipeline is NOT implemented.** No watermark, no IPTC/XMP, no ImageObject structured data, no robots.txt / AI-crawler policy, no llms.txt. Nothing is deployed on any of these. The rights page already states that robots/metadata cannot force attribution.
4. **Production root** (`/index.html`, `/panorama-manifest.js`) still shows the old footer. Left alone: "do not change root until staging approved".
5. **Generated-source risk.** `staging/` is generated from an external dev source (commit messages cite "dev 71ffd75"). That source is not in this repo; the next generator publish will erase these changes unless they are ported. Same warning as in the Drive brief for Brightback.
6. **Legal wording needs the owner.** `rights.html` cites a registration number (TMA1139669) that I did not verify, and the sole-proprietor / chain-of-title wording the issue mentions is not reflected beyond the PR #3 text. The "Privacy (Draft)" link is on the public footer exactly as PR #3 had it. Decide whether to keep it visible.
7. **Not audited:** baked bands in the world panorama tiles, the `--bg` hero scene slides' small variants, and the watermark/legal text of any image outside the Meet the Team, logo and Brightback paths.
8. **PR hygiene (for the owner):** PR #3's branch is stale against `main` (merging it as-is would revert Brightback). Its useful content is ported here, so it can be closed as superseded. PR #2 (Sentry/evolution #5/#6 hotfix) was not touched; its removals are already reflected in `entities.js` on `main`.

## Next-best prompt (fresh thread)
"Stage 2 — GB GAMER BROS™ image protection. Branch `ccr-68e61a03-ykulfu` (or its merged successor). Build `tools/export_public_image.py` that reads a private master, never modifies it, writes an optimized public derivative with a crop-safe interior HAPPY DUDE® mark and XMP rights metadata (dc:rights, xmpRights:WebStatement → rights.html, photoshop:Credit), and verifies the metadata survives every responsive variant. Produce ONE-PER-CATEGORY sample proofs (cutout enemy, scene, character, logo) for owner approval of the watermark appearance. Do not watermark the library. Add ImageObject JSON-LD to rights.html and propose (do not deploy) robots.txt AI-bot rules."

Then stage 3: Rotor Bot™ hi-res states once masters are readable. Stage 4: promote to production root after owner sign-off on rendered live pages.

## Keep in active context
Owner rule: the owner judges rendered live pages, not commits. Approved footer text is exactly `© 2026 HAPPY DUDE®. All rights reserved.`. Brightback V1 only (V2 is an unapproved alternate); no invented transformation art; no propeller Rotor; WordPress is out of scope.
