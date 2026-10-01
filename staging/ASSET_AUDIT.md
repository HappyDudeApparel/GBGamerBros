# Pass A — asset audit (staging)

Visual authority: `PRIMARY_APPROVED_TARGET.png` and `APPROVED_HERO_MAP_HIGH_RES_REFERENCE.png` (1536×1024).

## Selected sources

| Staging file | Source | Why |
|---|---|---|
| `assets/brand/gb-logo.webp` | `logo_white_variant_2.png` (01B), trimmed, alpha normalised to fully solid | Chosen by the user. Standalone layer: no older logo is baked into any slide or map image underneath. |
| `assets/brand/adventure-mountain-sign.webp` | `wood_sign_variant.png` (01B), trimmed, alpha normalised to fully solid | Chosen by the user (ADVENTURE MOUNTAIN™ on one line). Standalone layer: no older sign is baked into any slide underneath. |
| `assets/brand/bros-highfive.webp` | Re-extracted from the lossless high-res reference | Only approved Bros action pose. See limitation below. |
| `assets/hero-world-highfive.webp` | `raw_img5` (character-free world plate) | Backdrop for slide 1 only; the Bros cutout sits on top. |
| `assets/hero-blue-portal.webp`, `hero-blue-run.webp`, `hero-blue-bridge.webp` | Video stills `7516_1s`, `7516_7s`, `7531_14s` | Gamer Bro Blue™ only, no backpack, no pink character. 1280×720, softer than slide 1. Pending approval. |
| `assets/adventure-mountain-map.webp` | High-res reference, rows 562–1024 | Labelled map with its own clouds; hotspots sit over the baked labels. |
| `assets/cloud-bank.webp` | Keyed from the target's cloud sea | Real cloud imagery instead of CSS shapes. |

## Reviewed but not selected

| Candidate | Decision |
|---|---|
| `logo_white_variant_1.png` | Alternative to variant 2; not used. |
| Logo and two-line sign extracted from the reference | Replaced by the cleaner, high-resolution variants above. |
| Source PNG alpha | Bodies were ~98–99% opaque (alpha 250–253), which would let the background show through; normalised to 100%. |
| `blended_sign_variant_1/2.png`, `blue_banner_variant.png` | Different designs from the target sign. Kept for later sections. |
| `DUO_CUTOUT_BLUE_RED.png` | Complete limbs, but a crouching pose that does not match the target's high-five. |
| `Blue Gamer Bros Mascot Character.png`, `GB Gamer Bro Blue - Sport.jpg` | Single-character reference/pose images, not hero action art. |
| Purple / Yellow turnarounds | Model references only, not action art. |
| `gb_video_refs/*` | Pink/chibi character, excluded everywhere. |

## Cropping findings

- **Source limitation:** Gamer Bro Blue™'s outstretched hand is hidden behind the baked headline in the approved reference, so the sleeve ends in a stub. The stub is faded with a CSS mask (`.fg--stub-left`) until a full-limb cutout exists.
- **CSS framing (fixed):** In portrait layouts the 16:9 video stills were cover-scaled into a tall frame, so Blue's head sat behind the headline and CTA. Stills are now framed in the scene band with a blurred copy of the same frame behind the copy.
- No other hands, feet or hair are clipped by the layout at the five review sizes.

## Swapping character art later

The character layer is `.hero__fg` in `index.html`. Each cutout is one `<img class="fg" data-slide="N">` with its own box:
`--x/--y/--w` (landscape, reference px) and `--px/--py/--pw` (portrait). Replace `src` and the box values; no layout code changes are needed.

## Art still needed (not generated in Pass A)

1. Gamer Bro Blue™ + Gamer Bro Red™ high-five, transparent, full limbs, ≥2× resolution (replaces the extracted cutout).
2. A clean, text-free render of the approved hero world behind the Bros (optional; improves slide 1 sharpness).
3. Two or three more transparent Bros action poses for slides 2–4 (replacing the 720p video stills).
4. Gamer Girl Purple™ action pose, transparent.
5. Gamer Girl Yellow™ action pose, transparent.
6. Four-character team action image (Meet the Team™ / later hero slide).
7. Per-character card art for Meet the Team™ (all four).

## Copyright band on transparent cutouts (Pass C)

The logo, sign and Bros cutouts now carry a **transparent** overscan band: extra transparent canvas below the artwork, holding the notice in faint grey text, with no solid bar. They are shown through the shared `.gbm` frame, which clips the band.

Before adopting them, a test copy of the page was compared against the frozen Pass A page at all five review sizes. Element boxes for the logo, sign and Bros matched within 0.02 px. The only pixel differences were fine encoding speckle inside the cutouts, from re-encoding them once from their lossless masters. Masters are rebuilt from the original pack files and kept outside the public repo.
