# Character assets register

Characters: **Gamer Bro Blue™, Gamer Bro Red™, Gamer Girl Purple™, Gamer Girl Yellow™**.
Two approved outfit families, never mixed within one character: **hoodie/cargo** (Adventure Mountain style) and **sporty** (jersey and shorts; Yellow uses the athletic shorts).
Source: Drive folder `Gamer Bros / CLAUDE_CURRENT_LOOSE_ASSETS`. Each file was retrieved individually and verified on 2026-10-01. Masters stay in Drive; only the public derivatives below are in the repo.

## Loose-asset audit

| File | Size | SHA-256 (16) | Characters / look | Audit | Use |
|---|---|---|---|---|---|
| GB_BLUE_RED_CLEAN_HIGH_FIVE.png | 1122×1402 RGBA | `690da776b4d3d3e1` | Blue + Red, hoodie/cargo | Hands, shoes, hair, headphones complete; clean alpha; no edge contact; no backpacks | **Used**: hero character layer (`assets/characters/blue-red-high-five`), replacing the old cutout with the cropped hand |
| GB_BLUE_WORLD_ACTION_01.png | 1672×941 | `0b255f4faba07898` | Blue, sporty | World-dominant, Blue centred | **Used**: hero slide 2 |
| GB_PURPLE_YELLOW_WORLD_ACTION_01.png | 1672×941 | `dbb077af34f57d85` | Purple + Yellow, sporty | Good; on phones the fixed sign overlaps Yellow's torso | **Used**: hero slide 3 |
| GB_BLUE_RED_WORLD_ACTION_01.png | 1672×941 | `02608adfed5d7748` | Blue + Red, hoodie/cargo | Background flyers/blobs are old non-canonical enemy designs | **Used**: Level Preview still 1 (characters sit under the hero copy, so not a hero slide) |
| GB_PURPLE_YELLOW_WORLD_ACTION_02.png | 1672×941 | `5540458bf92122b1` | Purple + Yellow, hoodie/cargo | Good | **Used**: Level Preview still 2 |
| GB_FOUR_CHARACTER_WORLD_ACTION_01.png | 1672×941 | `cb3106fc58943f08` | All four, mixed looks (each consistent) | World-dominant; in the wide hero crop Purple/Yellow fall off the left edge | **Used**: Level Preview still 3 |
| GB_FOUR_CHARACTER_WORLD_ACTION_02.png | 1672×941 | `11ca4d3b2785f740` | All four, front-and-centre | Good team image | Reserved: Meet the Team™ header / marketing |
| GB_PURPLE_WORLD_ACTION_01.png | 1122×1402 | `1fcd4c5309dd2755` | Purple, sporty | Good portrait action | Reserved: Gamer Girl Purple™ detail page |
| GB_YELLOW_WORLD_ACTION_01.png | 1122×1402 | `f0ae5d4622c2812b` | Yellow, sporty (athletic shorts) | Good portrait action | Reserved: Gamer Girl Yellow™ detail page |

Notes on world details inside the scenes: they use crown banners and crown-emblem coins (canonical assets use the mountain mark), and BLUE_RED_WORLD_ACTION_01 shows old enemy designs. These are **source-art corrections**: never hide or repaint them with CSS; replace the scene masters when corrected versions arrive.

## Retired from the public build (replaced by the above)
- Old high-five cutout extracted from the target image (Blue's hand was hidden).
- Gamer Bro Blue™ 720p video stills: hero slides 2–4 and Level Preview stills 1–2.
- `cascading_gb_crystal_ruins` Level Preview still: back to unassigned.

## Still missing before the final Meet the Team™

Official Blue, Red, Purple and Yellow turnaround/reference material exists and will be supplied before implementation.

| Character | Have | Missing |
|---|---|---|
| Gamer Bro Blue™ | high-five (hoodie), solo world action (sporty), duo/team scenes | Clean transparent solo hero render per look; alternate poses; clean turnaround |
| Gamer Bro Red™ | high-five (hoodie), duo/team scenes | Any solo world action; transparent solo hero render per look; sporty look; turnaround |
| Gamer Girl Purple™ | solo world action (sporty), duo/team scenes, turnaround reference | Transparent solo hero render per look; alternate poses |
| Gamer Girl Yellow™ | solo world action (sporty), duo/team scenes, turnaround reference | Transparent solo hero render per look; alternate poses |

## Approved character masters (Drive `CHARACTER_PRODUCTION_V1/APPROVED_CHARACTER_MASTERS`, retrieved 2026-10-01)

Masters stay private (Drive + session scratchpad), never in the repo. Each public image is ONE view isolated from a sheet (background removed with rembg isnet-general-use), built with `gbmedia.py` (transparent band + XMP/EXIF). The `master` field in media-manifest.js names the source sheet and view.

| Master | Size | SHA-256 (16) | Public derivatives (`assets/characters/…`) |
|---|---|---|---|
| GAMER_BRO_BLUE_SPORTY_MULTI_VIEW_V1.jpeg | 1536×857 | `7a2837b17bf3490f` | blue/sporty-{pose,front,side,back} |
| GAMER_BRO_BLUE_STREETWEAR_MULTI_VIEW_V1.jpeg | 1776×592 | `f866ae159b1baf1b` | blue/street-{front,threeq,side} (sheet has no back/pose) |
| GAMER_BRO_RED_SPORTY_MULTI_VIEW_V1.jpeg | 1536×857 | `7139938a38331c3e` | red/sporty-{pose,front,side,back} |
| GAMER_BRO_RED_STREETWEAR_MULTI_VIEW_V1.jpeg | 1376×768 | `bf2d6543cf8d3af7` | red/street-{pose,front,side,back} |
| GAMER_GIRL_PURPLE_SPORTY_MULTI_VIEW_V1.jpeg | 1376×768 | `c18d7d04e23aa024` | purple/sporty-{pose,front,side,back} |
| GAMER_GIRL_PURPLE_STREETWEAR_MULTI_VIEW_V1.jpeg | 1536×857 | `8a16a61694707490` | purple/street-{pose,front,side,back} |
| GAMER_GIRL_YELLOW_SPORTY_MULTI_VIEW_V1.png | 1024×572 | `5b3ac7e1fbfa3f4d` | yellow/sporty-{pose,front,side,back} (corrected athletic shorts) |
| GAMER_GIRL_YELLOW_STREETWEAR_MULTI_VIEW_V1.jpeg | 1536×857 | `1ca1e18cedd36bbb` | yellow/street-{pose,front,side,back} |

Meet the Team™ cards use each character's Sporty personality pose. Detail route `#character/<id>[/sporty|streetwear]` (registry `characters.js`).
Native resolution is modest (figures ~520–800 px tall); higher-resolution single-view renders would sharpen the cards on retina screens.
