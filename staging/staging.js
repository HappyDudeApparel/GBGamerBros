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
  const KIND = { establishing: "Overview", ground: "Ground level", traversal: "Route", landmark: "Landmark", closeup: "Close view" };
  let current = null;      // area id
  let viewIndex = 0;
  let openedFrom = null;   // element to return focus to
  let pushedHere = false;  // whether this session pushed the area entry (so Back/close can pop it)

  const parseHash = () => {
    const m = location.hash.match(/^#area\/([a-z]+)(?:\/(\d+))?$/);
    return m ? { id: m[1], view: m[2] ? Number(m[2]) - 1 : 0 } : null;
  };

  function buildHotspots(view) {
    // Pass E: each hotspot is a % box over the full image
    return (view.hotspots || []).map((h) =>
      `<button type="button" data-hotspot="${h.id}" data-type="${h.type || ""}" aria-label="${h.label || h.type || "Point of interest"}"
         style="--x:${h.x};--y:${h.y};--w:${h.w};--h:${h.h}"></button>`).join("");
  }

  function render(id) {
    const area = AREAS[id];
    aTitle.textContent = area.name;
    aSub.textContent = area.sub;
    aTrack.innerHTML = area.views.map((v, i) => `
      <figure class="shot" data-index="${i}" aria-label="View ${i + 1} of ${area.views.length}: ${v.label}" style="--focus:${v.focus ?? 0.5}">
        <div class="shot__frame">
          <div class="shot__stage">
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
    viewIndex = Math.max(0, Math.min(area.views.length - 1, i));
    const v = area.views[viewIndex];
    aCount.textContent = `${viewIndex + 1} / ${area.views.length}`;
    aLabel.innerHTML = `<small>${KIND[v.kind] || ""}</small>${v.label}`;
    [...aDots.children].forEach((d, n) => d.setAttribute("aria-selected", String(n === viewIndex)));
    aPrev.disabled = viewIndex === 0;
    aNext.disabled = viewIndex === area.views.length - 1;
    aBg.style.backgroundImage = `url(${v.src}-960.webp)`;
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
    if (!AREAS[id] || !AREAS[id].ready) return false;
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

  window.addEventListener("hashchange", () => {
    const r = parseHash();
    if (r && AREAS[r.id] && AREAS[r.id].ready) openArea(r.id, r.view);
    else if (dlg.open) { pushedHere = false; closeAreaUI(); }
  });

  document.querySelectorAll(".hotspot").forEach((h) =>
    h.addEventListener("click", () => {
      const id = h.dataset.area;
      if (!AREAS[id] || !AREAS[id].ready) {
        showToast(`${AREAS[id] ? AREAS[id].name : "This area"} opens once the area template is approved.`);
        return;
      }
      openedFrom = h;
      pushedHere = true;
      location.hash = `#area/${id}`;   // pushes a history entry; hashchange opens the view
    })
  );

  // deep link on load
  const initial = parseHash();
  if (initial) openArea(initial.id, initial.view);
})();
