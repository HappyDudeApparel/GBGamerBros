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
