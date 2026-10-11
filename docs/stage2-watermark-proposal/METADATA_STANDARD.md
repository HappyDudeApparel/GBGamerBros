# Public image metadata and attribution standard (proposal)

## Fields written by `tools/export_public_image.py` (XMP + EXIF, every variant)
| Field | Value | Notes |
|---|---|---|
| `dc:rights` / `photoshop:Copyright` | `© 2026 HAPPY DUDE®. All rights reserved.` | Exact owner-approved line |
| `dc:creator` / EXIF Artist | `HAPPY DUDE®` | Brand byline only; the individual owner is kept in the private IP register |
| `photoshop:Credit` | `A HAPPY DUDE® Original` | Owner-approved promotional attribution |
| `photoshop:Source` | `GB GAMER BROS™ — ADVENTURE MOUNTAIN™` | Property marks use ™ (not registered) |
| `dc:title` | per image, e.g. `Gamer Bro Blue — sporty pose` | |
| `xmpRights:Marked` | `True` | |
| `xmpRights:WebStatement` | rights page URL | staging today; production URL on promotion |
| `xmpRights:UsageTerms` | all rights reserved; see the Rights & IP page for reuse and credit | |
| `Iptc4xmpCore:CreatorContactInfo` | `info@happydude.ca`, `https://happydude.ca/` | The only owner-approved public contact |
| `plus:Licensor` | `HAPPY DUDE®`, rights URL, `info@happydude.ca` | Licensing contact for the PLUS/Google "licensable" fields |
| EXIF Copyright / Artist / ImageDescription | ASCII form `(c) 2026 HAPPY DUDE(R)…` | EXIF text is ASCII; exact Unicode is in XMP and the Windows XP tags |

## Deliberately NOT written
Personal legal name, address, personal phone/email; any statement about how the art was produced (owner decision: no public AI-method declarations or exclusive-ownership guarantees); GPS/device data; registration numbers for the unregistered ™ marks.
The check `no_personal_identifiers` (approved business email only, plus an optional private denylist from an environment variable) runs on every export; the repository guard applies the same generic checks to all public text files.

## Page-level structured data (sample: `imageobject-samples.jsonld`, not deployed)
One schema.org `ImageObject` per featured image: `contentUrl`, `name`, `creditText` (`A HAPPY DUDE® Original`), `copyrightNotice`, `creator` (Organization `HAPPY DUDE®`), `license` and `acquireLicensePage` (Rights & IP page). Google reads these for its "Licensable" badge; it does not guarantee credit.

## Attribution structure (what a reader or crawler can find, in layers)
1. Visible mark inside the picture (`HAPPY DUDE®`). 2. XMP/EXIF in the file. 3. `ImageObject` data and the footer notice on the page. 4. Rights & IP page (terms, credit request, contact). 5. Private register (asset ID, master hash, chain of title; never published).
Each layer can be defeated independently; together they show provenance, they do not enforce it.

## Verification performed on the four samples
Each `.audit.json` records: source SHA-256 before and after (unchanged), content box, mark position, output SHA-256, and a read-back of the XMP/EXIF of both the full and the 960 px variant (all fields above present; no personal name).
