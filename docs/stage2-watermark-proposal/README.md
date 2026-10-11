# Stage 2 — public image protection: PROPOSAL for owner approval

**Status: samples only. Nothing here is deployed, no production image was replaced, no library image was watermarked.**
Tool: `tools/export_public_image.py` (reads a source, never writes to it, refuses to write into `staging/assets/`).
Samples: `samples/` (full + 960 px variants, each with an `.audit.json`: source SHA-256 before/after, mark position, output hashes, metadata read-back).

## What the samples show (one per category)
| Category | Source used | Mark position (share of content box from top-left) |
|---|---|---|
| Character artwork | `characters/blue/sporty-pose` (cutout 366×751) | 0.59 / 0.69, on the shorts: inside the figure, so a crop of the empty canvas cannot remove it |
| Environment artwork | `areas/portal-meadow/pm02-open-meadow-routes` (1448×1086) | 0.80 / 0.92 |
| Promotional graphic | `gear/smartwatch-lineup` (1448×1086) | 0.80 / 0.92 |
| Game screenshot | `systems/preview-04-trail-junction` (1672×941, the Level Preview still) | 0.80 / 0.91 |
| Variant B (environment) | as above + a fainter second mark at the opposite corner | adds 0.05 / 0.05 |

Sources are today's public derivatives with their old overscan band cropped off (crop-only). A real run must start from the private **masters**, which are not in this repository.

## Appearance (proposed)
- Text `HAPPY DUDE®` in Rubik Bold (the site's own typeface, converted from the shipped font; no new font), about 15 % of content width (minimum 96 px), 62 % opacity, soft contrast shadow, white (dark on bright areas).
- Always inside the picture: inset about 5 % from the nearest content edge, never in a band or margin. For transparent cutouts the mark sits where at least 90 % of the pixels under it are opaque.
- The **wording is the owner-approved HAPPY DUDE® identity** (registered mark, always with ®). No personal name, no © line on the art (governance: a rights notice belongs on the site/asset-credit page; an on-art "© 2026 HAPPY DUDE®" is only to be used once the owner confirms it).

## What it does and does not do
- It marks provenance and deters casual reuse. **It does not prevent copying**: anyone can crop (variant B makes that harder), blur, or paint it out, and metadata is stripped by many platforms and tools.
- **Nothing here makes a search or AI service credit or link to HAPPY DUDE®.** `robots.txt` and metadata are requests, not controls (see `proposed/robots.txt`).
- Metadata survives our own responsive variants (verified in each audit file) but not third-party re-encoding.

## Owner decisions needed
1. Mark wording: `HAPPY DUDE®` (shown) / `© 2026 HAPPY DUDE®` / the canonical GB GAMER BROS™ logo (the clean derivative can be used).
2. Strength: opacity 62 % (shown) or fainter (45 %).
3. Single mark (A) or single + faint secondary (B).
4. Which categories get a visible mark. Proposed default: everything public except the logo, flags, UI icons and images under 256 px (metadata only).
5. Rights URL used in metadata: staging `rights.html` for now; switch to the production URL when promoted.
6. Approve or reject the robots policy in `proposed/robots.txt` (it governs the whole host, including the production root).

## Not started until approval (gated)
Re-exporting the 436 existing derivatives; changing `staging/tools/gbmedia.py` (`NOTICE`, `CREATOR`, band text), which still writes the old "GB Gamer Bros™ x Happy Dude®" wording into every rebuilt image; dropping the CSS overscan band; deploying any marked image or `robots.txt`.
See `METADATA_STANDARD.md` for the metadata fields and attribution structure.


## Update 2026-10-11: stronger samples for characters, enemies and hero assets (`v2/`)
Owner feedback: the first marks were too small and too easy to crop; characters, enemies, hero assets and approved canonical designs matter most, environment and level-preview stills matter less.

`tools/export_protected_sample.py` prints the mark **onto the subject**: it is clipped to the figure's own opaque pixels, so it scales, moves and crops with the figure and cannot be removed by cropping empty canvas. The operator picks a zone (a rectangle in fractions of the subject) that keeps faces, glowing cores, eyes, hardware and other defining detail clear. Marks are 46 to 81 % of the subject's width (the first samples were about 15 % of the image width).

Subjects: Gamer Bro Blue (character), Prism Keeper™ and Goom Bot™ (enemies), Brightback™ V1 (hero asset). Three strengths each:
| Level | Mark | Opacity | Edge | Second mark |
|---|---|---|---|---|
| A | large | about 24 % | none | no |
| B | larger | about 38 % | fine contrast edge | yes, where the zone allows |
| C | largest | about 55 % | contrast edge | yes |
Files: `v2/<subject>_<A|B|C>.webp` (+ `-960.webp`, `.audit.json`). Sources are today's public derivatives with the old band cropped; real runs start from the private masters. Metadata is the approved rights set.

Honest limits: a skilled retoucher can paint a printed mark out, and metadata is stripped by many platforms. This deters casual reuse and shows provenance; it does not prevent copying and does not make any service credit HAPPY DUDE®. Cutout sources with gaps (legs, crystals) break the mark where the figure has no pixels; Level C reads best on solid bodies.

Still gated: no mass export, no replacement of production art, no robots.txt or domain-wide crawler policy until the owner approves a level and zones.
