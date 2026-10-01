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
| B | **GB Gamer Bros™ Adventure Mountain™ — Visual Design Bible v1** (the Enemy & Hazard Bible v1) | Primary enemy and hazard authority; also shows the regional portal family | 1536 × 643 JPEG | `dd4f8fc97a63fbe4` | Goom, Spike Bot, Flying Enemy, Turret, Crystal Guardian, Rolling Boulder; portals for all 7 regions; portal states; collectibles; traversal props |
| C | **Adventure Mountain™ — World & Game Assets v1.1** | Additional approved board | 1672 × 793 JPEG | `6e8b5e7258431618` | Same families as A, plus Frost Peaks™ in the world overview, zipline/rail and climbable-ledge traversal, region-route legend |

## Precedence

1. **World assets:** A is primary. C may refine it. Where C adds an element that A doesn't cover (ziplines/rails, climbable ledges), C governs.
2. **Enemies and hazards:** B is primary. C's "Enemies & Hazards (Overview)" row is supporting.
3. **Open conflicts** need a decision before production art is approved; see below.

## Open conflicts between boards

| Item | Board B (Bible v1) | Board C (v1.1) | Status |
|---|---|---|---|
| **Turret** | Bipedal robot body with a red helmet and "GB" chest plate | Stationary cannon on a red/black GB-branded base | **Decision needed**: which turret form is canonical |
| **Goom** | Black sphere with red spike-tipped top and glowing yellow eyes | Same family, slightly fewer/larger spikes | Treated as the same design; minor variation |
| **Spike Bot** | Black/red sphere with silver spikes | Same family | Consistent |
| **Portal states** | Active, Discovered, Inactive/Locked, Cave/Interior | Active (Standard), Discovered, Inactive/Locked | Cave/Interior appears only in B; recorded as a visual variant, not a mechanic |

## What changes because of these boards

- The **current website enemy tiles** (cut from the original target image) are now confirmed as **design-superseded**. The Goom tile's red mushroom-cap design does not match the Bible's spiked Goom. All six stay on staging as provisional placeholders until production PNGs arrive. See `ENEMY_ASSET_STANDARD.md`.
- **Region banner colours** in `WORLD_ASSET_STANDARD.md` are confirmed by A. The Frost Peaks™ banner uses white trim and white graphics on ice blue (the earlier navy-trim proposal is withdrawn).
- **Collectible names** shown on A/B/C (Coin, Adventure Crystal, Secret Key / Rare Crystal, Treasure Chest) are recorded as the target vocabulary. The registry (`entities.js`) will be aligned when their production art arrives. No staging change is made now.
- **Nothing on the published staging page changes** because of this register.
