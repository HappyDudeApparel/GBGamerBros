# Rotor Bot™ — source search result and required exports (2026-10-11)

**Result: no approved master in Drive is sharper than what the site already uses. The blur cannot be fixed from the sheets; it needs new exports.** Nothing was upscaled and the rejected propeller-fin design was not used.

## What exists (all checked by downloading and measuring)
| Source | Where | Real pixels | Use |
|---|---|---|---|
| ROTOR_BOT_PRODUCTION_SPEC_SHEET_CANONICAL_V1 (Slides) and its duplicate "Rotor Bot Production Spec Sheet" | Drive `ROTOR_BOT/`, master folder | **one flattened 1672×941 JPEG per sheet** | Locked fixed-nozzle design. Idle/Patrol/Alert poses are about 140 px wide: exactly the size of the site's current derivatives, so they were already cut at native size |
| ROTOR_BOT_ANIMATION_BUNDLE_REFERENCE_CANONICAL_V1 (Slides) and duplicate | same | one flattened 1672×941 JPEG | States are about 160–190 px wide; front/3-4/side/rear **Attack** panels about 280 px wide with flames baked into the pale background |
| ROTOR_BOT_PRODUCTION_ATLAS_V1.jpeg | `1uNV9FC5…` | 1536×857 | Superseded (older design). Do not use |
| SUPERSEDED V1 washout / V2 sheets | `ROTOR_BOT/` | — | Deprecated. Do not use |
| ROTOR_BOT_ASSET_SPECIFIC_HANDOFF | `ROTOR_BOT/` | text | Names the real master: **Higgsfield 3D project, revision 3** (GLB ≈738 KB, Blender source ≈2.18 MB) |

Both canonical sheets also carry the old footer "© 2026 GB Gamer Bros™ / Adventure Mountain™. All rights reserved." baked into the picture, so the sheets themselves must not be published. They are kept private (scratch only).

## Missing masters (precise)
1. **Rotor Bot 3D master, Higgsfield rev 3**: GLB and editable Blender file. Neither is in Drive or in this repo; Higgsfield is not reachable from the build container.
2. **ChatGPT-library originals** named in the Drive manifest: `Rotor Bot Production Reference Sheet.png` (`file_000000009bd081f4…`) and `Rotor Bot Production and Animation Reference Sheet.png` (`file_00000000017081f6…`). Not accessible here; resolution unknown. If they are larger than 1672×941 they would be a better crop source.
3. No transparent, unflattened state renders exist anywhere I can reach.

## Exports required (to make the website states crisp)
Render or export from the rev-3 master (or the library originals if they are higher resolution). One model, one camera, one scale for every state.
| File | State | Notes |
|---|---|---|
| `rotor-bot-idle` | Idle / Hover | short, balanced thrust |
| `rotor-bot-patrol` | Patrol | asymmetric thrust |
| `rotor-bot-alert` | Alert | stronger thrust, brighter core; must read differently from Idle |
| `rotor-bot-attack-a` | Charge / Attack A | wind-up |
| `rotor-bot-attack-b` | Attack / Dive B | longest thrust |
Specification: transparent PNG, **at least 1200 px on the long side**, front three-quarter view matching the hero, full silhouette and the **entire flame plume inside the canvas with about 10 % clear margin** (no clipped flame tips), fixed nozzles and no propellers, no baked background, shadow or caption, no copyright text. Optional: the six turnaround views and Inactive/Defeated A/B at the same size.
On receipt: run them through `tools/export_public_image.py` (after Stage 2 approval) and `staging/tools/gbmedia.py`, add them to the dev source, and run `tools/qa/rotor_resolution.py` (target: displayed size at most 1.5× native on a 1× display).

## Today's measured defect (before any fix)
States are 139–195 px wide and are shown 2.4× (desktop) to about 6× (3× phone) enlarged. There is no Attack state on the site. Idle and Alert look nearly identical.
