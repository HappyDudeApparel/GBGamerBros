const dialog=document.querySelector("#infoDialog");
const title=document.querySelector("#dialogTitle");
const text=document.querySelector("#dialogText");

function openInfo(t,body){
  title.textContent=t;
  text.textContent=body;
  if(!dialog.open) dialog.showModal();
}
document.querySelector(".close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});

document.querySelectorAll(".js-steam").forEach(b=>b.addEventListener("click",()=>openInfo(
  "STEAM PAGE NOT LIVE YET",
  "The wishlist treatment is positioned to match the approved concept, but it will not link anywhere until the real Steam store page exists."
)));

document.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.jump)?.scrollIntoView({behavior:"smooth"})));

document.querySelectorAll(".map-hotspot").forEach(b=>b.addEventListener("click",()=>openInfo(
  b.dataset.area,
  "This location will open its dedicated image gallery and interactive area view in the next pass."
)));

document.querySelectorAll(".hero-arrow").forEach(b=>b.addEventListener("click",()=>openInfo(
  "HERO CAROUSEL",
  "Only the approved character-action hero is populated in Pass 1. Additional carousel images will be added only after their assets are approved."
)));
