# Visual authority register

Approved design-authority boards for recurring world assets, portals, collectibles and enemies.

**Rules**
- These boards are **design references only**. They are never cropped into website assets.
- Production art arrives as standalone high-resolution PNGs. Until then, the website keeps its current provisional images.
- The boards are not stored in this repository (it is public). They are identified below by name, size and checksum. The originals are kept with the project files.
- Labels printed on the boards (for example "Elite enemy", "High health", "Ranged", portal states) record **design intent**. They do not become website copy or confirmed mechanics until approved separately.

## Registered boards

| # | Board (as titled on the image) | Role | Size | SHA-256 (first 16) | Governs |
|---|---|---|---|---|---|
| A | **Adventure Mountain™ — Canonical World Assets v1** | Primary world-asset authority | 1536 × 1024 PNG | `e1b81ca6c40f87da` | Regional banners, GB crate, springboard, route signs, lantern, world portal (and states), collectibles, pipes, wood rails/bridges, stone/ruin, scale reference |
| B | **GB Gamer Bros™ Adventure Mountain™ — Visual Design Bible v1** | Superseded by D for enemies and hazards; still a reference for the regional portal family | 1536 × 643 JPEG | `dd4f8fc97a63fbe4` | Goom, Spike Bot, Flying Enemy, Turret, Crystal Guardian, Rolling Boulder; portals for all 7 regions; portal states; collectibles; traversal props |
| C | **Adventure Mountain™ — World & Game Assets v1.1** | Additional approved board | 1672 × 793 JPEG | `6e8b5e7258431618` | Same families as A, plus Frost Peaks™ in the world overview, zipline/rail and climbable-ledge traversal, region-route legend |
| D | **GB Gamer Bros™ Adventure Mountain™ — Enemy & Hazard Bible v1** (revised) | **Current enemy and hazard authority**; supersedes B for enemies and hazards | 1672 × 941 PNG | `699a3ba648a879d0` | Core lineup (Goom, Spike Bot, Flying Enemy, Turret, Rolling Boulder, Rock Guy, Crystal Guardian); evolution chain Rolling Boulder → Rock Guy → Crystal Guardian; angles and variants; visual states; encounter notes |
| E | **Enemy & Hazard Bible v1**: "Canonical Enemy Designs · Animation & States · Evolution Paths · Game Implementation Guide" | Detailed sheet; refines D | 1536 × 1024 PNG | `dd015887a0812d0f` | Per-enemy hero, angles (front/¾/side/back), UI icon, states, evolution path, scale reference, in-game region examples |
| F | **Enemy & Hazard Bible v1**: "Canonical Designs for a Unified Adventure Mountain™" | Detailed sheet; refines D | 1536 × 1024 PNG | `9b68dec42713f7e9` | Per-enemy role/behaviour cards, turnarounds, states, in-game examples, scale against the Gamer Bros |
| G | **Enemy Production Assets v1**: Flying Enemy · Rolling Boulder · Crystal Guardian | Individual production sheets | 1536 × 1024 PNG | `4b45cfcba9a1358e` | Hero, angles, icon, states, in-game examples, scale and technical notes for those three |
| H | **Enemy Evolution Chain**: Rolling Boulder → Rock Guy → Crystal Guardian | Evolution production sheet | 1536 × 1024 PNG | `c6f1c0764b8d4c6b` | Angles, icons, states (incl. cracked, hit/stagger), palette, evolution and technical notes |
| I | **Rock Evolution Enemies** (Enemy Evolution Line v1.0) | Evolution production sheet | 1536 × 1024 PNG | `d1733f7ccd97c54f` | Same three; states incl. damaged; technical notes |
| J | **Enemy & Hazard Assets v1** | Full-family production sheet | 1536 × 1024 PNG | `5672cd4f9e622210` | All seven: angles, icons, states; Spike Bot's only dedicated states |
| K | **Game Asset Production Sheet v1**: Goom · Turret | Individual production sheet | 1536 × 1024 PNG | `92b2a17359e05d4e` | Turnaround (Goom incl. top/bottom), states, design/technical notes "for Astra / Unreal" |
| L | **Enemy Asset Pack v1**: Goom · Turret | Individual production sheet | 1536 × 1024 PNG | `81b493f5d23e1613` | Main renders, turnaround, states, environment/placement variants |
| M | **Enemy Production Assets v1**: Goom · Turret | Individual production sheet | 1536 × 1024 PNG | `b07f2f6adf1ae553` | Hero render spec (2000 px transparent), angles, 256 px icons, states, technical notes |

## Precedence

**Enemies and hazards** (newest and most specific wins):
1. Individual / dedicated production sheet: G (Flying Enemy, Rolling Boulder, Crystal Guardian), K, L, M (Goom, Turret)
2. Newest evolution or enemy production sheet: H, I (boulder line), J (all seven; the only dedicated Spike Bot sheet)
3. Revised Enemy & Hazard Bible: D, then its detailed sheets E and F
4. Older general boards: B, C

**World assets:** A governs banners, crate, springboard, route signs, lantern, portals, collectibles, pipes, wood rails/bridges, stone/ruins. C governs ziplines/rails and climbable ledges.

All enemy sheets (D–M) are **internal production references**. They are never published, offered for download or cropped into website art, and their text is never used verbatim as website copy.

## Conflicts between boards (history)

| Item | Board B (Bible v1) | Board C (v1.1) | Status |
|---|---|---|---|
| **Turret** | Bipedal robot body with a red helmet and "GB" chest plate | Stationary cannon on a red/black GB-branded base | **Resolved by D:** stationary cannon, red/black, GB-branded base, aiming barrel. The bipedal robot is not canonical. |
| **Goom** | Black sphere with red spike-tipped top and glowing yellow eyes | Same family, slightly fewer/larger spikes | Treated as the same design; minor variation |
| **Spike Bot** | Black/red sphere with silver spikes | Same family | Consistent |
| **Portal states** | Active, Discovered, Inactive/Locked, Cave/Interior | Active (Standard), Discovered, Inactive/Locked | Cave/Interior appears only in B; recorded as a visual variant, not a mechanic |

## What changes because of these boards

- The **current website enemy tiles** (cut from the original target image) are now confirmed as **design-superseded**. The Goom tile's red mushroom-cap design does not match the Bible's spiked Goom. All six stay on staging as provisional placeholders until production PNGs arrive. See `ENEMY_ASSET_STANDARD.md`.
- **Region banner colours** in `WORLD_ASSET_STANDARD.md` are confirmed by A. The Frost Peaks™ banner uses white trim and white graphics on ice blue (the earlier navy-trim proposal is withdrawn).
- **Collectible names** (Coin, Adventure Crystal, Secret Key / Rare Crystal, Treasure Chest) are now the registry names in `entities.js`; the former `gem` ID is now `adventure-crystal`. No art was added for them.
- Board designs are never cropped into website images; the staging page only changes when standalone production PNGs arrive.

## Board D decisions (current)

- **Turret:** stationary red/black cannon on a GB-branded base. The bipedal robot is not canonical.
- **Flying Enemy:** keeps its rotor/propeller design: round dark body, glowing core, red/orange rotor. Never a plain floating orb.
- **Spike Bot:** the restrained form: a compact dark body with deliberate red spikes and a readable face. Not an oversized porcupine ball.
- **Evolution line:** `rolling-boulder` → `rock-guy` → `crystal-guardian`. Evolution is optional and its triggers are undecided. A Rolling Boulder may simply roll, smash, fall away or stop.
- **Rock Guy** (new, `rock-guy`): a rocky golem visibly evolved from the boulder, with no crystals yet and a melee look. Orange/yellow eyes or energy are acceptable.
- **Crystal Guardian:** the Rock Guy body family with purple crystal growths and a bright crystal core. Website copy stays "Guards key areas."
- **Angles and states:** the per-enemy plan is in `ENEMY_ASSET_STANDARD.md`.

## Boards E and F (detailed Bible sheets)

E and F confirm D's designs: spiked Goom, restrained Spike Bot, rotor Flying Enemy, stationary GB cannon Turret, mossy Rolling Boulder, Rock Guy and Crystal Guardian. Both show a front/¾/side/back turnaround and an icon for every enemy. Their stat labels (Health, Threat, Found In) are design intent only, not website copy.

## Canonical scale (decided)

These are the website, concept and modelling reference heights. They may be tuned in Unreal gameplay testing. Scale values printed on the sheets (for example 0.4 m Goom, 0.6 m Turret, 1.6 m Rock Guy) are superseded.

| Goom | Spike Bot | Flying Enemy | Turret | Rolling Boulder | Rock Guy | Crystal Guardian | Gamer Bros |
|---|---|---|---|---|---|---|---|
| 0.5 m | 0.5 m | 0.8 m | 1.0 m | 1.5 m | 2.0 m | 2.5 m | 1.8 m |

## Sheet text not adopted

- "Aerial Form" under Rock Guy (H, I, J) is a sheet error: Rock Guy is a ground melee enemy.
- "Can be jumped on to defeat" (K) and "Jump attack" (M) are design intent (TBD in Unreal), not website copy.
- Sheet G describes Crystal Guardian attacks as melee, while D says "ranged and melee". This is left TBD; the website copy stays "Guards key areas."

## Website placeholders (enemy tiles)

Checked against the production sheets. Only images that match the canonical design are shown.

| ID | Public image | Why |
|---|---|---|
| `goom`, `turret` | "Artwork in production" | Old crops showed non-canonical designs (mushroom-cap Goom, bipedal Turret). Deleted. |
| `spike-bot` | "Artwork in production" | Old crop had black/gold spikes and yellow eyes; canonical has red spikes and a red core. Deleted. |
| `flying-enemy` | "Artwork in production" | Old crop was a single top-rotor craft with a tail fin; canonical is a round body with four orange side propellers. Deleted. |
| `crystal-guardian` | "Artwork in production" | Old crop was an all-crystal figure without the Rock Guy rock body. Deleted. |
| `rock-guy` | "Artwork in production" | No art yet. |
| `rolling-boulder` | Provisional crop, clearly marked | Mossy stone sphere matches the canonical direction; not final. |

Encounter links from Goom and Spike Bot to area images were also removed: those images show the old red-capped design.
