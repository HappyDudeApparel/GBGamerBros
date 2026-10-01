# GB GAMER BROS™ — Enemy & Hazard Asset Standard

Status: **Visual authority: board D "Enemy & Hazard Bible v1" (revised); see `VISUAL_AUTHORITY.md`.** No enemy art was generated. The website tiles stay as provisional placeholders until standalone high-resolution production PNGs are supplied.

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

Authority: **Enemy & Hazard Bible v1 (revised), board D** in `VISUAL_AUTHORITY.md`.

The website tiles for six enemies are upscaled crops of tiny tiles from the original target image (about 85 × 52 px). They are **provisional placeholders whose designs are superseded by board D**. For example, the tile Goom has a mushroom cap and the tile Turret is a robot. They stay only until standalone production PNGs arrive. Rock Guy has no website image and shows "Artwork in production".

| ID | Name | Type | Production | Thumbnail | Clean render | Icon | Encounter image | Front | ¾ | Side | Back | Scale | © | Final art |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `goom` | Goom | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | PROVISIONAL ¹ | MISSING | MISSING | MISSING | — | MISSING | APPLIED | PROVISIONAL |
| `spike-bot` | Spike Bot | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | PROVISIONAL ² | MISSING | MISSING | MISSING | — | MISSING | APPLIED | PROVISIONAL |
| `flying-enemy` | Flying Enemy | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | — | MISSING | APPLIED | PROVISIONAL |
| `turret` | Turret | enemy | PROVISIONAL | REPLACEMENT_REQUIRED (tile shows the non-canonical robot) | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | APPLIED | PROVISIONAL |
| `rolling-boulder` | Rolling Boulder | hazard | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | — | — | — | — | MISSING | APPLIED | PROVISIONAL |
| `rock-guy` | Rock Guy | enemy | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | n/a | MISSING |
| `crystal-guardian` | Crystal Guardian | enemy | PROVISIONAL | REPLACEMENT_REQUIRED | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | — | MISSING | APPLIED | PROVISIONAL |

"—" = not planned unless useful. ¹ Red-capped bots in Riverworks™ view 2 and Ruin Courtyard™ view 1; match unconfirmed. ² Spiked enemy in Ruin Courtyard™ view 2; match unconfirmed.

## Planned angles and states (board D)

All entries are MISSING until supplied. No animation mechanics are implied. The public dossier lists each state as "Not yet available" until its image exists.

| ID | Angles | States |
|---|---|---|
| `goom` | front, ¾, side | idle, movement, alert/attack, defeated |
| `spike-bot` | front, ¾, side | idle, rolling/movement, alert/attack |
| `flying-enemy` | front, ¾, side | hover, patrol, attack, defeated |
| `turret` | front, ¾, side, back | idle, tracking, firing, cooldown/inactive |
| `rolling-boulder` | — | idle, rolling, hit/cracked, destroyed (+ evolution transition later) |
| `rock-guy` | front, ¾, side | idle, chase/move, melee attack, defeated |
| `crystal-guardian` | front, ¾, side | idle, charge, attack, defeated/inactive |

## Design direction (board D)

| ID | Canonical design | Notes |
|---|---|---|
| `goom` | Dark round body, red spikes, glowing yellow eyes | Basic enemy. |
| `spike-bot` | **Restrained** compact dark body with deliberate red spikes and a readable face | Not an oversized porcupine ball. |
| `flying-enemy` | Round dark body, glowing core, red/orange **rotor/propeller** | Must keep its rotor silhouette; never a plain orb. |
| `turret` | **Stationary cannon**, red/black, GB-branded base, aiming barrel | The bipedal robot is not canonical. |
| `rolling-boulder` | Rock sphere with glowing orange cracks | Phase 1 of the boulder line. |
| `rock-guy` | Rocky golem visibly built from the boulder, no crystals, melee look, orange/yellow eyes acceptable | Phase 2. New canonical enemy. |
| `crystal-guardian` | Rock Guy body family with purple crystal growths and a bright crystal core | Phase 3. Copy stays "Guards key areas." |

## Evolution line

`rolling-boulder` → `rock-guy` → `crystal-guardian`, defined in `entities.js` (`GB_EVOLUTION.boulder`, and `evolution.phase` on each member).

- Evolution is **optional**. A Rolling Boulder may simply roll, smash, fall away or stop.
- **No trigger is coded.** The candidates (after stopping, random, scripted, damage/state threshold, authored level event) are all undecided.
- Each member's dossier shows the line with links between the phases.

## Replacing art when production PNGs arrive

1. Build each PNG: `python3 staging/tools/gbmedia.py build <png> staging/assets/entities/<id>-thumb` (likewise `-render`, `-icon`, `-<state>`).
2. Point `media.thumb`, `media.render`, `media.icon` or the matching `states` entry at the new key in `entities.js`. The ID and the `#entity/<id>` route stay the same.
3. Run `python3 staging/tools/revision.py`, commit, then `python3 staging/tools/publish.py`. The new revision URLs mean no stale copy can show, and replaced files are removed from main.

## Other registered IDs (for Pass E hotspots)

| ID | Type | Production | Detail art | Notes |
|---|---|---|---|---|
| `portal` | portal | PROVISIONAL | PROVISIONAL (Fast Travel still) | Must follow the canonical portal family once standardised. |
| `springboard` | prop | PROVISIONAL | MISSING | Canonical spec approved in WORLD_ASSET_STANDARD.md. |
| `crate` | prop | PROVISIONAL | MISSING | Canonical spec approved in WORLD_ASSET_STANDARD.md. |
| `adventure-crystal` | collectible | PROVISIONAL | MISSING | Formerly `gem`. |
| `coin` | collectible | PROVISIONAL | MISSING | Canonical design on boards A/B/C (mountain emblem). Not yet in any world image. |
| `secret-key` | collectible | MISSING | MISSING | Name: Secret Key / Rare Crystal. |
| `treasure-chest` | collectible | MISSING | MISSING | Treasure Chest (GB). |

## Design variants seen in older reference packs (not adopted)

The 05 production boards show other enemy concepts: Patrol Bot, Rock Goom, Fire Goom, Shield Bot, Heavy Bot, Plant Enemy, a boss concept, and a crown-helmet knight. There are also alternative Goom/Spike/Flyer designs. None has been added. The approved core set stays the six above until the Bible says otherwise.

## Art needed for the Bible (per enemy/hazard)

1. A clean, isolated hero render (transparent, ≥1500 px tall)
2. A turnaround: front, ¾, side and back
3. Idle, active/attack and defeated/inactive states
4. A scale reference next to Gamer Bro Blue™
5. A small icon for the legend/UI
6. At least one encounter image in a region, using the canonical banners, crates and springboards
