# Asset provenance for the 2026-10-11 pass (derivatives only; masters untouched)

| New public file | Source (Drive id) | Operation |
|---|---|---|
| entities/brightback-v1-cutout.webp | Brightback Final Evolution V1.jpg (1VPqGajM...) | figure cut out of the approved sheet, see tools/brightback_cutout |
| entities/brightback-v1-{face,hand,turnaround}-clean.webp | existing brightback-v1-*.png | crop-only (removes the baked panel frame, 4-8 px) |
| entities/stone-golem-card.webp, crystal-guardian-card.webp | existing *-hero.webp | tools/make_enemy_card_cutout.py: drop copyright band, fade semi-transparent bottom smoke; opaque pixels unchanged |
| systems/portals/portal-frost | FROST_PEAKS_PORTAL_FINAL_PASS.png (18oQsaJ-...) | bottom 45 px (baked "Happy Dude® Customs" line) cropped |
| systems/portals/portal-river | RIVERWORKS_INTERIOR_FINAL_PASS.png (1apGWTd_...) | bottom 45 px (baked line) cropped |
| systems/portals/portal-summit | PORTAL_REFERENCE_SUMMIT_PURPLE_WIDE.png (10Zkdrov...) | none (no baked text) |
| gear/smartwatch-hardware | 01_Hardware_Spec_Mountain_LED.png (1IEBoR2g...) | tools/make_watch_showcase.py: exact crops composed, <=1.6x |

All exports carry the approved rights metadata (dc:rights = the exact notice, business contact only) and no visible mark. Per-file audit JSON: staging/tools/provenance (dev source).
Summit Spine™: the portal reference is the approved summit/purple wide portal reference; the Summit Spine area has no published guide, so Fast Travel shows it as "portal preview only".
