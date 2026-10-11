import sys, asyncio, json
from playwright.async_api import async_playwright
BASE=sys.argv[1]
VPS=[("mobile-portrait-360",360,740,3),("mobile-portrait-390",390,844,3),("mobile-landscape-844x390",844,390,2),("mobile-landscape-932x430",932,430,2),("tablet-768",768,1024,2),("desktop-1280",1280,800,1)]
async def main():
    res=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=["--no-sandbox"])
        for name,w,h,dpr in VPS:
            ctx=await b.new_context(viewport={"width":w,"height":h},device_scale_factor=dpr)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append("pageerror "+str(e)))
            pg.on("console",lambda m:errs.append("console."+m.type+" "+m.text) if m.type=="error" else None)
            pg.on("requestfailed",lambda r:errs.append("reqfail "+r.url))
            pg.on("response",lambda r:errs.append(f"http{r.status} {r.url}") if r.status>=400 else None)
            await pg.goto(BASE,wait_until="networkidle"); await pg.wait_for_timeout(500)
            ids=await pg.evaluate("[...document.querySelectorAll('#foes [data-entity], #objs [data-entity]')].map(e=>e.dataset.entity)")
            r={"vp":name,"entities":len(ids),"overflowX":None,"brokenImgs":[],"footer":None,"clicked":0}
            r["overflowX"]=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
            r["footer"]=await pg.evaluate("document.querySelector('.site-foot__legal').textContent")
            for ent in dict.fromkeys(ids):
                await pg.goto(BASE+"#entity/"+ent); await pg.wait_for_timeout(350)
                # open evolution tabs when present
                for t in ["mech","scene","seq"]:
                    btn=await pg.query_selector(f'[data-evo-tab="{t}"]')
                    if btn: await btn.click(); await pg.wait_for_timeout(120)
                picks=await pg.query_selector_all(".dossier__pick[data-hero]")
                for pk in picks:
                    await pk.click(); await pg.wait_for_timeout(60)
                bad=await pg.evaluate("[...document.querySelectorAll('#entityView img')].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent!==null).map(i=>i.src)")
                if bad: r["brokenImgs"]+= [ent+": "+x for x in bad]
                r["clicked"]+=1
            await pg.goto(BASE+"#entity/rolling-boulder"); await pg.wait_for_timeout(300)
            r["errors"]=sorted(set(errs))[:8]
            res.append(r); await ctx.close()
        await b.close()
    for r in res: print(json.dumps(r,ensure_ascii=False))
asyncio.run(main())
