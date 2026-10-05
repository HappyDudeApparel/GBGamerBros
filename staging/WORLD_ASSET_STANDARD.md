# GB GAMER BROS™ — World Asset Standard

Status: **approved** (banner, springboard and crate specs approved after Pass B). **Visual authority: board A "Canonical World Assets v1", refined by board C "World & Game Assets v1.1"; see `VISUAL_AUTHORITY.md`.** Applies to all Adventure Mountain™ world art (galleries, hero art, future generated or corrected images).

The concept images were developed iteratively, so recurring objects vary between images. Before any image is approved as final art, its recurring objects must match the canonical designs below. Only the **region colour** changes between areas; shape, construction and branding never do.

---

## 1. Region colour families

Summit Spine™ (sub-region): purple. Prism Ridge™: separately locked special Prism treatment. Flags are optional in scenes; region decides the colour, never the player shown.

| Area | Family | Banner field | Trim | Notes |
|---|---|---|---|---|
| Portal Meadow™ | Yellow / gold | `#E8A812` | white | Owner decision 2026-10-05 (was teal #16A38A). |
| Creek Crossing™ | Dark blue | `#1A4FB8` | white | The current world banners are already this family. |
| Riverworks™ | Red | `#C8283B` | white | Owner handoff 2026-10-05 (was copper). |
| Clover Cliffs™ | Forest green | `#23864A` | white | |
| Fallen Grounds™ (formerly Ruin Courtyard) | Copper / orange | `#D2691E` | white | Owner handoff 2026-10-05 (was red). |
| Prism Ridge™ | Purple | `#7A3CC8` | white | |
| Frosty Peaks™ | Ice blue | `#7CC6F2` | white | Confirmed by board A: white trim and graphics on ice blue. |

The hex values are starting points sampled to sit alongside the map labels. Final values are set once, here, and reused everywhere.

## 2. Canonical banner (approved · board A)

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

## 3. Canonical springboard (approved · board A)

Based on the springboard in the Riverworks™ and Portal Meadow™ close views:

- **Top:** a red circular pad with a slight dome, a gloss highlight and a bevelled rim.
- **Mark:** a white **double chevron (⌃⌃)** pointing up, centred on the pad, about 45% of the pad's diameter.
- **Mechanism:** a dark charcoal coil spring with 3–4 visible turns, about 35% of the total height.
- **Base:** an octagonal dark-gunmetal base with red-and-white chevron side panels and a white **GB** plate on the front face, plus 4 bolts.
- **Proportions:** base diameter ≈ 1.25 × pad diameter. Total height ≈ 0.8 × pad diameter.
- **Never varies:** colour, mark, base design. Only wear and dirt may vary slightly.

## 4. Canonical crate (approved · board A)

- **Body:** a warm mid-brown wood cube made of horizontal planks (3 per face) with a diagonal cross-brace on the side faces.
- **Reinforcement:** dark iron corner brackets on all 8 corners, with 2 rivets per bracket face.
- **Brand mark:** a dark recessed panel on the front face with a cream-stencilled **GB** wordmark, about 50% of the face width.
- **Proportions:** a cube (1 : 1 : 1). A tall double-crate variant may only be a stack of two canonical crates.
- **May vary per environment:** moss, water stains, chips and scale relative to the scene.
- **Never varies:** construction, brackets, brand panel, wood tone.

## 5. Other recurring assets (design set by board A / C; specs to be written when production art arrives)

| Asset | Board design direction | Notes |
|---|---|---|
| **World portal** | Stone arch with a blue swirl, regional banners on both sides, a lantern each side, and regional environment dressing (B shows all 7 regions) | Visual states: Active (standard), Discovered, Inactive/Locked; B also shows Cave/Interior. States are visuals only, not confirmed mechanics. |
| **Route sign** | Wooden posts and boards with an arrow, the mountain icon and the GB mark | Consistent wood style; placement varies by region. |
| **Lantern** | Wood/metal frame with a warm light | Same design in all regions; used on posts, bridges and ruins. |
| **Collectibles** | Coin (mountain emblem), Adventure Crystal (yellow), Secret Key / Rare Crystal, Treasure Chest (GB) | Glow and colour may vary by region; silhouettes stay. |
| **Pipes** | Blue industrial pipe with riveted flanges | Traversal / shortcuts. |
| **Wood rails & bridges** | Rope-tied timber rails and plank bridges | |
| **Ziplines / rails** | Shown on board C | Kept as a traversal concept alongside springboards. |
| **Climbable ledges** | Shown on board C | Exploration. |
| **Stone / ruin** | Mossy stone arches and walls | |
| **Scale reference** | Board A shows the Gamer Bros next to the springboard, crate, lantern and portal | Use for relative scale in future renders. |

Lanterns, portals, collectibles, signs, pipes and traversal props are tracked as `PROVISIONAL` in `ASSET_ASSIGNMENTS.md` until their standalone production PNGs exist.

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
- **Pixel band**: extra canvas added below the image, never cut from the composition, carrying the notice faintly. Opaque images get a dark band. Transparent cutouts get a **transparent** band with faint text only. The site always clips it through the shared `.gbm` media frame.
- **Verification:** `tools/gbmedia.py verify` re-reads every file from disk.
- **Limits:** metadata can be stripped by other software. The band can be cropped off a downloaded copy. Neither layer is tamper-proof; together they make casual reuse carry the notice.
