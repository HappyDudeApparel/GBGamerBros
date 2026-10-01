# GB GAMER BROS™ — World Asset Standard

Status: **proposed for approval** · Applies to all Adventure Mountain™ world art (galleries, hero art, future generated or corrected images).

The concept images were developed iteratively, so recurring objects vary between images. Before any image is approved as final art, its recurring objects must match the canonical designs below. Only the **region colour** changes between areas; shape, construction and branding never do.

---

## 1. Region colour families

| Area | Family | Banner field | Trim | Notes |
|---|---|---|---|---|
| Portal Meadow™ | Teal / fresh green | `#16A38A` | white | Matches the map label's teal-green. |
| Creek Crossing™ | Blue | `#1E6FD9` | white | The current world banners are already this family. |
| Riverworks™ | Warm copper / orange-brown | `#B8692A` | cream `#F3E6CF` | Matches the map label's copper. |
| Clover Cliffs™ | Forest green | `#23864A` | white | |
| Ruin Courtyard™ | Red | `#C8283B` | white | |
| Prism Ridge™ | Purple | `#7A3CC8` | white | |
| Frost Peaks™ | Ice blue | `#7CC6F2` | navy `#0B2F6B` | A dark trim keeps contrast on the light field. |

The hex values are starting points sampled to sit alongside the map labels. Final values are set once, here, and reused everywhere.

## 2. Canonical banner (proposed)

Based on the strongest existing form, already present in `gb_waterfall_riverworks_adventure`, `riverworks_canyon_pipeline_adventure` and `blended_sign_variant_2`:

- **Form:** a tall hanging fabric banner, roughly 1 : 2.6 (width : height) including the tails.
- **Lower edge:** a double-point (split / swallowtail) silhouette. The notch depth is about 18% of the banner height and both points are equal.
- **Upper portion:** a white **GB** wordmark, bold italic, centred, about 55% of the banner width.
- **Below the GB:** the white Adventure Mountain™ **mountain mark** (twin peaks with a chevron underline), not the crown.
- **Trim:** a 3–4% white border running around all edges, including the tails.
- **Hanger:** a dark wooden rod with rope wraps at both ends. The rod is about 112% of the banner width and has the same end-caps everywhere. When the banner hangs from a wall, use the same rod on two iron brackets.
- **Material:** woven fabric with a soft sheen. Folds and wind can vary, but the silhouette and graphics stay readable.
- **Varies by area:** field colour only (section 1).
- **Not allowed:** a crown symbol in place of the mountain mark, a banner with no GB mark, a straight or rounded lower edge, ad-hoc logos, or more than one banner design in a single area.

## 3. Canonical springboard (proposed)

Based on the springboard in the Riverworks™ and Portal Meadow™ close views:

- **Top:** a red circular pad with a slight dome, a gloss highlight and a bevelled rim.
- **Mark:** a white **double chevron (⌃⌃)** pointing up, centred on the pad, about 45% of the pad's diameter.
- **Mechanism:** a dark charcoal coil spring with 3–4 visible turns, about 35% of the total height.
- **Base:** an octagonal dark-gunmetal base with red-and-white chevron side panels and a white **GB** plate on the front face, plus 4 bolts.
- **Proportions:** base diameter ≈ 1.25 × pad diameter. Total height ≈ 0.8 × pad diameter.
- **Never varies:** colour, mark, base design. Only wear and dirt may vary slightly.

## 4. Canonical crate (proposed)

- **Body:** a warm mid-brown wood cube made of horizontal planks (3 per face) with a diagonal cross-brace on the side faces.
- **Reinforcement:** dark iron corner brackets on all 8 corners, with 2 rivets per bracket face.
- **Brand mark:** a dark recessed panel on the front face with a cream-stencilled **GB** wordmark, about 50% of the face width.
- **Proportions:** a cube (1 : 1 : 1). A tall double-crate variant may only be a stack of two canonical crates.
- **May vary per environment:** moss, water stains, chips and scale relative to the scene.
- **Never varies:** construction, brackets, brand panel, wood tone.

## 5. Other recurring assets (to be standardised later)

Lanterns, portal architecture, collectibles (gems/coins), route signs, checkpoints, enemy families, pipes and traversal props each get a section here when they are normalised. Until then, each is tracked in `ASSET_ASSIGNMENTS.md` as `PROVISIONAL`.

## 6. Status vocabulary (used in ASSET_ASSIGNMENTS.md)

| Value | Meaning |
|---|---|
| `CANONICAL` | Matches the approved master asset exactly. **No world image can reach this until the canonical master exists.** |
| `ACCEPTABLE` | Same design as the proposed canonical object, but colour or detail still needs checking against the final master. |
| `NORMALIZATION_REQUIRED` | Wrong shape, colour, mark or construction. The image must be corrected or regenerated before final approval. **No cheap repaints.** |
| `NOT_PRESENT` | The object does not appear in the image. |
| `PROVISIONAL` | Usable on staging; not final. |
| `FINAL` | Approved production art. |
| `APPLIED` (copyright) | Metadata embedded, plus the pixel band where applicable, both verified by `tools/gbmedia.py verify`. |

## 7. Replacement workflow (no code or layout changes)

1. Produce the corrected or regenerated image as a PNG master (any proportions).
2. Run `python3 tools/gbmedia.py build <master.png> assets/areas/<area>/<NN-name>` from `staging/`. This writes both WebP sizes with the copyright band and metadata, and updates `media-manifest.js`.
3. If the file name changed, update that view's `src` in `areas.js` (data only).
4. Run `python3 tools/gbmedia.py verify`.
5. Update the row in `ASSET_ASSIGNMENTS.md`.

The gallery reads each image's real proportions from the manifest, so a replacement with a different aspect ratio still fits, keeps the band clipped, and keeps hotspot percentages tied to the content image.

## 8. Copyright and rights

Notice: **2026 Copyright © GB Gamer Bros™ x Happy Dude®. All Rights Reserved.**

- **Embedded metadata** (all public rasters):
  - XMP `dc:creator`, `dc:rights`, `xmpRights:Marked=True`, `xmpRights:UsageTerms`, `photoshop:Credit`/`Copyright`
  - EXIF Artist, Copyright and ImageDescription (ASCII rendering, because EXIF text is ASCII-only)
  - EXIF XPAuthor/XPComment (exact Unicode)
  - PNG: iTXt XMP plus Copyright/Author text chunks.
- **Pixel band** (world/area imagery): extra canvas added below the image, never cut from the composition, carrying the notice faintly. The site always clips it through the shared `.gbm` media frame.
- **Verification:** `tools/gbmedia.py verify` re-reads every file from disk.
- **Limits:** metadata can be stripped by other software. The band can be cropped off a downloaded copy. Neither layer is tamper-proof; together they make casual reuse carry the notice.
