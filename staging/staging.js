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
  const bros = document.getElementById("heroBros");
  const dotsWrap = document.getElementById("heroDots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 7000;
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
    bros.classList.toggle("is-hidden", slides[index].dataset.fg !== "bros");
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
