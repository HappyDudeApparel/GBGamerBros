// GB GAMER BROS™ — Adventure Mountain™ site
(() => {
  "use strict";

  // Set this once a real Steam store page exists; until then the buttons explain "coming soon".
  const STEAM_URL = "";

  const toast = document.getElementById("steamNote");
  let toastTimer = null;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2600);
  }

  document.querySelectorAll(".js-steam").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (STEAM_URL) window.open(STEAM_URL, "_blank", "noopener");
      else showToast("Steam store page coming soon.");
    });
  });

  // ---------- menu (compact header) ----------
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // ---------- hero carousel ----------
  const slidesWrap = document.getElementById("heroSlides");
  const track = document.getElementById("heroTrack");
  const slides = [...track.children];
  const fgLayers = [...document.querySelectorAll(".hero__fg .fg")];
  const dotsWrap = document.getElementById("heroDots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 8500; // slow, deliberate rotation
  let index = 0;
  let timer = null;

  const dots = slides.map((_, n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => { go(Math.max(0, live().indexOf(slides[n]))); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });
  // slides marked data-skip="phone-portrait" leave the rotation on phone portrait screens
  // (slide 3: Gamer Girl Yellow™ would sit behind the fixed Adventure Mountain™ sign there)
  const phonePortrait = window.matchMedia("(max-width: 599px) and (max-aspect-ratio: 1/1)");
  const live = () => slides.filter((s) => !(s.dataset.skip === "phone-portrait" && phonePortrait.matches));
  function syncSlides() {
    const L = live();
    slides.forEach((s, i) => {
      const on = L.includes(s);
      s.hidden = !on;
      dots[i].hidden = !on;
    });
    L.forEach((s, n) => {
      s.setAttribute("aria-label", `Slide ${n + 1} of ${L.length}`);
      dots[slides.indexOf(s)].setAttribute("aria-label", `Show slide ${n + 1} of ${L.length}`);
    });
  }

  function go(n) {
    const L = live();
    index = (n + L.length) % L.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    const cur = L[index];
    slides.forEach((s) => s.setAttribute("aria-hidden", String(s !== cur)));
    dots.forEach((d, i) => d.setAttribute("aria-selected", String(slides[i] === cur)));
    fgLayers.forEach((f) => f.classList.toggle("is-active", slides[Number(f.dataset.slide)] === cur));
  }
  phonePortrait.addEventListener("change", () => { syncSlides(); go(0); });
  syncSlides();
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go(index + 1), INTERVAL);
  }
  function pause() { clearInterval(timer); }

  document.querySelectorAll(".hero__arrow").forEach((b) =>
    b.addEventListener("click", () => { go(index + Number(b.dataset.dir)); restart(); })
  );

  const hero = document.querySelector(".hero");
  hero.addEventListener("mouseenter", pause);
  hero.addEventListener("mouseleave", restart);
  hero.addEventListener("focusin", pause);
  hero.addEventListener("focusout", restart);
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { go(index - 1); }
    if (e.key === "ArrowRight") { go(index + 1); }
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : restart()));

  // swipe (touch + pen + mouse drag) on the image area
  let start = null;
  hero.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    start = { x: e.clientX, y: e.clientY };
  });
  hero.addEventListener("pointerup", (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) { go(index + (dx < 0 ? 1 : -1)); restart(); }
  });
  hero.addEventListener("pointercancel", () => (start = null));
  slidesWrap.addEventListener("dragstart", (e) => e.preventDefault());

  go(0);
  restart();

  // ---------- world map (world.js) ----------
  // Fallback mode now (current front map); panorama mode switches on by itself once
  // panorama-manifest.js carries a manifest. Region data lives in world-data.js.
  const world = document.getElementById("world");
  const viewer = window.GBWorld.create(world, { panorama: window.GB_PANORAMA });
  const portraitMap = window.matchMedia("(max-aspect-ratio: 1/1)");
  // portrait fallback opens zoomed on a framing where every visible baked label is whole
  // (Prism Ridge™, Fallen Grounds™, Riverworks™, Frosty Peaks™); "Whole map" shows all seven
  const FALLBACK_ZOOM = 2, MAP_START = 0.5;
  function setZoomed(on, fx) {
    world.classList.toggle("is-zoomed", on);
    viewer.setZoom(on ? FALLBACK_ZOOM : 1, fx);
  }
  if (viewer.mode === "fallback") {
    const fit = () => setZoomed(portraitMap.matches, MAP_START);
    portraitMap.addEventListener("change", fit);
    fit();
    document.getElementById("mapExpand").addEventListener("click", () => setZoomed(true, MAP_START));
    document.getElementById("mapOverview").addEventListener("click", () => setZoomed(false));
    document.getElementById("mapScroller").addEventListener("click", (e) => {
      if (!portraitMap.matches || world.classList.contains("is-zoomed")) return;
      const r = e.currentTarget.getBoundingClientRect();
      setZoomed(true, (e.clientX - r.left) / r.width);
    });
  }

  // ---------- area views (Pass B) ----------
  // Routes: #area/<id> and #area/<id>/<view number>. Browser Back closes the view.
  const AREAS = window.GB_AREAS || {};
  const dlg = document.getElementById("areaView");
  const aTrack = document.getElementById("areaTrack");
  const aDots = document.getElementById("areaDots");
  const aPrev = document.getElementById("areaPrev");
  const aNext = document.getElementById("areaNext");
  const aBg = document.getElementById("areaBg");
  const aTitle = document.getElementById("areaTitle");
  const aSub = document.getElementById("areaSub");
  const aCount = document.getElementById("areaCount");
  const aLabel = document.getElementById("areaLabel");
  const MEDIA = window.GB_MEDIA || {};
  // shared media frame: content aspect (--ar) and the stretch needed to push the
  // copyright band below the frame (--ext), valid for both derivative sizes
  const frameVars = (src) => {
    const m = MEDIA[src];
    if (!m) return "--ar:1.7778;--ext:1";
    const ext = Math.max((m.h + m.band) / m.h, (m.sh + m.sband) / m.sh);
    return `--ar:${(m.w / m.h).toFixed(5)};--ext:${ext.toFixed(5)}`;
  };
  // every image URL carries the file's content revision so replacements are never served stale
  const asset = (src, small) => {
    const m = MEDIA[src] || {};
    const rev = small ? m.srev : m.rev;
    return `${src}${small ? "-960" : ""}.webp${rev ? `?v=${rev}` : ""}`;
  };
  // srcset from the real derivative widths (images differ in size; never hard-code them)
  const srcset = (src) => { const m = MEDIA[src] || {}; return m.sw && m.sw < m.w ? `${asset(src, true)} ${m.sw}w, ${asset(src)} ${m.w}w` : `${asset(src)} ${m.w || 1600}w`; };
  const isOpen = (id) => AREAS[id] && AREAS[id].status === "open" && AREAS[id].views.length > 0;
  const KIND = { establishing: "Overview", ground: "Ground level", traversal: "Route", landmark: "Landmark", closeup: "Close view", still: "Preview still" };
  let current = null;      // area id
  let viewIndex = 0;
  let openedFrom = null;   // element to return focus to
  let pushedHere = false;  // whether this session pushed the area entry (so Back/close can pop it)

  const ENTITIES = window.GB_ENTITIES || {};
  const CHARS = window.GB_CHARACTERS || {};
  // routes: #area/<id>[/<n>],  #entity/<id>  and  #character/<id>[/sporty|streetwear]
  const parseHash = () => {
    let m = location.hash.match(/^#area\/([a-z-]+)(?:\/(\d+))?$/);
    if (m) return { id: m[1], view: m[2] ? Number(m[2]) - 1 : 0 };
    m = location.hash.match(/^#character\/([a-z]+)(?:\/(sporty|streetwear))?$/);
    if (m) return CHARS[m[1]] ? { character: m[1], look: m[2] || null } : null;
    m = location.hash.match(/^#entity\/([a-z0-9-]+)$/);
    if (!m) return null;
    const canon = (window.GB_ENTITY_ALIASES || {})[m[1]];
    if (canon) history.replaceState(history.state, "", `#entity/${canon}`);   // legacy link → canonical
    return { entity: canon || m[1] };
  };

  function buildHotspots(view) {
    // Pass E: each hotspot is a % box over the content image and points at a canonical entity ID
    return (view.hotspots || []).filter((h) => ENTITIES[h.ref]).map((h) =>
      `<button type="button" data-ref="${h.ref}" aria-label="${h.label || ENTITIES[h.ref].name}"
         style="--x:${h.x};--y:${h.y};--w:${h.w};--h:${h.h}"></button>`).join("");
  }

  function render(id) {
    const area = AREAS[id];
    aTitle.textContent = area.name;
    aSub.textContent = area.sub;
    aTrack.innerHTML = area.views.map((v, i) => `
      <figure class="shot" data-index="${i}" aria-label="View ${i + 1} of ${area.views.length}: ${v.label}" style="--focus:${v.focus ?? 0.5};${frameVars(v.src)}">
        <div class="shot__frame">
          <div class="shot__stage gbm">
            <img src="${asset(v.src)}" srcset="${srcset(v.src)}"
                 sizes="(max-aspect-ratio: 1/1) 180vh, 92vw" alt="${v.alt}" width="${(MEDIA[v.src] || {}).w || 1672}" height="${(MEDIA[v.src] || {}).h || 941}"
                 ${i ? 'loading="lazy"' : 'fetchpriority="high"'} draggable="false">
            <div class="shot__hotspots" data-view="${i}">${buildHotspots(v)}</div>
          </div>
        </div>
      </figure>`).join("");
    aDots.innerHTML = "";
    area.views.forEach((v, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `View ${i + 1}: ${v.label}`);
      b.addEventListener("click", () => goView(i));
      aDots.appendChild(b);
    });
  }

  function setView(i, fromScroll) {
    const area = AREAS[current];
    if (!area) return;            // view closed while a scroll update was pending
    viewIndex = Math.max(0, Math.min(area.views.length - 1, i));
    const v = area.views[viewIndex];
    aCount.textContent = `${viewIndex + 1} / ${area.views.length}`;
    aLabel.innerHTML = `<small>${KIND[v.kind] || ""}</small>${v.label}`;
    [...aDots.children].forEach((d, n) => d.setAttribute("aria-selected", String(n === viewIndex)));
    aPrev.disabled = viewIndex === 0;
    aNext.disabled = viewIndex === area.views.length - 1;
    aBg.innerHTML = `<div class="gbm" style="${frameVars(v.src)}"><img src="${asset(v.src, true)}" alt=""></div>`;
    const hash = `#area/${current}/${viewIndex + 1}`;
    if (location.hash !== hash) history.replaceState(history.state, "", hash);
    if (!fromScroll) aTrack.children[viewIndex].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  }
  const goView = (i) => setView(i, false);

  let scrollTimer = null;
  aTrack.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const i = Math.round(aTrack.scrollLeft / aTrack.clientWidth);
      if (i !== viewIndex) setView(i, true);
    }, 90);
  }, { passive: true });
  // portrait only: switch between the immersive crop and the whole frame
  const aFit = document.getElementById("areaFit");
  aFit.addEventListener("click", () => {
    const on = dlg.classList.toggle("is-fit");
    aFit.setAttribute("aria-pressed", String(on));
    aFit.textContent = on ? "Immersive view" : "Full view";
  });
  aPrev.addEventListener("click", () => goView(viewIndex - 1));
  aNext.addEventListener("click", () => goView(viewIndex + 1));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goView(viewIndex - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); goView(viewIndex + 1); }
  });
  // mouse drag-to-swipe for desktop (touch and trackpads scroll natively)
  let drag = null;
  aTrack.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.target.closest("button")) return;
    drag = { x: e.clientX, left: aTrack.scrollLeft };
    aTrack.style.scrollSnapType = "none"; aTrack.style.scrollBehavior = "auto";
  });
  window.addEventListener("pointermove", (e) => { if (drag) aTrack.scrollLeft = drag.left - (e.clientX - drag.x); });
  window.addEventListener("pointerup", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x; drag = null;
    aTrack.style.scrollSnapType = ""; aTrack.style.scrollBehavior = "";
    goView(viewIndex + (dx < -60 ? 1 : dx > 60 ? -1 : 0));
  });

  function openArea(id, view) {
    if (!isOpen(id)) return false;
    if (current !== id) { current = id; render(id); }
    if (!dlg.open) { dlg.showModal(); document.documentElement.classList.add("is-locked"); pause(); }
    // wait a frame so the track has its size before scrolling to the view
    requestAnimationFrame(() => {
      aTrack.style.scrollBehavior = "auto";
      aTrack.scrollLeft = aTrack.clientWidth * Math.max(0, Math.min(view, AREAS[id].views.length - 1));
      aTrack.style.scrollBehavior = "";
      setView(view, true);
    });
    return true;
  }
  function closeAreaUI() {
    clearTimeout(scrollTimer);
    if (dlg.open) dlg.close();
    document.documentElement.classList.remove("is-locked");
    current = null;
    restart();
    if (openedFrom) { openedFrom.focus({ preventScroll: true }); openedFrom = null; }
  }
  // user-initiated close: pop our history entry if we added it, otherwise go to the map
  function requestClose() {
    if (pushedHere) { pushedHere = false; history.back(); }
    else { history.replaceState(null, "", "#world"); closeAreaUI(); }
  }
  document.getElementById("areaBack").addEventListener("click", requestClose);
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); requestClose(); });

  // ---------- entity dossier (Pass C) ----------
  // One detail view for every canonical entity: Enemies & Hazards cards, Fast Travel,
  // and Pass E hotspots inside area images all open #entity/<id>.
  const eDlg = document.getElementById("entityView");
  const eBody = document.getElementById("entBody");
  const TYPE = { enemy: "Enemy", hazard: "Hazard", portal: "Portal", prop: "Adventure Find", collectible: "Adventure Find", gadget: "Gadget" };
  let entPushed = false;
  let entOpenedFrom = null;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const media = (src, cls, alt, size) => src && MEDIA[src]
    ? `<span class="gbm ${cls}" style="${frameVars(src)}"><img src="${asset(src, size === "small")}" alt="${esc(alt)}" loading="lazy" draggable="false"></span>`
    : `<span class="${cls} media-missing"><svg class="media-missing__icon" aria-hidden="true"><use href="#i-hazard"/></svg><span>Coming soon</span></span>`;

  // transparent cutout (character / enemy render) inside a sized stage; the band is clipped by .gbm
  const cut = (src, cls, alt, sizes, eager) => {
    const m = MEDIA[src];
    if (!m) return `<span class="${cls} media-missing"><svg class="media-missing__icon" aria-hidden="true"><use href="#i-hazard"/></svg><span>Coming soon</span></span>`;
    const set = m.sw < m.w ? ` srcset="${asset(src, true)} ${m.sw}w, ${asset(src)} ${m.w}w" sizes="${sizes || "50vw"}"` : "";
    return `<span class="gbm cutout ${cls}" style="${frameVars(src)}"><img src="${asset(src)}"${set} alt="${esc(alt)}"${eager ? "" : ' loading="lazy"'} draggable="false"></span>`;
  };
  const isCut = (src) => !!(MEDIA[src] && MEDIA[src].alpha);
  // in-game view (entities.js GB_ENTITY_SCENE): cover-fitted inside a fixed frame, band clipped
  // GB_ENTITY_SCENE[id] is one scene or a list; scenesOf → all valid, sceneOf → the first ("id" or "id:n")
  const scenesOf = (id) => [].concat((window.GB_ENTITY_SCENE || {})[id] || []).filter((s) => MEDIA[s.src]);
  const sceneOf = (ref) => { const [id, n] = String(ref).split(":"); return scenesOf(id)[Number(n) || 0] || null; };
  const sceneImg = (s, alt, small) => `<span class="gbm scene-fit" style="${frameVars(s.src)};--fx:${s.fx}%"><img src="${asset(s.src, small)}" alt="${esc(alt)}" loading="lazy" draggable="false"></span>`;

  // optional authored evolution line (e.g. Rolling Boulder → Stone Golem → Crystal Guardian)
  const evo = (e) => {
    const line = e.evolution && (window.GB_EVOLUTION || {})[e.evolution.line];
    if (!line) return "";
    const steps = line.map((id, i) => {
      const x = ENTITIES[id];
      const here = i + 1 === e.evolution.phase;
      return `<li${here ? ' aria-current="step"' : ""}>${here
        ? `<strong>${esc(x.name)}</strong>`
        : `<a href="#entity/${id}" data-entity-link="${id}">${esc(x.name)}</a>`}<small>Phase ${i + 1}</small></li>`;
    }).join("");
    const detail = (window.GB_EVOLUTION_DETAIL || {})[e.evolution.line];
    return `<h3>Evolution · phase ${e.evolution.phase} of ${line.length}</h3><ol class="dossier__evo">${steps}</ol>
      ${detail ? "" : `<p class="dossier__empty">${EVO_NOTE}</p>`}`;
  };
  const EVO_NOTE = "Evolution is optional and doesn't happen every time. When it happens is still being designed.";
  // full evolution component: cutout sequence, transformation mechanics, in-world steps (tabs; swipe rails on phones)
  const evoDetail = (e) => {
    const d = e.evolution && (window.GB_EVOLUTION_DETAIL || {})[e.evolution.line];
    if (!d) return "";
    const ph = e.evolution.phase;
    const PH = ["", "Phase 1", "Phase 2", "Phase 3"];
    const seq = d.sequence.map((x, i) => `<li class="evo__step${x.phase === ph ? " is-here" : ""}">
        <span class="stage-box">${cut(x.src, "evo__cut", x.label, "160px")}</span>
        <strong>${esc(x.label)}</strong><small>${PH[x.phase]}</small></li>`).join("");
    const mech = d.mechanics.map((x) => `<li>${media(x.src, "evo__mechimg", x.label, "small")}<strong>${esc(x.label)}</strong><p>${esc(x.text)}</p></li>`).join("");
    const scenes = d.scenes.map((x, i) => `<li${x.phase === ph ? ' class="is-here"' : ""}>${media(x.src, "evo__sceneimg", `${x.label}: ${x.note}`, "small")}<span class="evo__num">${i + 1}</span><strong>${esc(x.label)}</strong><p>${esc(x.note)}</p></li>`).join("");
    return `<section class="evo" id="entEvo" aria-labelledby="evoTitle">
      <header class="evo__head">
        <div><h3 id="evoTitle">How the evolution works</h3><p>Rumbler™ → Stone Walker™ → Prism Keeper™</p></div>
        <div class="evo__tabs" role="tablist" aria-label="Evolution views">
          <button type="button" role="tab" aria-selected="true" data-evo-tab="seq">Sequence</button>
          <button type="button" role="tab" aria-selected="false" data-evo-tab="mech">Mechanics</button>
          <button type="button" role="tab" aria-selected="false" data-evo-tab="scene">In the world</button>
        </div>
      </header>
      <div class="evo__panel" data-evo-panel="seq" role="tabpanel"><ol class="evo__seq">${seq}</ol></div>
      <div class="evo__panel" data-evo-panel="mech" role="tabpanel" hidden><ul class="evo__mech">${mech}</ul></div>
      <div class="evo__panel" data-evo-panel="scene" role="tabpanel" hidden><ol class="evo__scenes">${scenes}</ol></div>
      <p class="evo__note">${EVO_NOTE} The same mossy, segmented rock carries through every phase.</p>
    </section>`;
  };

  function renderEntity(id) {
    const e = ENTITIES[id];
    document.getElementById("entType").textContent = TYPE[e.type] || "";
    document.getElementById("entName").textContent = e.name;
    const hero = e.media.render || e.media.thumb;
    // production views / states: cutouts become selectable thumbnails that swap the hero
    const thumbs = (obj, what) => Object.entries(obj || {}).map(([k, v]) => v && isCut(v)
      ? `<li><button class="dossier__pick" type="button" data-hero="${v}" data-hero-label="${esc(k)}" aria-label="${esc(e.name)}: ${esc(k)}"><span class="stage-box">${cut(v, "dossier__thumbimg", "", "120px")}</span><small>${esc(k)}</small></button></li>`
      : v ? `<li>${media(v, "dossier__state", `${e.name} ${k}`)}<small>${esc(k[0].toUpperCase() + k.slice(1))}</small></li>` : "").join("");
    const views = thumbs(e.views);
    const states = thumbs(e.states);
    const stage = hero && isCut(hero);
    const enc = (e.encounter || []).filter((x) => AREAS[x.area] && AREAS[x.area].views[x.view - 1]).map((x) => {
      const a = AREAS[x.area], v = a.views[x.view - 1];
      return `<li><a href="#area/${x.area}/${x.view}" data-goto-area>${media(v.src, "dossier__enc", v.alt, "small")}
        <small>${esc(a.name)}</small></a></li>`;
    }).join("");
    const sc = sceneOf(id);
    eBody.innerHTML = `
      <div class="dossier__visual">${stage
        ? `<div class="dossier__stage${sc ? " is-scene" : ""}" id="entStage">${sc ? sceneImg(sc, `${e.name} in Adventure Mountain™`) : `<span class="stage-box">${cut(hero, "dossier__hero", e.name, "(min-width: 720px) 420px, 90vw", true)}</span>`}</div>
           <p class="dossier__caption"><b class="chip chip--inline">View</b> <span id="entStageLabel">${sc ? esc(sc.label || "In the world") : "Hero"}</span></p>`
        : media(hero, "dossier__render", e.name)}
        ${scenesOf(id).length > 1 ? `<h3>In the world</h3><ul class="dossier__picks">${scenesOf(id).map((s, i) => `<li><button class="dossier__pick dossier__pick--scene" type="button" data-scene="${id}:${i}" data-hero-label="${esc(s.label || "In the world")}" aria-label="${esc(e.name)}: ${esc(s.label || "in the world")}" aria-pressed="${!i}"><span class="stage-box">${sceneImg(s, "", true)}</span><small>${esc(s.label || "In the world")}</small></button></li>`).join("")}</ul>` : ""}
        ${states ? `<h3>${e.type === "portal" ? "Regional portals" : "Action states"}</h3><ul class="${Object.values(e.states).some(isCut) ? "dossier__picks dossier__picks--states" : "dossier__states"}">${states}</ul>` : ""}
                ${views ? `<h3>Reference views</h3><ul class="dossier__picks">${sc && scenesOf(id).length === 1 ? `<li><button class="dossier__pick dossier__pick--scene" type="button" data-scene="${id}" data-hero-label="In the world" aria-label="${esc(e.name)}: in the world" aria-pressed="true"><span class="stage-box">${sceneImg(sc, "", true)}</span><small>In the world</small></button></li>` : ""}${stage && !Object.values(e.views || {}).includes(hero) ? `<li><button class="dossier__pick" type="button" data-hero="${hero}" data-hero-label="Hero" aria-label="${esc(e.name)}: Hero" aria-pressed="${!sc}"><span class="stage-box">${cut(hero, "dossier__thumbimg", "", "120px")}</span><small>Hero</small></button></li>` : ""}${views}</ul>` : ""}</div>
      <div class="dossier__info">
        <dl>
          <dt>Description</dt><dd>${esc(e.copy.summary)}</dd>
          <dt>${e.type === "hazard" ? "Hazard" : "Behaviour"}</dt><dd>${esc(e.copy.behaviour)}</dd>
          <dt>Where encountered</dt><dd>${esc(e.copy.where)}</dd>
          ${e.height ? `<dt>Approx. height</dt><dd>${e.height.toFixed(1)} m <small class="dossier__note">design reference · Gamer Bros ${(window.GB_HERO_HEIGHT || 1.8).toFixed(1)} m</small></dd>` : ""}
        </dl>
        ${evo(e)}
        ${enc ? `<h3>Encounter images</h3><ul class="dossier__encs">${enc}</ul>` : ""}
      </div>
      ${evoDetail(e)}`;
  }
  function openEntity(id) {
    if (!ENTITIES[id]) return false;
    renderEntity(id);
    if (!eDlg.open) eDlg.showModal();
    document.documentElement.classList.add("is-locked");
    pause();
    eDlg.querySelector(".dossier__close").focus({ preventScroll: true });
    const ev = document.getElementById("entEvo");
    if (evoFocus && ev) requestAnimationFrame(() => ev.scrollIntoView({ block: "start" }));
    else eDlg.querySelector(".dossier__card").scrollTop = 0;
    evoFocus = false;
    return true;
  }
  let evoFocus = false;
  function closeEntityUI() {
    if (eDlg.open) eDlg.close();
    if (!dlg.open) { document.documentElement.classList.remove("is-locked"); restart(); }
    if (entOpenedFrom && document.contains(entOpenedFrom)) entOpenedFrom.focus({ preventScroll: true });
    entOpenedFrom = null;
  }
  function requestCloseEntity() {
    if (entPushed) { entPushed = false; history.back(); }
    else if (dlg.open && current) { history.replaceState(null, "", `#area/${current}/${viewIndex + 1}`); closeEntityUI(); }
    else { history.replaceState(null, "", "#enemies"); closeEntityUI(); }
  }
  function navEntity(id, from) {
    if (!ENTITIES[id]) return;
    entOpenedFrom = from || null;
    entPushed = true;
    location.hash = `#entity/${id}`;
  }
  document.getElementById("entClose").addEventListener("click", requestCloseEntity);
  eDlg.addEventListener("cancel", (e) => { e.preventDefault(); requestCloseEntity(); });
  eDlg.addEventListener("click", (e) => {
    if (e.target === eDlg) { requestCloseEntity(); return; }       // backdrop click
    const tab = e.target.closest("[data-evo-tab]");
    if (tab) {
      eBody.querySelectorAll("[data-evo-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tab)));
      eBody.querySelectorAll("[data-evo-panel]").forEach((p) => { p.hidden = p.dataset.evoPanel !== tab.dataset.evoTab; });
      return;
    }
    const pick = e.target.closest("[data-hero], [data-scene]");
    if (pick) {
      const st = document.getElementById("entStage");
      if (st) {
        const nm = document.getElementById("entName").textContent;
        const sc = pick.dataset.scene && sceneOf(pick.dataset.scene);
        st.classList.toggle("is-scene", !!sc);
        st.innerHTML = sc ? sceneImg(sc, `${nm} in Adventure Mountain™`)
          : `<span class="stage-box">${cut(pick.dataset.hero, "dossier__hero", `${nm}: ${pick.dataset.heroLabel}`, "(min-width: 720px) 420px, 90vw", true)}</span>`;
        document.getElementById("entStageLabel").textContent = pick.dataset.heroLabel;
        eBody.querySelectorAll("[data-hero], [data-scene]").forEach((b) => b.setAttribute("aria-pressed", String(b === pick)));
      }
      return;
    }
    const l = e.target.closest("[data-entity-link]");
    if (l) { e.preventDefault(); location.replace(`#entity/${l.dataset.entityLink}`); return; }   // stay in one history entry
    const a = e.target.closest("[data-goto-area]");
    if (a) { e.preventDefault(); entPushed = false; pushedHere = true; location.replace(a.getAttribute("href")); }
  });
  // hotspots inside area images (Pass E) resolve through the same registry
  aTrack.addEventListener("click", (e) => {
    const h = e.target.closest("[data-ref]");
    if (h) navEntity(h.dataset.ref, h);
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-entity]");
    if (b && !b.closest("dialog")) { evoFocus = b.hasAttribute("data-evo"); navEntity(b.dataset.entity, b); }
  });

  // ---------- router ----------
  function route() {
    const r = parseHash();
    if (r && r.character) { if (eDlg.open) closeEntityUI(); openCharacter(r.character, r.look); return; }
    if (cDlg.open) closeCharacterUI();
    if (r && r.entity) { openEntity(r.entity); return; }
    if (eDlg.open) closeEntityUI();
    if (r && isOpen(r.id)) openArea(r.id, r.view);
    else if (dlg.open) { pushedHere = false; closeAreaUI(); }
  }
  window.addEventListener("hashchange", route);

  function navArea(id, from, view) {
    if (!isOpen(id)) {
      const a = AREAS[id];
      showToast(`${a ? a.name : "This area"}: ${a && a.status === "artwork-required" ? "coming soon" : "more views coming soon"}.`);
      return;
    }
    openedFrom = from || null;
    pushedHere = true;
    location.hash = `#area/${id}` + (view ? `/${view + 1}` : "");   // pushes history; router opens the view
  }
  // Region hotspots. Fallback map: invisible boxes over the labels baked into that image.
  // Panorama: compact pins (icon + faint name → full label on hover / focus / first tap; on
  // touch the second tap enters), shown only once world coordinates are measured and locked.
  const WORLD = window.GB_WORLD || { regions: [] };
  const LIVE_LABELS = true;   // compact region pins on both the front map and the panorama
  let lastPointer = "mouse";
  const hotspots = [];
  const closePins = (except) => hotspots.forEach((h) => { if (h !== except) h.classList.remove("is-open"); });
  WORLD.regions.forEach((r) => {
    const pos = viewer.mode === "panorama" ? (WORLD.coordinateAuthority && r.world) : r.fallback;
    if (!pos || !AREAS[r.area]) return;
    const h = document.createElement("button");
    h.type = "button";
    h.className = "hotspot";
    if (r.color) h.style.setProperty("--rc", r.color);
    h.dataset.area = r.area;
    h.setAttribute("aria-label", `${r.name} — ${r.sub}`);
    if (LIVE_LABELS) {
      h.classList.add("pin");
      h.innerHTML = `<span class="pin__icon" aria-hidden="true"><svg><use href="#${r.icon || "i-compass"}"/></svg></span><span class="pin__text" aria-hidden="true"><strong>${esc(r.name)}</strong><small>${esc(r.sub)}</small></span>`;
    }
    h.addEventListener("pointerdown", (e) => { lastPointer = e.pointerType; });
    h.addEventListener("click", () => {
      if (LIVE_LABELS && lastPointer === "touch" && !h.classList.contains("is-open")) { closePins(h); h.classList.add("is-open"); return; }
      closePins();
      navArea(h.dataset.area, h);
    });
    viewer.addOverlay(h, pos);
    hotspots.push(h);
  });
  if (LIVE_LABELS) document.addEventListener("click", (e) => { if (!e.target.closest(".hotspot")) closePins(); });

  // ---------- Explore Iconic Areas rail ----------
  const rail = document.getElementById("areaRail");
  const RAIL = ["portal", "creek", "river", "clover", "ruin", "prism", "frost"];
  rail.innerHTML = RAIL.map((id) => {
    const a = AREAS[id];
    const v = a.views[0];
    const state = a.status === "open" ? "" : a.status === "incomplete" ? "More views soon" : "Coming soon";
    const rc = ((window.GB_WORLD || {}).regions || []).find((r) => r.area === id);
    return `<button class="area-card${state ? " is-pending" : ""}" type="button" data-area-card="${id}" style="--rc:${rc ? rc.color : "#1f7ae0"}"
        aria-label="${esc(a.name)} — ${esc(a.sub)}${state ? ` (${state})` : ""}">
      ${v ? media(v.src, "area-card__img", "", "small")
          : a.identity ? `<span class="area-card__img region-id region-id--${a.identity.theme}" aria-hidden="true"><svg><use href="#${a.identity.icon}"/></svg></span>`
          : `<span class="area-card__img area-card__img--empty"></span>`}
      <span class="area-card__text"><strong>${esc(a.name)}</strong><small>${esc(a.sub)}</small></span>
      ${state ? `<span class="area-card__state">${state}</span>` : ""}
    </button>`;
  }).join("");
  rail.addEventListener("click", (e) => {
    const c = e.target.closest("[data-area-card]");
    if (c) navArea(c.dataset.areaCard, c);
  });
  document.querySelectorAll("[data-rail]").forEach((b) => b.addEventListener("click", () =>
    rail.scrollBy({ left: Number(b.dataset.rail) * rail.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" })));

  // ---------- Level Preview ----------
  const LP = AREAS.preview;
  const lpFrame = document.getElementById("lpFrame");
  const lpThumbs = document.getElementById("lpThumbs");
  const lpLabel = document.getElementById("lpLabel");
  let lpIndex = 0;
  lpThumbs.innerHTML = LP.views.map((v, i) =>
    `<button type="button" role="tab" data-lp-index="${i}" aria-label="${esc(v.label)}">${media(v.src, "lp__thumb", "", "small")}</button>`).join("");
  function lpSet(i) {
    lpIndex = (i + LP.views.length) % LP.views.length;
    const v = LP.views[lpIndex];
    lpFrame.setAttribute("style", frameVars(v.src));
    lpFrame.innerHTML = `<img src="${asset(v.src, true)}" srcset="${srcset(v.src)}" sizes="(min-width: 1100px) 34vw, 92vw" alt="${esc(v.alt)}" draggable="false">`;
    lpLabel.textContent = v.label;
    [...lpThumbs.children].forEach((b, n) => b.setAttribute("aria-selected", String(n === lpIndex)));
  }
  lpThumbs.addEventListener("click", (e) => { const b = e.target.closest("[data-lp-index]"); if (b) lpSet(Number(b.dataset.lpIndex)); });
  document.querySelectorAll("[data-lp]").forEach((b) => b.addEventListener("click", () => lpSet(lpIndex + Number(b.dataset.lp))));
  document.getElementById("lpMain").addEventListener("click", (e) => navArea("preview", e.currentTarget, lpIndex));
  lpSet(0);

  // ---------- Fast Travel ----------
  const portal = ENTITIES.portal;
  const ftFrame = document.getElementById("ftFrame");
  const ftRegions = Object.entries(portal.states || {});
  const ftName = document.getElementById("ftName");
  const ftDots = document.getElementById("ftDots");
  const colourOf = (name) => (((window.GB_WORLD || {}).regions || []).find((r) => r.name === name) || {}).color || "#1f7ae0";
  function ftSet(i) {
    const [name, src] = ftRegions[i];
    ftFrame.setAttribute("style", frameVars(src));
    ftFrame.innerHTML = `<img src="${asset(src, true)}" srcset="${srcset(src)}" sizes="(min-width: 1100px) 30vw, 92vw" alt="${esc(name)} portal" loading="lazy" draggable="false">`;
    ftName.textContent = name;
    [...ftDots.children].forEach((d, n) => d.setAttribute("aria-pressed", String(n === i)));
  }
  ftDots.innerHTML = ftRegions.map(([name], i) => `<button type="button" style="--rc:${colourOf(name)}" aria-label="${esc(name)} portal" data-ft="${i}"></button>`).join("");
  ftDots.addEventListener("click", (e) => { const b = e.target.closest("[data-ft]"); if (b) ftSet(Number(b.dataset.ft)); });
  ftSet(0);

  // ---------- Enemies & Hazards ----------
  document.getElementById("foes").innerHTML = (window.GB_BESTIARY || []).map((id) => {
    const e = ENTITIES[id];
    const t = e.media.thumb;
    return `<li><button class="foe${e.status === "APPROVED" ? " foe--approved" : ""}${(e.cardScale || 1) > 1 ? " foe--big" : ""}" type="button" data-entity="${id}" style="--s:${e.cardScale || .8}" aria-label="${esc(e.name)} — details">
      ${sceneOf(id) ? `<span class="foe__stage foe__stage--scene">${sceneImg(sceneOf(id), "", true)}</span>`
        : `<span class="foe__stage">${t && isCut(t) ? cut(t, "foe__cut", "", "(min-width: 1100px) 220px, (min-width: 720px) 30vw, 50vw") : media(t, "foe__img", "", "small")}</span>`}
      <span class="foe__text"><strong>${esc(e.name)}</strong></span>
    </button></li>`;
  }).join("") + `<li><button class="foe foe--evo" type="button" data-entity="rolling-boulder" data-evo aria-label="See how the optional evolution works">
      <span class="foe-evo__kicker">Optional evolution</span>
      <span class="foe-evo__line">Rumbler™ <i>→</i> Stone Walker™ <i>→</i> Prism Keeper™</span>
      <span class="foe-evo__go">See how it evolves<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </button></li>`;

  // ---------- Adventure Finds™ ----------
  document.getElementById("objs").innerHTML = (window.GB_OBJECTS || []).filter((id) => ENTITIES[id]).map((id) => {
    const e = ENTITIES[id], t = e.media.thumb;
    return `<li><button class="foe obj" type="button" data-entity="${id}" style="--s:${e.cardScale || .62}" aria-label="${esc(e.name)} — details">
      ${isCut(t) ? `<span class="foe__stage">${cut(t, "foe__cut", "", "(min-width: 1100px) 160px, 40vw")}</span>` : `<span class="foe__stage foe__stage--scene">${sceneImg({ src: t, fx: 50 }, "", true)}</span>`}
      <span class="foe__text"><strong>${esc(e.name)}</strong></span>
    </button></li>`;
  }).join("");

  // ---------- Meet the Team™ (#character/<id>) ----------
  const TEAM = window.GB_TEAM || [];
  const cDlg = document.getElementById("charView");
  const cBody = document.getElementById("charBody");
  let charPushed = false;
  let charOpenedFrom = null;
  let charState = { id: null, look: "sporty", view: 0 };
  const CHAR_SIZES = "(min-width: 900px) 440px, 80vw";
  const lookOf = (c, look) => c.looks[look] ? look : "sporty";
  function charStage() {
    const c = CHARS[charState.id], L = c.looks[charState.look], v = L.views[charState.view];
    document.getElementById("charStageFig").innerHTML = cut(v.src, "char__hero", `${c.name}, ${L.label.toLowerCase()}: ${v.label}`, CHAR_SIZES, true);
    document.getElementById("charStageLabel").textContent = `${L.label} · ${v.label}`;
    cBody.querySelectorAll("[data-char-view]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.charView) === charState.view)));
  }
  function renderCharacter(id, look) {
    const c = CHARS[id];
    charState = { id, look: lookOf(c, look), view: 0 };
    const L = c.looks[charState.look];
    cDlg.style.setProperty("--c", c.hex);
    cDlg.style.setProperty("--cd", c.deep);
    document.getElementById("charName").textContent = c.name;
    cBody.innerHTML = `
      <div class="char__stagewrap">
        <div class="char__stage">
          <span class="char__mark" aria-hidden="true">GB</span>
          <span class="stage-box" id="charStageFig"></span>
        </div>
        <p class="char__caption"><b class="chip chip--inline">View</b> <span id="charStageLabel"></span></p>
      </div>
      <div class="char__side">
        <div class="char__looks" role="group" aria-label="Choose look">
          ${Object.entries(c.looks).map(([k, x]) => `<button type="button" class="char__look" data-char-look="${k}" aria-pressed="${k === charState.look}">${esc(x.label)}</button>`).join("")}
        </div>
        <h3>Views</h3>
        <ul class="char__views">${L.views.map((v, i) => `<li><button type="button" class="char__view" data-char-view="${i}" aria-label="${esc(v.label)}"><span class="stage-box">${cut(v.src, "char__thumb", "", "110px")}</span><small>${esc(v.label)}</small></button></li>`).join("")}</ul>
        <h3>The team</h3>
        <ul class="char__team">${TEAM.map((t) => `<li><a href="#character/${t}" data-char-link="${t}" style="--c:${CHARS[t].hex}"${t === id ? ' aria-current="true"' : ""}><i aria-hidden="true"></i>${esc(CHARS[t].name)}</a></li>`).join("")}</ul>
      </div>`;
    charStage();
  }
  function openCharacter(id, look) {
    if (!CHARS[id]) return false;
    if (!cDlg.open || charState.id !== id || (look && lookOf(CHARS[id], look) !== charState.look)) renderCharacter(id, look);
    if (!cDlg.open) cDlg.showModal();
    document.documentElement.classList.add("is-locked");
    pause();
    cDlg.querySelector(".dossier__close").focus({ preventScroll: true });
    return true;
  }
  function closeCharacterUI() {
    if (cDlg.open) cDlg.close();
    if (!dlg.open && !eDlg.open) { document.documentElement.classList.remove("is-locked"); restart(); }
    if (charOpenedFrom && document.contains(charOpenedFrom)) charOpenedFrom.focus({ preventScroll: true });
    charOpenedFrom = null;
  }
  function requestCloseCharacter() {
    if (charPushed) { charPushed = false; history.back(); }
    else { history.replaceState(null, "", "#characters"); closeCharacterUI(); }
  }
  document.getElementById("charClose").addEventListener("click", requestCloseCharacter);
  cDlg.addEventListener("cancel", (e) => { e.preventDefault(); requestCloseCharacter(); });
  cDlg.addEventListener("click", (e) => {
    if (e.target === cDlg) { requestCloseCharacter(); return; }
    const lk = e.target.closest("[data-char-look]");
    if (lk) {   // look selection is part of the bookmarkable URL, without adding history entries
      history.replaceState(history.state, "", `#character/${charState.id}/${lk.dataset.charLook}`);
      renderCharacter(charState.id, lk.dataset.charLook);
      cBody.querySelector(`[data-char-look="${lk.dataset.charLook}"]`).focus({ preventScroll: true });
      return;
    }
    const vw = e.target.closest("[data-char-view]");
    if (vw) { charState.view = Number(vw.dataset.charView); charStage(); return; }
    const t = e.target.closest("[data-char-link]");
    if (t) { e.preventDefault(); if (t.dataset.charLink !== charState.id) location.replace(`#character/${t.dataset.charLink}`); }
  });

  const teamList = document.getElementById("teamList");
  teamList.innerHTML = TEAM.map((id) => {
    const c = CHARS[id];
    return `<li><a class="mate" href="#character/${id}" data-character="${id}" style="--c:${c.hex};--cd:${c.deep}">
      <span class="mate__fig" aria-hidden="true"><span class="stage-box">${cut(c.card, "mate__cut", "", "(min-width: 1100px) 260px, 60vw")}</span></span>
      <span class="mate__text">
        <b class="mate__colour">${esc(c.colour)}</b>
        <strong>${esc(c.name)}</strong>
        <small>${esc(c.tagline || "")}</small>
        <span class="mate__go">View character<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </span>
    </a></li>`;
  }).join("");
  teamList.addEventListener("click", (e) => {
    const a = e.target.closest("[data-character]");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
    e.preventDefault();
    charOpenedFrom = a;
    charPushed = true;
    location.hash = `#character/${a.dataset.character}`;   // pushes history; router opens the view
  });
  document.querySelectorAll("[data-team]").forEach((b) => b.addEventListener("click", () => {
    const card = teamList.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(teamList).columnGap || 0) : teamList.clientWidth * 0.8;
    teamList.scrollBy({ left: Number(b.dataset.team) * step, behavior: reduceMotion ? "auto" : "smooth" });
  }));

  // deep link on load
  route();
})();
