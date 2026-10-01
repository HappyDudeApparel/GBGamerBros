const scenes=[...document.querySelectorAll(".scene")];
const dots=document.querySelector("#heroDots");
let idx=0,timer;
scenes.forEach((_,i)=>{const b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show hero image "+(i+1));b.addEventListener("click",()=>go(i,true));dots.appendChild(b)});
const dotEls=[...dots.children];
function render(){scenes.forEach((s,i)=>s.classList.toggle("active",i===idx));dotEls.forEach((d,i)=>d.classList.toggle("active",i===idx))}
function go(n,reset=false){idx=(n+scenes.length)%scenes.length;render();if(reset)start()}
function start(){clearInterval(timer);timer=setInterval(()=>go(idx+1),15000)}
document.querySelector(".hero-arrow.prev").addEventListener("click",()=>go(idx-1,true));
document.querySelector(".hero-arrow.next").addEventListener("click",()=>go(idx+1,true));
let touchX=null;document.querySelector(".hero").addEventListener("touchstart",e=>touchX=e.touches[0].clientX,{passive:true});
document.querySelector(".hero").addEventListener("touchend",e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)go(idx+(dx<0?1:-1),true);touchX=null},{passive:true});
render();start();

const dlg=document.querySelector("#steamDialog");
document.querySelectorAll(".wishlist").forEach(b=>b.addEventListener("click",()=>dlg.showModal()));
document.querySelector(".dialog-close").addEventListener("click",()=>dlg.close());
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
document.querySelector(".map-cta").addEventListener("click",()=>document.querySelector("#world").scrollIntoView({behavior:"smooth"}));
