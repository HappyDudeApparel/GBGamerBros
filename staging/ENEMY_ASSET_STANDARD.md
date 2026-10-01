# GB GAMER BROS™ — Enemy & Hazard Asset Standard

Status: **tracking sheet for the forthcoming Enemy & Hazard Bible.** No enemy art was generated in Pass C.

## One registry, one detail view

Every enemy, hazard, portal, prop and collectible has **one canonical ID** in `entities.js`. These all open the same `#entity/<id>` detail view:

- the Bad Guys & Hazards cards
- the Fast Travel panel (`portal`)
- (Pass E) hotspots inside area images: `{ ref: "goom", x, y, w, h }` in `areas.js`

Tested: a Goom hotspot injected into a Riverworks™ image opened the same `#entity/goom` dossier, and browser Back returned to the area view.

To replace art or copy, edit the entry in `entities.js` or rebuild the image with `tools/gbmedia.py`. No section, dialog or layout code changes are needed.

| Field in entities.js | Feeds |
|---|---|
| `media.thumb` | section card and dossier (until a render exists) |
| `media.render` | large dossier image (takes over from the thumb automatically) |
| `media.icon` | future map/legend/UI icon |
| `copy.summary / behaviour / where` | dossier text (`provisional: true` shows "Working copy · not final") |
| `encounter[]` | dossier encounter strip; each links into the area gallery view |
| `states.idle / active / defeated` | dossier "Visual states" row; empty shows "Not yet available" |
| `refs.front / threeQuarter / side / back / scale` | production tracking (not shown publicly) |

## Status values

`CANONICAL` (approved master) · `PROVISIONAL` (usable on staging, not final) · `REPLACEMENT_REQUIRED` (exists, but must be redone) · `MISSING` (does not exist).

## Enemy and hazard tracking

The current core set. The thumbnail source for all six is the Bad Guys & Hazards panel of `PRIMARY_APPROVED_TARGET.png`: each tile is about 85 × 52 px in the source, upscaled 3× for the site.

| ID | Working name | Type | Production | Thumbnail | Clean render | Icon | Encounter image | Front | ¾ | Side | Back | Idle | Active/attack | Defeated | Scale | © | Final art |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `goom` | Goom | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | PROVISIONAL ¹ | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |
| `spike-bot` | Spike Bot | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | PROVISIONAL ² | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |
| `flying-enemy` | Flying Enemy | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |
| `turret` | Turret | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |
| `crystal-guardian` | Crystal Guardian | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |
| `rolling-boulder` | Rolling Boulder | hazard | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |

¹ Red-capped round bots appear in Riverworks™ view 2 and Ruin Courtyard™ view 1. They look like the Goom, but the match isn't confirmed; the dossier labels them "match to confirm".
² A black spiked enemy appears in Ruin Courtyard™ view 2; its match to Spike Bot is unconfirmed.

**Thumbnails are REPLACEMENT_REQUIRED** because they're upscaled from tiny target tiles. They show the approved designs, but they're soft at the dossier size. That's why the dossier caption reads "Concept thumbnail. Clean render in production."

## Other registered IDs (for Pass E hotspots)

| ID | Type | Production | Detail art | Notes |
|---|---|---|---|---|
| `portal` | portal | PROVISIONAL | PROVISIONAL (Fast Travel still) | Must follow the canonical portal family once standardised. |
| `springboard` | prop | PROVISIONAL | MISSING | Canonical spec approved in WORLD_ASSET_STANDARD.md. |
| `crate` | prop | PROVISIONAL | MISSING | Canonical spec approved in WORLD_ASSET_STANDARD.md. |
| `gem` | collectible | PROVISIONAL | MISSING | |
| `coin` | collectible | MISSING | MISSING | No coins appear in the current world images. |

## Design variants seen in the reference pack (not adopted)

The 05 production boards show other enemy concepts: Patrol Bot, Rock Goom, Fire Goom, Shield Bot, Heavy Bot, Plant Enemy, a boss concept, and a crown-helmet knight. There are also alternative Goom/Spike/Flyer designs. None has been added. The approved core set stays the six above until the Bible says otherwise.

## Art needed for the Bible (per enemy/hazard)

1. A clean, isolated hero render (transparent, ≥1500 px tall)
2. A turnaround: front, ¾, side and back
3. Idle, active/attack and defeated/inactive states
4. A scale reference next to Gamer Bro Blue™
5. A small icon for the legend/UI
6. At least one encounter image in a region, using the canonical banners, crates and springboards
