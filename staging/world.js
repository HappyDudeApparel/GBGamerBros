// GB GAMER BROS™ — Adventure Mountain™ world viewer
//
// One component, two modes, chosen from data (no page changes needed to switch):
//   fallback  — window.GB_PANORAMA is null: shows the current front map (one image, no wrap).
//               Fits the width on landscape screens; portrait screens can zoom in and pan.
//   panorama  — window.GB_PANORAMA holds a valid manifest (tools/gbpano.py): seamless
//               horizontal loop built from tiles, tier chosen per screen height × DPR,
//               overview strip for first paint and the minimap.
//
// Both modes share: mouse drag, touch swipe (vertical page scroll is left to the browser),
// momentum, keyboard (← → Home End), horizontal wheel/trackpad, pan buttons, minimap,
// and overlays positioned in normalised world coordinates (they never touch the imagery).
//
// The viewer never relies on an image's intrinsic size: sizes come from the manifest or
// from the fallback config, so a replacement asset with other proportions just works.
(() => {
"use strict";
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mod = (a, n) => ((a % n) + n) % n;

function validPanorama(p) {
  return !!(p && p.width > 0 && p.height > 0 && p.overview && p.overview.src &&
    Array.isArray(p.tiers) && p.tiers.length &&
    p.tiers.every((t) => t.height > 0 && t.width > 0 && Array.isArray(t.tiles) && t.tiles.length &&
      t.tiles.every((x) => x.src && x.w > 0)));
}
const withRev = (o) => o.src + (o.rev ? `?v=${o.rev}` : "");

function create(root, opts) {
  const pano = validPanorama(opts.panorama) ? opts.panorama : null;
  const mode = pano ? "panorama" : "fallback";
  const wrap = !!pano;
  const vp = root.querySelector(".map");
  const track = root.querySelector(".map__track");
  const overlay = root.querySelector(".map__overlay");
  const prevBtn = root.querySelector(".map__pan--prev");
  const nextBtn = root.querySelector(".map__pan--next");
  const minimap = root.querySelector(".minimap");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fbEl = track.querySelector(".map__img");
  const fb = { w: Number(fbEl.getAttribute("width")), h: Number(fbEl.getAttribute("height")) };
  const aspect = pano ? pano.width / pano.height : fb.w / fb.h;
  root.dataset.mode = mode;

  let vw = 0, W = 0, H = 0, zoom = 1, offset = 0;
  let tier = null, strips = [];
  const overlays = [];
  const listeners = [];

  // ---------- imagery ----------
  // fallback art is the <img class="map__img"> already in the page (revisioned by revision.py)
  let fbImg = track.querySelector(".map__img");
  if (pano) { track.innerHTML = ""; fbImg = null; }
  else fbImg.draggable = false;
  function pickTier() {
    const need = H * Math.min(window.devicePixelRatio || 1, 2);
    const t = pano.tiers.find((x) => x.height >= need) || pano.tiers[pano.tiers.length - 1];
    return !tier || t.height > tier.height ? t : tier;    // only ever upgrade
  }
  function buildStrips() {
    const copies = Math.max(2, Math.ceil(vw / Math.max(W, 1)) + 1);
    const t = pickTier();
    if (t === tier && strips.length === copies) return;
    tier = t;
    track.innerHTML = "";
    strips = [];
    for (let c = 0; c < copies; c++) {
      const s = document.createElement("div");
      s.className = "map__strip";
      const ov = new Image();
      ov.className = "map__overview"; ov.alt = ""; ov.draggable = false; ov.src = withRev(pano.overview);
      s.appendChild(ov);
      let x = 0;
      const tiles = tier.tiles.map((d) => {
        const img = new Image();
        img.className = "map__tile"; img.alt = ""; img.draggable = false; img.decoding = "async";
        img.dataset.src = withRev(d);
        img.addEventListener("load", () => img.classList.add("is-in"), { once: true });
        const tile = { img, x0: x / tier.width, x1: (x + d.w) / tier.width };
        x += d.w;
        s.appendChild(img);
        return tile;
      });
      track.appendChild(s);
      strips.push({ el: s, tiles });
    }
  }

  // ---------- layout ----------
  function layout(keepCentre) {
    const c = keepCentre !== false && W ? centre() : null;
    vw = vp.clientWidth || 1;
    if (pano) {
      H = vp.clientHeight || Math.round(vw / 3);
      W = H * aspect;
      buildStrips();
      strips.forEach((s) => {
        s.el.style.width = `${W}px`; s.el.style.height = `${H}px`;
        s.tiles.forEach((t) => { t.img.style.left = `${t.x0 * W}px`; t.img.style.width = `${(t.x1 - t.x0) * W + 0.5}px`; });
      });
    } else {
      W = vw * zoom;
      H = Math.round(W / aspect);
      vp.style.height = `${H}px`;
      fbImg.style.width = `${W}px`; fbImg.style.height = `${H}px`;
    }
    root.style.setProperty("--map-w", `${W}px`);
    root.style.setProperty("--map-h", `${H}px`);
    if (c !== null) offset = c * W - vw / 2;
    setOffset(offset);
  }

  // ---------- position ----------
  const canPan = () => wrap || W > vw + 1;
  const maxOff = () => Math.max(0, W - vw);
  function setOffset(o) {
    offset = wrap ? o : clamp(o, 0, maxOff());
    render();
  }
  function centre() { return wrap ? mod(offset + vw / 2, W) / W : (offset + vw / 2) / W; }

  function render() {
    if (pano) {
      const base = -mod(offset, W);
      strips.forEach((s, i) => {
        const x = base + i * W;
        s.el.style.transform = `translate3d(${x}px,0,0)`;
        s.tiles.forEach((t) => {       // load tiles in (or near) view
          if (t.img.src) return;
          const a = x + t.x0 * W, b = x + t.x1 * W;
          if (b > -vw * 0.5 && a < vw * 1.5) t.img.src = t.img.dataset.src;
        });
      });
    } else {
      track.style.transform = `translate3d(${-offset}px,0,0)`;
    }
    overlays.forEach(place);
    if (prevBtn) prevBtn.classList.toggle("is-off", !canPan() || (!wrap && offset < 2));
    if (nextBtn) nextBtn.classList.toggle("is-off", !canPan() || (!wrap && offset > maxOff() - 2));
    root.classList.toggle("can-pan", canPan());
    drawMinimap();
    listeners.forEach((fn) => fn(api));
  }

  // ---------- overlays (normalised world coordinates) ----------
  // pos: { x, y } centre point, or { l, t, w, h } box; all 0–1 of the current imagery.
  function place(o) {
    const p = o.pos;
    const w = (p.w || 0) * W, h = (p.h || 0) * H;
    const left = p.l !== undefined ? p.l * W : p.x * W - w / 2;
    const top = p.t !== undefined ? p.t * H : p.y * H - h / 2;
    let sx = left - offset;
    if (wrap) { const m = Math.max(w, 160); sx = mod(sx + m, W) - m; }
    o.el.style.transform = `translate3d(${sx}px,${top}px,0)`;
    if (w) o.el.style.width = `${w}px`;
    if (h) o.el.style.height = `${h}px`;
    o.el.hidden = !wrap && (sx + w < -40 || sx > vw + 40) ? true : false;
  }
  function addOverlay(el, pos) {
    const o = { el, pos };
    el.classList.add("map__mark");
    overlay.appendChild(el);
    overlays.push(o);
    place(o);
    return o;
  }

  // ---------- minimap ----------
  let mmViews = [];
  if (minimap) {
    const img = minimap.querySelector("img");
    if (pano) img.src = withRev(pano.overview);
    img.draggable = false;
    minimap.querySelectorAll(".minimap__view").forEach((v) => v.remove());
    mmViews = [0, 1].map(() => { const s = document.createElement("span"); s.className = "minimap__view"; minimap.appendChild(s); return s; });
  }
  function drawMinimap() {
    if (!minimap || !W) return;
    const f = vw / W;
    const l = wrap ? mod(offset, W) / W : offset / W;
    mmViews[0].style.left = `${l * 100}%`;
    mmViews[0].style.width = `${Math.min(1, f) * 100}%`;
    const spill = wrap && l + f > 1;
    mmViews[1].hidden = !spill;
    if (spill) { mmViews[1].style.left = `${(l - 1) * 100}%`; mmViews[1].style.width = `${f * 100}%`; }
    minimap.setAttribute("aria-valuenow", String(Math.round(centre() * 100)));
  }

  // ---------- motion ----------
  let raf = 0;
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  function animateTo(target, ms) {
    stop();
    if (reduce.matches || !ms) { setOffset(target); return; }
    const from = offset, t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setOffset(from + (target - from) * e);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function glide(v) {                 // v in px/ms (positive = content moves right)
    stop();
    if (reduce.matches || Math.abs(v) < 0.05) return;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(40, now - last); last = now;
      const before = offset;
      setOffset(offset - v * dt);
      v *= Math.pow(0.9955, dt);
      if (Math.abs(v) > 0.02 && (wrap || offset !== before)) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  const panBy = (px, smooth) => animateTo(offset + px, smooth === false ? 0 : 420);
  const panTo = (fx, smooth) => animateTo(fx * W - vw / 2, smooth ? 420 : 0);

  // ---------- input: drag / swipe with momentum ----------
  let drag = null, suppressClick = false;
  vp.addEventListener("pointerdown", (e) => {
    if ((e.pointerType === "mouse" && e.button !== 0) || !canPan()) return;
    stop();
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, off: offset, moved: false, samples: [[performance.now(), e.clientX]], type: e.pointerType };
  });
  vp.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        drag.moved = true;
        try { vp.setPointerCapture(e.pointerId); } catch (_) { /* pointer already gone */ }
        root.classList.add("is-dragging", "is-exploring");
      } else if (Math.abs(dy) > 10) { drag = null; return; }   // vertical: let the page scroll
      else return;
    }
    e.preventDefault();
    setOffset(drag.off - dx);
    const now = performance.now();
    drag.samples.push([now, e.clientX]);
    while (drag.samples.length > 2 && now - drag.samples[0][0] > 90) drag.samples.shift();
  });
  const endDrag = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag; drag = null;
    root.classList.remove("is-dragging");
    if (!d.moved) return;
    suppressClick = true; setTimeout(() => (suppressClick = false), 0);
    const a = d.samples[0], b = d.samples[d.samples.length - 1];
    const dt = b[0] - a[0];
    if (dt > 0 && performance.now() - b[0] < 80) glide((b[1] - a[1]) / dt);
  };
  vp.addEventListener("pointerup", endDrag);
  vp.addEventListener("pointercancel", endDrag);
  vp.addEventListener("lostpointercapture", endDrag);
  vp.addEventListener("click", (e) => { if (suppressClick) { e.stopPropagation(); e.preventDefault(); } }, true);
  vp.addEventListener("wheel", (e) => {
    if (!canPan() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); stop();
    setOffset(offset + e.deltaX);
  }, { passive: false });
  vp.addEventListener("keydown", (e) => {
    if (!canPan()) return;
    const k = e.key;
    if (k === "ArrowLeft" || k === "ArrowRight") { e.preventDefault(); panBy((k === "ArrowLeft" ? -1 : 1) * vw * 0.3); }
    else if (k === "Home" && !wrap) { e.preventDefault(); animateTo(0, 420); }
    else if (k === "End" && !wrap) { e.preventDefault(); animateTo(maxOff(), 420); }
  });
  [prevBtn, nextBtn].forEach((b, i) => b && b.addEventListener("click", () => panBy((i ? 1 : -1) * vw * 0.6)));

  if (minimap) {
    let mmDrag = false;
    const at = (e, smooth) => { const r = minimap.getBoundingClientRect(); panTo(clamp((e.clientX - r.left) / r.width, 0, 1), smooth); };
    minimap.addEventListener("pointerdown", (e) => { mmDrag = true; try { minimap.setPointerCapture(e.pointerId); } catch (_) {} at(e, true); });
    minimap.addEventListener("pointermove", (e) => { if (mmDrag) at(e, false); });
    minimap.addEventListener("pointerup", () => (mmDrag = false));
    minimap.addEventListener("pointercancel", () => (mmDrag = false));
    minimap.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); panBy((e.key === "ArrowLeft" ? -1 : 1) * vw * 0.5, false); }
    });
  }

  // artwork: no drag-out or save menu on the map surface (navigation stays fully usable)
  [vp, minimap].forEach((el) => el && el.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); }));

  // ---------- size changes ----------
  if ("ResizeObserver" in window) new ResizeObserver(() => { if (vp.clientWidth !== vw) layout(); }).observe(vp);
  else window.addEventListener("resize", () => layout());

  const api = {
    mode, wrap,
    get centre() { return centre(); },
    get size() { return { width: W, height: H, view: vw }; },
    canPan, panTo, panBy, addOverlay,
    setZoom(z, fx) {                     // fallback only: 1 = whole map fits the width
      if (pano) return;
      zoom = Math.max(1, z);
      layout(false);
      panTo(fx === undefined ? 0.5 : fx, false);
    },
    onChange(fn) { listeners.push(fn); },
    refresh: () => layout(),
  };
  layout(false);
  return api;
}

window.GBWorld = { create, validPanorama };
})();
