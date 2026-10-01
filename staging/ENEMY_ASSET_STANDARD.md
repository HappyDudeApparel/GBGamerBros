# GB GAMER BROS™ — Enemy & Hazard Asset Standard

Status: **Visual authority: the enemy production sheets G–M, then the revised Bible D (precedence in `VISUAL_AUTHORITY.md`).** No enemy art was generated. Sheets are internal references only; website art comes from standalone production PNGs.

## Canonical names (current)

Goom (`goom`) · Spike Bot (`spike-bot`) · Rotor Bot (`rotor-bot`) · Sentry Cannon (`sentry-cannon`) · Rolling Boulder (`rolling-boulder`) · Stone Golem (`stone-golem`) · Crystal Guardian (`crystal-guardian`). The public section is titled **Enemies & Hazards**.

Legacy names and IDs (Flying Enemy, Turret, Rock Guy, `gem`) live only in `GB_ENTITY_ALIASES`. `#entity/<old>` rewrites to the canonical ID. Older sheets that use the legacy names still apply to the renamed entity.

## One registry, one detail view

Every enemy, hazard, portal, prop and collectible has **one canonical ID** in `entities.js`. These all open the same `#entity/<id>` detail view:

- the Enemies & Hazards cards
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

`CANONICAL` (approved master) · `PROVISIONAL` (usable on staging, not final) · `REPLACEMENT_REQUIRED` (exists, but must be redone) · `MISSING` (does not exist as a standalone asset). "Sheet" means the design exists on a production sheet but no standalone file has been supplied.

## Enemy and hazard tracking

| ID | Name | Type | Height | Production | Website thumb | Clean render | Icon (256) | Encounter image | Front | ¾ | Side | Back | Scale ref | © | Final art |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `goom` | Goom | enemy | 0.5 m | MISSING | MISSING | MISSING (sheet) | MISSING (sheet) | MISSING (sheet) | sheet | sheet | sheet | sheet | sheet | — | MISSING |
| `spike-bot` | Spike Bot | enemy | 0.5 m | MISSING | MISSING | MISSING (sheet) | MISSING (sheet) | MISSING | sheet | sheet | sheet | sheet | MISSING | — | MISSING |
| `rotor-bot` | Rotor Bot | enemy | 0.8 m | MISSING | MISSING | MISSING (sheet) | MISSING (sheet) | MISSING (sheet) | sheet | sheet | sheet | sheet | sheet | — | MISSING |
| `sentry-cannon` | Sentry Cannon | enemy | 1.0 m | MISSING | MISSING | MISSING (sheet) | MISSING (sheet) | MISSING (sheet) | sheet | sheet | sheet | sheet | sheet | — | MISSING |
| `rolling-boulder` | Rolling Boulder | hazard | 1.5 m | PROVISIONAL | PROVISIONAL (target crop) | MISSING (sheet) | MISSING (sheet) | MISSING (sheet) | sheet | sheet | sheet | sheet | sheet | APPLIED | PROVISIONAL |
| `stone-golem` | Stone Golem | enemy | 2.0 m | MISSING | MISSING | MISSING (sheet) | MISSING (sheet) | MISSING (sheet) | sheet | sheet | sheet | sheet | sheet | — | MISSING |
| `crystal-guardian` | Crystal Guardian | enemy | 2.5 m | MISSING | MISSING | MISSING (sheet) | MISSING (sheet) | MISSING (sheet) | sheet | sheet | sheet | sheet | sheet | — | MISSING |

Extra angles: Goom also has **top** and **bottom** on sheet K.

## States (from the newest specific sheet)

Every state is "sheet" (designed) but MISSING as a standalone file. The public dossier lists them as "Not yet available".

| ID | States | Source |
|---|---|---|
| `goom` | Idle, Walk, Alert, Attack / charge, Defeated | K, L, M |
| `spike-bot` | Idle, Roll, Alert, Attack, Defeated | J |
| `rotor-bot` | Hover, Patrol, Attack, Dive, Defeated | G |
| `sentry-cannon` | Idle, Tracking, Firing, Cooldown, Inactive (destroyed/off variants) | K, L, M |
| `rolling-boulder` | Idle, Rolling, Impact, Cracked, Destroyed | H, I |
| `stone-golem` | Idle, Walk / chase, Melee attack, Hit / stagger, Defeated | H, I |
| `crystal-guardian` | Idle, Charge, Attack, Damaged, Defeated | G, I |

## Design direction

| ID | Canonical design | Must not drift into |
|---|---|---|
| `goom` | Round dark body, a few red cone spikes, round red feet, large glowing yellow eyes, small smile | The old mushroom-cap Goom |
| `spike-bot` | Compact dark sphere, **restrained** evenly spread red cone spikes, red glowing core | An oversized porcupine ball; black or gold spikes |
| `rotor-bot` | Round dark body, glowing yellow-orange core, **four orange/red side propellers** | A plain orb; a single-rotor helicopter |
| `sentry-cannon` | Fixed red/black hexagonal base with a "GB" plate and a **rotating** upper cannon with a glowing muzzle | The bipedal robot |
| `rolling-boulder` | Stone-plate sphere with moss; glowing orange cracks appear in the Cracked state | |
| `stone-golem` | Same stone plates and moss as the boulder, golem body, glowing orange/yellow eyes and seams, **no crystals** | Any crystal growth |
| `crystal-guardian` | Stone Golem anatomy with purple crystal growths and a bright purple core | An all-crystal figure without the rock body |

## Unreal / Astra reference

Taken only from what the sheets state. **TBD IN UNREAL** = not established by any sheet.

| ID | Height | Collision intent | Locomotion | Animation type | Rotating / articulating parts | LODs | Materials | Emissive | Physics | Destructible | AI / role | Placement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `goom` | 0.5 m | Simple capsule/sphere | Ground walk; patrols; turns at edges | TBD IN UNREAL | Spikes and feet (TBD IN UNREAL) | Multiple | Dark body, red spikes | Eyes | Light; knockback possible | No | Basic ground patrol and chase; defeat method TBD IN UNREAL | Groups; all regions |
| `spike-bot` | 0.5 m | TBD IN UNREAL | Static or patrol; rolls | TBD IN UNREAL | TBD IN UNREAL | TBD IN UNREAL | Dark body, red spikes | Core (TBD IN UNREAL) | TBD IN UNREAL | No | Contact hazard; protects routes | Ruins, bridges |
| `rotor-bot` | 0.8 m | Simple aerial | Hover, patrol routes, dive attacks; holds altitude | TBD IN UNREAL | Four rotors | Multiple | Metal body, rotors | Core, rotors | Light (hover behaviour) | No | Tracks the player, dives | Patrol routes above paths |
| `sentry-cannon` | 1.0 m | Static base; separate hit/collision for barrel | Stationary | TBD IN UNREAL | Cannon: 360° horizontal, limited vertical | Multiple | Red/black metal, GB branding | Barrel/muzzle | Static | Destroyed state shown; method TBD IN UNREAL | Target acquisition and line of sight; range and projectile type TBD IN UNREAL | Defensive positions, ruins, bridges, key routes |
| `rolling-boulder` | 1.5 m | Heavy; pushes/destroys objects | Rolls along set paths; can fall off the map | Rigid body | Whole body rolls | Multiple | Rock, moss, dirt | Cracks (cracked state) | Rigid body, gravity, momentum | Yes: impact, cracked, destroyed; destroys objects | Environmental hazard; optional evolution | Chase segments, timed routes, slopes |
| `stone-golem` | 2.0 m | Per enemy (TBD IN UNREAL) | Walk/chase | TBD IN UNREAL | TBD IN UNREAL | Multiple | Rock, moss | Eyes and internal seams | TBD IN UNREAL | Defeated pose shown; method TBD IN UNREAL | Melee enemy; optional evolution | Ruins, cliffs |
| `crystal-guardian` | 2.5 m | Heavy, large hitbox | Moves, charges | TBD IN UNREAL | TBD IN UNREAL | Multiple | Rock, purple crystals | Crystals, core | Heavy (stone body) | Defeated pose shown; method TBD IN UNREAL | Guards key areas; attack type TBD IN UNREAL | Key areas, Prism Ridge™ |

Sheet M specifies the hero-render deliverable for Goom and Turret: a ~2000 px transparent PNG plus 256 × 256 icons.

## Evolution line

`rolling-boulder` → `stone-golem` → `crystal-guardian`, defined in `entities.js` (`GB_EVOLUTION.boulder`, and `evolution.phase` on each member).

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
