import sys, asyncio, os
from playwright.async_api import async_playwright
BASE="http://localhost:8765/staging/"
out=sys.argv[1]; os.makedirs(out,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=["--no-sandbox"])
        for name,w,h,dpr in [("m390",390,844,3),("land",844,390,2),("desk",1280,800,1)]:
            ctx=await b.new_context(viewport={"width":w,"height":h},device_scale_factor=dpr)
            pg=await ctx.new_page()
            await pg.goto(BASE+"#entity/rotor-bot",wait_until="networkidle"); await pg.wait_for_timeout(1000)
            picks=await pg.query_selector_all(".dossier__pick[data-hero]")
            print(name,"picks",len(picks))
            for i,pk in enumerate(picks):
                lab=await pk.get_attribute("data-hero-label")
                await pk.scroll_into_view_if_needed(); await pk.click(); await pg.wait_for_timeout(400)
                info=await pg.evaluate("""()=>{const i=document.querySelector('#entStage img');const r=i.getBoundingClientRect();return {nat:[i.naturalWidth,i.naturalHeight],css:[Math.round(r.width),Math.round(r.height)],src:i.currentSrc.split('/').pop().split('?')[0]}}""")
                scale=info['css'][0]*dpr/info['nat'][0]
                print(f"  {lab:14s} {info['src']:28s} nat={info['nat']} shown={info['css']}css px  device-px/native={scale:.2f}")
                st=await pg.query_selector("#entStage"); await st.scroll_into_view_if_needed()
                await st.screenshot(path=f"{out}/{name}_{i:02d}_{lab.replace(' ','_').replace('/','-').replace('¾','3q')}.png")
            await ctx.close()
        await b.close()
asyncio.run(main())
