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

  // ---------- map hotspots (area views are wired in Pass B) ----------
  const AREA_NAMES = {
    portal: "Portal Meadow™", creek: "Creek Crossing™", river: "Riverworks™", clover: "Clover Cliffs™",
    ruin: "Ruin Courtyard™", prism: "Prism Ridge™", frost: "Frost Peaks™",
  };
  document.querySelectorAll(".hotspot").forEach((h) =>
    h.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("gb:open-area", { detail: { area: h.dataset.area } }));
      showToast(`${AREA_NAMES[h.dataset.area]} area view opens here in Pass B.`);
    })
  );
})();
