#!/usr/bin/env python3
"""Character pages, Meet the Team navigation, footer/rights links and the logo, at six viewports.
    python3 tools/qa/characters.py http://localhost:8765/staging/ [out_dir]
Asserts (non-zero exit on failure): no console/page errors, no failed requests, no broken images, no horizontal overflow,
every character x look x view opens and swaps the stage image, prev/next character links work, team arrows move the rail,
Close works, footer text is exact, no Privacy link, rights.html loads, header/footer logo is the clean file and fully rendered."""
import sys, asyncio, os
from playwright.async_api import async_playwright
BASE = sys.argv[1]; OUT = sys.argv[2] if len(sys.argv) > 2 else None
CHROME = os.environ.get("GB_CHROMIUM", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
VPS = [("m360", 360, 740, 3), ("m390", 390, 844, 3), ("land844", 844, 390, 2), ("land932", 932, 430, 2), ("tab768", 768, 1024, 2), ("desk1280", 1280, 800, 1)]
NOTICE = "© 2026 HAPPY DUDE®. All rights reserved."
fails = []

async def main():
    if OUT: os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        for name, w, h, dpr in VPS:
            ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dpr)
            pg = await ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append("pageerror " + str(e)))
            pg.on("console", lambda m: errs.append("console " + m.text) if m.type == "error" else None)
            pg.on("response", lambda r: errs.append(f"http{r.status} {r.url}") if r.status >= 400 else None)
            await pg.goto(BASE, wait_until="networkidle"); await pg.wait_for_timeout(500)
            def chk(c, msg):
                if not c: fails.append(f"[{name}] {msg}")
            chk(await pg.evaluate("document.documentElement.scrollWidth-innerWidth") <= 0, "horizontal overflow on home")
            chk((await pg.inner_text(".site-foot__legal")).strip() == NOTICE, "footer notice not exact")
            foot = await pg.inner_text("footer.site-foot")
            chk("Privacy" not in foot and "Draft" not in foot, "footer still mentions Privacy/Draft")
            chk(await pg.evaluate("[...document.querySelectorAll('a')].every(a=>!/privacy/i.test(a.getAttribute('href')||''))"), "a link to privacy remains")
            for sel in (".brand img", ".site-foot__logo img"):
                d = await pg.evaluate(f"(()=>{{const i=document.querySelector('{sel}');const r=i.getBoundingClientRect();return {{src:i.currentSrc,nw:i.naturalWidth,nh:i.naturalHeight,ok:i.complete&&i.naturalWidth>0,box:i.parentElement.getBoundingClientRect().height,img:r.height}}}})()")
                chk("gb-logo-clean.webp" in d["src"] and d["ok"] and (d["nw"], d["nh"]) == (640, 260), f"{sel}: wrong/failed logo {d}")
                chk(d["box"] >= d["img"] - 1.5, f"{sel}: logo frame clips the image (frame {d['box']:.1f} < img {d['img']:.1f})")
            # Meet the Team: rail arrows (phones) + every character route / look / view
            ids = await pg.evaluate("[...document.querySelectorAll('[data-character]')].map(a=>a.dataset.character)")
            chk(len(ids) == 4, f"expected 4 team cards, got {ids}")
            nxt = await pg.query_selector('[data-team="1"]')
            if nxt and await nxt.is_visible():
                before = await pg.evaluate("document.getElementById('teamList').scrollLeft")
                await nxt.click(); await pg.wait_for_timeout(700)
                chk(await pg.evaluate("document.getElementById('teamList').scrollLeft") > before, "team next arrow did not move the rail")
            for cid in ids:
                card = await pg.query_selector(f'[data-character="{cid}"]')
                await card.scroll_into_view_if_needed(); await card.click(); await pg.wait_for_timeout(600)
                chk(await pg.evaluate("document.getElementById('charView').open"), f"{cid}: dialog did not open from the team card")
                looks = await pg.evaluate("[...document.querySelectorAll('[data-char-look]')].map(b=>b.dataset.charLook)")
                chk(len(looks) >= 1, f"{cid}: no looks")
                for lk in looks:
                    await pg.click(f'[data-char-look="{lk}"]'); await pg.wait_for_timeout(250)
                    n = await pg.evaluate("document.querySelectorAll('[data-char-view]').length")
                    seen = set()
                    for i in range(n):
                        await pg.click(f'[data-char-view="{i}"]'); await pg.wait_for_timeout(120)
                        s = await pg.evaluate("(()=>{const i=document.querySelector('#charStageFig img');return i?i.currentSrc+'|'+i.naturalWidth:''})()")
                        chk(s and not s.endswith("|0"), f"{cid}/{lk}/view{i}: stage image missing/broken"); seen.add(s)
                    chk(len(seen) >= max(1, n - 1), f"{cid}/{lk}: views do not change the stage image ({len(seen)}/{n})")
                bad = await pg.evaluate("[...document.querySelectorAll('#charView img')].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent!==null).map(i=>i.src)")
                chk(not bad, f"{cid}: broken images {bad}")
                chk(await pg.evaluate("document.documentElement.scrollWidth-innerWidth") <= 0, f"{cid}: horizontal overflow")
                if OUT and cid == ids[0]: await pg.screenshot(path=f"{OUT}/{name}_character_{cid}.png")
                links = await pg.evaluate("[...document.querySelectorAll('[data-char-link]')].map(a=>a.dataset.charLink)")
                other = [l for l in links if l != cid][0]
                await pg.click(f'[data-char-link="{other}"]'); await pg.wait_for_timeout(500)
                chk(await pg.evaluate("document.getElementById('charName').textContent.length>0") and (await pg.evaluate("location.hash")).endswith(other), f"{cid}->{other}: character link navigation failed")
                await pg.click("#charClose"); await pg.wait_for_timeout(400)
                chk(not await pg.evaluate("document.getElementById('charView').open"), f"{cid}: Close did not close the dialog")
            # Rights page
            await pg.goto(BASE + "rights.html", wait_until="networkidle")
            chk(NOTICE in await pg.inner_text("body"), "rights.html: notice missing")
            chk(await pg.evaluate("document.documentElement.scrollWidth-innerWidth") <= 0, "rights.html overflow")
            if OUT: await pg.screenshot(path=f"{OUT}/{name}_rights.png", full_page=True)
            for e in sorted(set(errs)): fails.append(f"[{name}] {e}")
            await ctx.close()
        await b.close()
    if fails:
        print("FAILED:"); [print(" -", f) for f in fails]; sys.exit(1)
    print("characters/navigation/footer/logo QA passed at", ", ".join(v[0] for v in VPS))
asyncio.run(main())
