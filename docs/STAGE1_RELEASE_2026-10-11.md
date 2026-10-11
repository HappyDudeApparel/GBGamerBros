# Stage 1 release — reconciliation with the dev source (2026-10-11)

## How staging is really published
`staging/` on `main` is **generated**. The authoritative source is the branch `ccr-aefb96a7-5w3hgh` (its `staging/` folder plus `staging/tools/`).
`staging/tools/publish.py` builds a worktree from `origin/main`, deletes `staging/` and replaces it wholesale with the dev branch's public files
(no `*.md`, no `tools/`), then pushes straight to `main`. Consequences found:

| Finding | Effect of the next publish |
|---|---|
| Dev's public files were byte-identical to main at `e1bcd55` (460/460 files) | Every later main-only change is erased |
| Owner commits `fdf948a` (unified Enemies & Hazards cards) and `76dc8e2` (Brightback V1) exist only on main | Brightback and the unified cards would disappear |
| All Stage 1 corrections exist only on the QA branch | Footer, logo, Meet the Team fix, apex card, evolution layout would be reverted |
| `staging/rights.html` is not in dev | Deleted (the whole folder is replaced) |
| `revision.py` crashed on the Brightback manifest entries (`.png`, no `-960` variant) | Publishing from dev would have **failed outright** |
| `gbmedia.py` hard-codes the old notice (`NOTICE`, `CREATOR`, band text) | Any rebuilt image gets the old "GB Gamer Bros™ x Happy Dude®" band/metadata again |

## What was done (branch `dev-port-stage1-2026-10-11`, based on `ccr-aefb96a7-5w3hgh`; pushed, not merged)
1. Applied the full `staging/` delta (`e1bcd55` → Stage 1) to the dev source, which carries the owner's main-only commits and the QA corrections.
2. `revision.py`: honours manifest `ext` / `noSmall`; orphan check respects `ext`.
3. `check_invariants.py` (same file as `tools/check_staging_invariants.py` on main) + hook in `publish.py`: publishing is refused if the build reverts the footer, logo, Brightback card/evolution, team backdrop, re-links a privacy draft, or contains a personal name.
4. Ran `revision.py`; `publish.py --dry-run` against `origin/main` then listed only the Stage 1 changes (no Brightback or card regressions).
5. The Stage 1 PR's `staging/` is the **output of that dev pipeline** (identical files and stamps), so after merge main and dev agree and a publish adds nothing unexpected.

Still true / not solved: `gbmedia.py` text (see below) and anything the generator's owner changes on dev after this. **Rule:** never hand-edit `main/staging`; edit the dev branch, run `revision.py`, publish.

## Not covered by the guard
Visual regressions (use `tools/qa/*.py`) and the old notice inside the 436 existing raster derivatives: each carries it in its CSS-hidden band and in XMP/EXIF from `gbmedia.py`. Rebuilding those is a Stage 2 pipeline decision (see `docs/STAGE2_IMAGE_PROTECTION_PLAN.md` once written).
