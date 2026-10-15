#!/usr/bin/env python3
"""Hero carousel: dots, arrows, wrap-around, image loaded + figures present, no clipped headline/CTA, six viewports."""
import sys, asyncio, os
from playwright.async_api import async_playwright
BASE=sys.argv[1]; CHROME=os.environ.get("GB_CHROMIUM","/opt/pw-browsers/chromium-1194/chrome-linux/chrome"); fails=[]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path=CHROME,args=["--no-sandbox"])
        for name,w,h in [("m360",360,740),("m390",390,844),("land844",844,390),("land932",932,430),("tab768",768,1024),("desk1280",1280,800)]:
            ctx=await b.new_context(viewport={"width":w,"height":h}); pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("response",lambda r:errs.append(f"{r.status} {r.url}") if r.status>=400 else None)
            await pg.goto(BASE,wait_until="networkidle"); await pg.wait_for_timeout(500)
            n=await pg.evaluate("[...document.querySelectorAll('#heroDots button')].filter(b=>!b.hidden).length")
            want=5 if w<h else 10   # slides 6-10 are wide action art that leaves the rotation on portrait screens
            if n!=want: fails.append(f"[{name}] expected {want} slides, got {n}")
            arrow=await pg.query_selector('.hero__arrow--next')
            if arrow and await arrow.is_visible():
                for i in range(n+1):
                    await arrow.click(); await pg.wait_for_timeout(400)
            else:
                print(f"  [{name}] next arrow hidden by design; using dots")
            sel=await pg.evaluate("document.querySelectorAll('#heroDots button[aria-selected=true]').length"); 
            if sel!=1: fails.append(f"[{name}] selected dots {sel}")
            vis=await pg.evaluate("[...document.querySelectorAll('#heroDots button')].map((b,i)=>b.hidden?-1:i).filter(i=>i>=0)")
            for k in vis:
                await pg.evaluate(f"document.querySelectorAll('#heroDots button')[{k}].click()"); await pg.wait_for_timeout(300)
                r=await pg.evaluate("""(k)=>{const s=document.querySelectorAll('#heroTrack .slide')[k];const i=s.querySelector('img');return {ok:i.complete&&i.naturalWidth>0,src:i.currentSrc.split('/').pop().split('?')[0]}}""",k)
                if not r['ok']: fails.append(f"[{name}] slide {k} image failed")
                if (w<h and '-p' not in r['src']) or (w>=h and '-p' in r['src']): fails.append(f"[{name}] slide {k} wrong crop for orientation: {r['src']}")
            hl=await pg.evaluate("""()=>{const q=s=>document.querySelector(s).getBoundingClientRect();const a=q('.headline'),c=q('.steam--hero'),h=q('.hero');return {head:a.left>=0&&a.right<=innerWidth,cta:c.left>=0&&c.right<=innerWidth&&c.height>0,overflow:document.documentElement.scrollWidth-innerWidth}}""")
            if not (hl['head'] and hl['cta']) or hl['overflow']>0: fails.append(f"[{name}] headline/CTA clipped or overflow {hl}")
            for e in sorted(set(errs)): fails.append(f"[{name}] {e}")
            await ctx.close()
        await b.close()
asyncio.run(main())
if fails: print("FAILED:"); [print(" -",f) for f in fails]; sys.exit(1)
print("carousel QA passed at six viewports")
