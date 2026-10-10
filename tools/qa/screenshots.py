import sys, asyncio
from playwright.async_api import async_playwright
BASE="http://localhost:8765/staging/"
VPS={"m360":(360,740),"m390":(390,844),"land":(844,390),"tab":(768,1024),"desk":(1280,800)}
out=sys.argv[1]
import os; os.makedirs(out,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=["--no-sandbox"])
        for name,(w,h) in VPS.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},device_scale_factor=2 if w<500 else 1)
            pg=await ctx.new_page()
            errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e)))
            pg.on("requestfailed",lambda r:errs.append("FAIL "+r.url))
            await pg.goto(BASE,wait_until="networkidle")
            await pg.wait_for_timeout(800)
            # foes
            el=await pg.query_selector("#foes")
            await el.scroll_into_view_if_needed()
            for ev in range(0,0): pass
            await pg.wait_for_timeout(500)
            await el.screenshot(path=f"{out}/{name}_foes.png")
            f=await pg.query_selector("footer.site-foot")
            await f.scroll_into_view_if_needed(); await pg.wait_for_timeout(500)
            await f.screenshot(path=f"{out}/{name}_footer.png")
            hb=await pg.query_selector("header.topbar")
            await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(300)
            await hb.screenshot(path=f"{out}/{name}_header.png")
            for ent in ["brightback","rotor-bot"]:
                await pg.goto(BASE+"#entity/"+ent); await pg.wait_for_timeout(1200)
                d=await pg.query_selector("#entDialog, dialog[open]")
                await pg.screenshot(path=f"{out}/{name}_{ent}.png")
                if ent=="brightback" or ent=="rolling-boulder":
                    pass
            await pg.goto(BASE+"#entity/rolling-boulder"); await pg.wait_for_timeout(1200)
            evo=await pg.query_selector("#entEvo")
            if evo:
                await evo.scroll_into_view_if_needed(); await pg.wait_for_timeout(400)
                await evo.screenshot(path=f"{out}/{name}_evo_seq.png")
                for t in ["mech","scene"]:
                    await pg.click(f'[data-evo-tab="{t}"]'); await pg.wait_for_timeout(500)
                    await evo.screenshot(path=f"{out}/{name}_evo_{t}.png")
            print(name,errs[:5])
            await ctx.close()
        await b.close()
asyncio.run(main())
