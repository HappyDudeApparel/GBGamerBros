// GB GAMER BROS™ — staging build, Pass A
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
    b.setAttribute("aria-label", `Show slide ${n + 1} of ${slides.length}`);
    b.addEventListener("click", () => { go(n); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });

  function go(n) {
    index = (n + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    slides.forEach((s, i) => s.setAttribute("aria-hidden", String(i !== index)));
    dots.forEach((d, i) => d.setAttribute("aria-selected", String(i === index)));
    fgLayers.forEach((f) => f.classList.toggle("is-active", Number(f.dataset.slide) === index));
  }
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

  // ---------- map panning (portrait: swipe, arrows, minimap) ----------
  const map = document.getElementById("mapScroller");
  const panPrev = document.querySelector(".map__pan--prev");
  const panNext = document.querySelector(".map__pan--next");
  const minimap = document.getElementById("minimap");
  const minimapView = document.getElementById("minimapView");

  function syncMap() {
    const max = map.scrollWidth - map.clientWidth;
    const pannable = max > 2;
    const ratio = pannable ? map.scrollLeft / max : 0;
    panPrev.classList.toggle("is-off", !pannable || map.scrollLeft < 4);
    panNext.classList.toggle("is-off", !pannable || map.scrollLeft > max - 4);
    minimapView.style.width = `${(map.clientWidth / map.scrollWidth) * 100}%`;
    minimapView.style.left = `${(map.scrollLeft / map.scrollWidth) * 100}%`;
    minimap.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }
  function panTo(fraction, smooth) {
    // fraction = centre of the view as a share of the full map width
    const left = fraction * map.scrollWidth - map.clientWidth / 2;
    map.scrollTo({ left, behavior: smooth && !reduceMotion ? "smooth" : "auto" });
  }
  map.addEventListener("scroll", syncMap, { passive: true });
  window.addEventListener("resize", syncMap);
  [panPrev, panNext].forEach((b) =>
    b.addEventListener("click", () =>
      map.scrollBy({ left: Number(b.dataset.pan) * map.clientWidth * 0.7, behavior: reduceMotion ? "auto" : "smooth" })
    )
  );
  let dragging = false;
  const minimapAt = (e) => {
    const r = minimap.getBoundingClientRect();
    panTo(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), !dragging);
  };
  minimap.addEventListener("pointerdown", (e) => { dragging = true; minimap.setPointerCapture(e.pointerId); minimapAt(e); });
  minimap.addEventListener("pointermove", (e) => { if (dragging) minimapAt(e); });
  minimap.addEventListener("pointerup", () => (dragging = false));
  minimap.addEventListener("pointercancel", () => (dragging = false));
  minimap.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      map.scrollBy({ left: (e.key === "ArrowLeft" ? -1 : 1) * map.clientWidth * 0.5, behavior: "auto" });
    }
  });
  // start where the adventure begins (Portal Meadow™ on the left)
  map.scrollLeft = 0;
  syncMap();
  window.addEventListener("load", syncMap);

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
  const isOpen = (id) => AREAS[id] && AREAS[id].status === "open" && AREAS[id].views.length > 0;
  const KIND = { establishing: "Overview", ground: "Ground level", traversal: "Route", landmark: "Landmark", closeup: "Close view", still: "Preview still" };
  let current = null;      // area id
  let viewIndex = 0;
  let openedFrom = null;   // element to return focus to
  let pushedHere = false;  // whether this session pushed the area entry (so Back/close can pop it)

  const ENTITIES = window.GB_ENTITIES || {};
  // routes: #area/<id>[/<n>]  and  #entity/<id>
  const parseHash = () => {
    let m = location.hash.match(/^#area\/([a-z-]+)(?:\/(\d+))?$/);
    if (m) return { id: m[1], view: m[2] ? Number(m[2]) - 1 : 0 };
    m = location.hash.match(/^#entity\/([a-z0-9-]+)$/);
    return m ? { entity: m[1] } : null;
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
            <img src="${v.src}.webp" srcset="${v.src}-960.webp 960w, ${v.src}.webp 1672w"
                 sizes="(max-aspect-ratio: 1/1) 180vh, 92vw" alt="${v.alt}" width="1672" height="941"
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
    aBg.innerHTML = `<div class="gbm" style="${frameVars(v.src)}"><img src="${v.src}-960.webp" alt=""></div>`;
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
  // One detail view for every canonical entity: Bad Guys & Hazards cards, Fast Travel,
  // and Pass E hotspots inside area images all open #entity/<id>.
  const eDlg = document.getElementById("entityView");
  const eBody = document.getElementById("entBody");
  const TYPE = { enemy: "Enemy", hazard: "Hazard", portal: "Portal", prop: "World prop", collectible: "Collectible" };
  let entPushed = false;
  let entOpenedFrom = null;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const media = (src, cls, alt, size) => src && MEDIA[src]
    ? `<span class="gbm ${cls}" style="${frameVars(src)}"><img src="${src}${size === "small" ? "-960" : ""}.webp" alt="${esc(alt)}" loading="lazy" draggable="false"></span>`
    : `<span class="${cls} media-missing"><span>Artwork in production</span></span>`;

  function renderEntity(id) {
    const e = ENTITIES[id];
    document.getElementById("entType").textContent = `${TYPE[e.type] || ""} · ${e.status === "CANONICAL" ? "Canonical" : "Provisional concept"}`;
    document.getElementById("entName").textContent = e.name;
    const hero = e.media.render || e.media.thumb;
    const states = Object.entries(e.states || {}).map(([k, v]) =>
      `<li>${v ? media(v, "dossier__state", `${e.name} ${k}`) : `<span class="dossier__state media-missing"><span>Not yet available</span></span>`}<small>${esc(k[0].toUpperCase() + k.slice(1))}</small></li>`).join("");
    const enc = (e.encounter || []).filter((x) => AREAS[x.area] && AREAS[x.area].views[x.view - 1]).map((x) => {
      const a = AREAS[x.area], v = a.views[x.view - 1];
      return `<li><a href="#area/${x.area}/${x.view}" data-goto-area>${media(v.src, "dossier__enc", v.alt, "small")}
        <small>${esc(a.name)}${x.confirmed === false ? " · match to confirm" : ""}</small></a></li>`;
    }).join("");
    eBody.innerHTML = `
      <div class="dossier__visual">${media(hero, "dossier__render", e.name)}
        ${hero && !e.media.render ? `<p class="dossier__caption">Concept thumbnail. Clean render in production.</p>` : ""}</div>
      <div class="dossier__info">
        ${e.copy.provisional ? `<p class="dossier__flag">Working copy · not final</p>` : ""}
        <dl>
          <dt>Description</dt><dd>${esc(e.copy.summary)}</dd>
          <dt>${e.type === "hazard" ? "Hazard" : "Behaviour"}</dt><dd>${esc(e.copy.behaviour)}</dd>
          <dt>Where encountered</dt><dd>${esc(e.copy.where)}</dd>
        </dl>
        ${states ? `<h3>Visual states</h3><ul class="dossier__states">${states}</ul>` : ""}
        <h3>Encounter images</h3>
        ${enc ? `<ul class="dossier__encs">${enc}</ul>` : `<p class="dossier__empty">Encounter imagery in production.</p>`}
      </div>`;
  }
  function openEntity(id) {
    if (!ENTITIES[id]) return false;
    renderEntity(id);
    if (!eDlg.open) eDlg.showModal();
    document.documentElement.classList.add("is-locked");
    pause();
    eDlg.querySelector(".dossier__close").focus({ preventScroll: true });
    return true;
  }
  function closeEntityUI() {
    if (eDlg.open) eDlg.close();
    if (!dlg.open) { document.documentElement.classList.remove("is-locked"); restart(); }
    if (entOpenedFrom && document.contains(entOpenedFrom)) entOpenedFrom.focus({ preventScroll: true });
    entOpenedFrom = null;
  }
  function requestCloseEntity() {
    if (entPushed) { entPushed = false; history.back(); }
    else if (dlg.open && current) { history.replaceState(null, "", `#area/${current}/${viewIndex + 1}`); closeEntityUI(); }
    else { history.replaceState(null, "", "#bad-guys"); closeEntityUI(); }
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
    if (b && !b.closest("dialog")) navEntity(b.dataset.entity, b);
  });

  // ---------- router ----------
  function route() {
    const r = parseHash();
    if (r && r.entity) { openEntity(r.entity); return; }
    if (eDlg.open) closeEntityUI();
    if (r && isOpen(r.id)) openArea(r.id, r.view);
    else if (dlg.open) { pushedHere = false; closeAreaUI(); }
  }
  window.addEventListener("hashchange", route);

  function navArea(id, from, view) {
    if (!isOpen(id)) {
      const a = AREAS[id];
      const why = a && a.status === "artwork-required" ? "artwork is in production" : "more views are in production";
      showToast(`${a ? a.name : "This area"}: ${why}.`);
      return;
    }
    openedFrom = from || null;
    pushedHere = true;
    location.hash = `#area/${id}` + (view ? `/${view + 1}` : "");   // pushes history; router opens the view
  }
  document.querySelectorAll(".hotspot").forEach((h) => h.addEventListener("click", () => navArea(h.dataset.area, h)));

  // ---------- Explore Iconic Areas rail ----------
  const rail = document.getElementById("areaRail");
  const RAIL = ["portal", "creek", "river", "clover", "ruin", "prism", "frost"];
  rail.innerHTML = RAIL.map((id) => {
    const a = AREAS[id];
    const v = a.views[0];
    const state = a.status === "open" ? "" : a.status === "incomplete" ? "More views in production" : "Artwork in production";
    return `<button class="area-card${state ? " is-pending" : ""}" type="button" data-area-card="${id}"
        aria-label="${esc(a.name)} — ${esc(a.sub)}${state ? ` (${state})` : ""}">
      ${v ? media(v.src, "area-card__img", "", "small") : `<span class="area-card__img area-card__img--empty"></span>`}
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
    lpFrame.innerHTML = `<img src="${v.src}-960.webp" srcset="${v.src}-960.webp 960w, ${v.src}.webp 1672w" sizes="(min-width: 1100px) 34vw, 92vw" alt="${esc(v.alt)}" draggable="false">`;
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
  ftFrame.setAttribute("style", frameVars(portal.media.render));
  ftFrame.innerHTML = `<img src="${portal.media.render}-960.webp" srcset="${portal.media.render}-960.webp 960w, ${portal.media.render}.webp 1280w" sizes="(min-width: 1100px) 30vw, 92vw" alt="Gamer Bro Blue™ leaping into a blue portal in a stone shrine" loading="lazy" draggable="false">`;

  // ---------- Bad Guys & Hazards ----------
  document.getElementById("foes").innerHTML = (window.GB_BESTIARY || []).map((id) => {
    const e = ENTITIES[id];
    return `<li><button class="foe" type="button" data-entity="${id}" aria-label="${esc(e.name)} — details">
      ${media(e.media.thumb, "foe__img", "")}
      <strong>${esc(e.name)}</strong><small>${esc(e.copy.summary)} ${esc(e.copy.behaviour)}</small>
    </button></li>`;
  }).join("");

  // deep link on load
  route();
})();
