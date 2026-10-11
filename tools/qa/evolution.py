import sys, asyncio, os
from playwright.async_api import async_playwright
BASE="http://localhost:8765/staging/"
out=sys.argv[1]; os.makedirs(out,exist_ok=True)
vps=[("land",844,390),("land2",932,430),("m390",390,844),("tab",768,1024),("desk",1280,800)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=["--no-sandbox"])
        for name,w,h in vps:
            ctx=await b.new_context(viewport={"width":w,"height":h})
            pg=await ctx.new_page()
            await pg.goto(BASE+"#entity/rolling-boulder",wait_until="networkidle"); await pg.wait_for_timeout(1200)
            # find scroll container
            info=await pg.evaluate("""()=>{const e=document.getElementById('entEvo');let n=e.parentElement;const chain=[];while(n){const cs=getComputedStyle(n);if(/(auto|scroll)/.test(cs.overflowY))chain.push(n.tagName+'#'+n.id+'.'+n.className);n=n.parentElement}return chain}""")
            print(name,info)
            for i,t in enumerate(["seq","scene"]):
                await pg.evaluate("document.getElementById('entEvo').scrollIntoView({block:'start'})")
                await pg.click(f'[data-evo-tab="{t}"]'); await pg.wait_for_timeout(500)
                await pg.screenshot(path=f"{out}/{name}_evo_{t}.png")
            await ctx.close()
        await b.close()
asyncio.run(main())
