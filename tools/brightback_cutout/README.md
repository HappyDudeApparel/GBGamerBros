# Brightback™ V1 clean cutout (how the derivative was made)

Source: `Brightback Final Evolution V1.jpg` (Drive 1VPqGajMsVIKV2m02cCsja2aM6b3ElwuM, 1536x864), the approved V1 sheet. The figure is separated from the
sheet background so the sheet's baked caption ("BRIGHTBACK™ 3/4 FRONT VIEW (HERO)") and header strip never appear. No pixel of the character is repainted.

Scripts were run in order from a scratch folder with the sheet at `../bb_src/v1_sheet.jpg`:
1. `seg1.py`  GrabCut with colour-based seeds (pale sky/snow = background, dark purple rock = foreground); the caption box area is forced to background.
2. `seg2.py`  lists components (check only).
3. `seg3.py`  removes the tan ground strip, keeps the largest component, closed-form alpha matting (pymatting), foreground colour estimation.
Then the bottom 60 px was cleaned of ground fragments with a morphological opening and the last 10 rows were faded; the result was trimmed to 692x604 and saved as WebP.
Edge quality was inspected on pale and navy backgrounds. Known limit: the lowest foot edges are slightly soft because the source stands on rocky ground there.
The original PNG crops and the sheet are unchanged. Requires: opencv-python-headless, pymatting, Pillow.
