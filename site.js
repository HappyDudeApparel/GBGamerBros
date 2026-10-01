const CONFIG={steamWishlistUrl:""};

const AREAS={
  portal:{
    name:"PORTAL MEADOW™",sub:"The adventure begins",accent:"#24a666",pos:"14% 78%",
    cardPos:"8% 75%",gallery:[
      {size:"245% auto",pos:"9% 78%",caption:"Portal Meadow approach",text:"A lower-world approach where the first portal, paths and collectibles establish the route into Adventure Mountain™."},
      {size:"300% auto",pos:"15% 70%",caption:"Meadow route detail",text:"Closer terrain reveals branching paths, elevation changes and the first fast-travel landmark."},
      {size:"220% auto",pos:"22% 62%",caption:"Looking toward Creek Crossing™",text:"The world opens upward from the meadow toward bridges, rapids and the higher route network."}
    ],
    chips:["Portal","Collectibles","Main Route"]
  },
  creek:{
    name:"CREEK CROSSING™",sub:"Bridges & Rapids",accent:"#168ae7",pos:"35% 61%",
    cardPos:"33% 63%",gallery:[
      {size:"285% auto",pos:"35% 62%",caption:"Bridge approach",text:"A close world view centered on bridges, flowing water and connected paths."},
      {size:"330% auto",pos:"42% 68%",caption:"Rapids below",text:"The route tightens around water, bridge supports and elevation changes."},
      {size:"255% auto",pos:"38% 49%",caption:"Higher route",text:"Looking upward reveals the next climb and connected routes deeper into Adventure Mountain™."}
    ],
    chips:["Bridges","Rapids","Alternate Route"]
  },
  riverworks:{
    name:"RIVERWORKS™",sub:"Waterfalls & Pipeways",accent:"#b86d24",pos:"64% 63%",
    cardPos:"69% 70%",gallery:[
      {size:"300% auto",pos:"68% 67%",caption:"Pipeway floor",text:"Industrial pipework, timber structures and waterfalls create a denser traversal zone."},
      {size:"350% auto",pos:"74% 72%",caption:"Lower pipe route",text:"The route moves around large pipe assemblies with collectibles drawing players forward."},
      {size:"275% auto",pos:"63% 54%",caption:"Riverworks overlook",text:"From higher ground, the lower waterfalls and connected structures remain visible below."}
    ],
    chips:["Pipeways","Waterfalls","Enemy Route"]
  },
  clover:{
    name:"CLOVER CLIFFS™",sub:"Forest Trails",accent:"#2ca05c",pos:"27% 33%",
    cardPos:"21% 28%",gallery:[
      {size:"280% auto",pos:"23% 30%",caption:"Forest trail",text:"Grass ledges, trees and cliff routes shift the visual rhythm away from the lower waterways."},
      {size:"330% auto",pos:"18% 37%",caption:"Cliffside path",text:"A closer view emphasizes narrow paths, vertical terrain and optional exploration space."},
      {size:"245% auto",pos:"30% 23%",caption:"Higher cliffs",text:"The route looks back across earlier areas while pointing toward the upper world."}
    ],
    chips:["Forest Trail","Cliffs","Secret Route"]
  },
  ruin:{
    name:"RUIN COURTYARD™",sub:"Forgotten Towers",accent:"#db253f",pos:"65% 41%",
    cardPos:"64% 39%",gallery:[
      {size:"300% auto",pos:"66% 42%",caption:"Courtyard entrance",text:"Ancient stonework, towers and broken arches create a more enclosed exploration space."},
      {size:"350% auto",pos:"62% 47%",caption:"Inside the ruins",text:"Closer framing reveals layered paths, enemy spaces and collectible lines through the structures."},
      {size:"260% auto",pos:"73% 36%",caption:"Tower route",text:"Higher paths reconnect the courtyard to the wider mountain network."}
    ],
    chips:["Ancient Ruins","Enemy Encounter","Upper Route"]
  },
  prism:{
    name:"PRISM RIDGE™",sub:"Crystal Peaks & Ancient Ruins",accent:"#8b34da",pos:"55% 22%",
    cardPos:"55% 15%",gallery:[
      {size:"255% auto",pos:"55% 20%",caption:"Crystal approach",text:"The upper world is marked by large crystal forms, vertical waterfalls and the portal crown."},
      {size:"320% auto",pos:"59% 17%",caption:"Prism route",text:"Closer framing places crystals, ruins and the portal network into a denser end-route composition."},
      {size:"220% auto",pos:"50% 11%",caption:"Final ascent",text:"A wider view shows the height gained across Adventure Mountain™ and the routes below."}
    ],
    chips:["Crystals","Portal","High Route"]
  },
  frost:{
    name:"FROST PEAKS™",sub:"Icy Cliffs & Granite Roads",accent:"#277dc9",pos:"87% 29%",
    cardPos:"88% 28%",gallery:[
      {size:"285% auto",pos:"88% 27%",caption:"Frost Peaks approach",text:"A colder high-altitude region extends the world beyond the main green valley."},
      {size:"340% auto",pos:"92% 34%",caption:"Icy route",text:"Snow, stone and portal structures create a distinct traversal identity."},
      {size:"245% auto",pos:"82% 21%",caption:"High-world overlook",text:"From the upper route, the core Adventure Mountain™ valley remains visible in the distance."}
    ],
    chips:["Icy Cliffs","Portal","High World"]
  }
};

const AREA_ORDER=["portal","creek","riverworks","clover","ruin","prism","frost"];

// HERO
const track=document.querySelector("#heroTrack");
const heroSlides=[...track.children];
const heroDotsWrap=document.querySelector("#heroDots");
let heroIndex=0,heroTimer=null,heroTouch=null;
heroSlides.forEach((_,n)=>{
  const b=document.createElement("button");b.type="button";b.setAttribute("aria-label",`Show hero image ${n+1}`);
  b.addEventListener("click",()=>heroGo(n,true));heroDotsWrap.appendChild(b);
});
const heroDots=[...heroDotsWrap.children];
function heroRender(){track.style.transform=`translateX(-${heroIndex*100}%)`;heroDots.forEach((d,n)=>d.classList.toggle("active",n===heroIndex));}
function heroGo(n,reset=false){heroIndex=(n+heroSlides.length)%heroSlides.length;heroRender();if(reset)heroStart();}
function heroStart(){clearInterval(heroTimer);heroTimer=setInterval(()=>heroGo(heroIndex+1),14000);}
document.querySelector(".hero-arrow.prev").addEventListener("click",()=>heroGo(heroIndex-1,true));
document.querySelector(".hero-arrow.next").addEventListener("click",()=>heroGo(heroIndex+1,true));
document.querySelector(".hero").addEventListener("touchstart",e=>heroTouch=e.touches[0].clientX,{passive:true});
document.querySelector(".hero").addEventListener("touchend",e=>{if(heroTouch===null)return;const dx=e.changedTouches[0].clientX-heroTouch;if(Math.abs(dx)>45)heroGo(heroIndex+(dx<0?1:-1),true);heroTouch=null},{passive:true});
heroRender();heroStart();

// NAV + SCROLL
const topbar=document.querySelector("#topbar");
window.addEventListener("scroll",()=>topbar.classList.toggle("scrolled",window.scrollY>35),{passive:true});
document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));

// STEAM PLACEHOLDER — no false store claim
document.querySelectorAll(".js-steam").forEach(b=>b.addEventListener("click",()=>{
  if(CONFIG.steamWishlistUrl) window.open(CONFIG.steamWishlistUrl,"_blank","noopener");
  else openInfo("STEAM","WISHLIST PAGE NOT LIVE YET","The Steam store page has not been connected yet. This button is ready to become the real wishlist link when the store listing is available.");
}));

// AREA RAIL
const rail=document.querySelector("#areaRail");
AREA_ORDER.forEach(key=>{
  const a=AREAS[key];
  const card=document.createElement("button");
  card.type="button";card.className="area-card";card.dataset.openArea=key;card.style.setProperty("--card-accent",a.accent);
  card.innerHTML=`<span class="area-accent"></span><span class="area-card-art" style="background-position:${a.cardPos}"></span><span class="area-card-copy"><b>${a.name}</b><small>${a.sub}</small></span>`;
  rail.appendChild(card);
});
document.querySelector(".rail-prev").addEventListener("click",()=>rail.scrollBy({left:-Math.min(500,rail.clientWidth*.8),behavior:"smooth"}));
document.querySelector(".rail-next").addEventListener("click",()=>rail.scrollBy({left:Math.min(500,rail.clientWidth*.8),behavior:"smooth"}));

// WORLD DIALOG
const worldDialog=document.querySelector("#worldDialog");
const dialogTitle=document.querySelector("#dialogTitle");
const dialogSub=document.querySelector("#dialogSub");
const galleryStage=document.querySelector("#galleryStage");
const galleryDots=document.querySelector("#galleryDots");
const dialogCaption=document.querySelector("#dialogCaption");
const dialogText=document.querySelector("#dialogText");
const detailChips=document.querySelector("#detailChips");
let currentArea="portal",galleryIndex=0;

function openArea(key){
  currentArea=AREAS[key]?key:"portal";galleryIndex=0;
  const a=AREAS[currentArea];
  dialogTitle.textContent=a.name;dialogSub.textContent=a.sub;
  detailChips.innerHTML="";
  a.chips.forEach(ch=>{
    const b=document.createElement("button");b.type="button";b.textContent=ch;
    b.addEventListener("click",()=>openInfo(a.name,ch,`${ch} is part of the current ${a.name} concept. The interactive site structure is ready for the final gameplay-specific description as the level is locked.`));
    detailChips.appendChild(b);
  });
  buildGalleryDots();renderGallery();
  if(!worldDialog.open) worldDialog.showModal();
}
function buildGalleryDots(){
  galleryDots.innerHTML="";
  AREAS[currentArea].gallery.forEach((_,n)=>{
    const b=document.createElement("button");b.type="button";b.setAttribute("aria-label",`Location view ${n+1}`);
    b.addEventListener("click",()=>{galleryIndex=n;renderGallery()});galleryDots.appendChild(b);
  });
}
function renderGallery(){
  const g=AREAS[currentArea].gallery[galleryIndex];
  galleryStage.style.backgroundSize=g.size;galleryStage.style.backgroundPosition=g.pos;
  dialogCaption.textContent=g.caption;dialogText.textContent=g.text;
  [...galleryDots.children].forEach((d,n)=>d.classList.toggle("active",n===galleryIndex));
}
function galleryMove(delta){
  const total=AREAS[currentArea].gallery.length;galleryIndex=(galleryIndex+delta+total)%total;renderGallery();
}
document.querySelector(".gallery-prev").addEventListener("click",()=>galleryMove(-1));
document.querySelector(".gallery-next").addEventListener("click",()=>galleryMove(1));
document.querySelector("#dialogClose").addEventListener("click",()=>worldDialog.close());
worldDialog.addEventListener("click",e=>{if(e.target===worldDialog)worldDialog.close()});
document.addEventListener("click",e=>{
  const trigger=e.target.closest("[data-open-area]");if(trigger)openArea(trigger.dataset.openArea);
});

// FEATURE / PILLAR INFO
const infoDialog=document.querySelector("#infoDialog");
const infoKicker=document.querySelector("#infoKicker");
const infoTitle=document.querySelector("#infoTitle");
const infoText=document.querySelector("#infoText");
function openInfo(kicker,title,text){
  infoKicker.textContent=kicker;infoTitle.textContent=title;infoText.textContent=text;
  if(!infoDialog.open)infoDialog.showModal();
}
document.querySelector("#infoClose").addEventListener("click",()=>infoDialog.close());
infoDialog.addEventListener("click",e=>{if(e.target===infoDialog)infoDialog.close()});

const info={
  portals:["ADVENTURE MOUNTAIN™","FIND PORTALS™","Fast-travel portals are positioned around the world concept to connect distant areas. The final network will be locked alongside the Unreal Engine level layout."],
  rewards:["ADVENTURE MOUNTAIN™","COLLECT REWARDS™","Collectibles, gems and reward objects help draw players through main routes, optional paths and hidden spaces."],
  secrets:["ADVENTURE MOUNTAIN™","UNCOVER SECRETS™","Optional paths and hidden areas are part of the exploration structure. Their exact rewards will be finalized with gameplay."],
  traversal:["ADVENTURE MOUNTAIN™","MASTER TRAVERSAL™","Movement is built around elevation, bridges, pipes, jumps, ruins, water routes and alternate paths."],
  coop:["GB GAMER BROS™","PLAY TOGETHER™","Two-player play is a development goal, not a confirmed launch feature. The site will only advertise co-op as a released feature once it is implemented."],
  level:["GAMEPLAY","LEVEL PREVIEW™","The level preview area is now interactive and ready for real gameplay footage, screenshots or a trailer when those assets are available."],
  travel:["GAMEPLAY","FAST TRAVEL™","The portal system is designed as a world-navigation layer. Portal locations can be updated as the Unreal Engine map is finalized."],
  hazards:["GAMEPLAY","BAD GUYS & HAZARDS™","Enemy and hazard concepts include patrol enemies, moving obstacles and environmental hazards. Final behaviors remain tied to gameplay implementation."]
};
document.querySelectorAll("[data-detail]").forEach(el=>el.addEventListener("click",e=>{
  if(e.target.closest("button")&&e.currentTarget!==e.target.closest("button")&&e.currentTarget.classList.contains("feature-card")) return;
  const d=info[el.dataset.detail];if(d)openInfo(...d);
}));
document.querySelectorAll(".feature-card button").forEach(b=>b.addEventListener("click",e=>{
  e.stopPropagation();const d=info[b.closest(".feature-card").dataset.detail];if(d)openInfo(...d);
}));

// CHARACTER INFO
const characters={
  blue:["BLUE™","GAMER BRO BLUE™","Blue character art and branding are locked into the current GB GAMER BROS™ visual system. This character panel is ready for the final bio and gameplay role."],
  red:["RED™","GAMER BRO RED™","Red character art and branding are locked into the current GB GAMER BROS™ visual system. This character panel is ready for the final bio and gameplay role."],
  purple:["PURPLE™","GAMER GIRL PURPLE™","Purple is part of the four-character GB GAMER BROS™ presentation. This panel is ready for the approved action art, bio and gameplay role."],
  yellow:["YELLOW™","GAMER GIRL YELLOW™","Yellow is part of the four-character GB GAMER BROS™ presentation. This panel is ready for the approved action art, bio and gameplay role."]
};
document.querySelectorAll("[data-character]").forEach(b=>b.addEventListener("click",()=>openInfo(...characters[b.dataset.character])));

// KEYBOARD
document.addEventListener("keydown",e=>{
  if(worldDialog.open){if(e.key==="ArrowLeft")galleryMove(-1);if(e.key==="ArrowRight")galleryMove(1);}
});
