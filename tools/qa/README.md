# QA scripts (Playwright + Chromium)

Serve the repo (`python3 -m http.server 8765` from the repo root) and run, e.g.:

    python3 tools/qa/functional.py http://localhost:8765/staging/   # every dossier/tab/state, 6 viewports; reports errors, broken images, overflow
    python3 tools/qa/screenshots.py out_dir                         # foes, footer, header, dossiers at 5 viewports
    python3 tools/qa/evolution.py out_dir                           # evolution panel (sequence / in the world)
    python3 tools/qa/rotor_resolution.py out_dir                    # Rotor Bot displayed-size vs native-pixel measurement

The scripts point at `/opt/pw-browsers/chromium-1194/...` (the cloud container's Chromium); change `executable_path` elsewhere.
These render the files only; they do not prove the live site until pointed at the live URL.
