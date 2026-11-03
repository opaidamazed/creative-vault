/* ==========================================================
   Creative Vault — الصفحة الرئيسية
   ========================================================== */
(function () {
  "use strict";
  const V = window.Vault, C = window.VAULT_CONFIG;
  const { $, $$, esc, icon, norm } = V;

  /* ---------- Hero slider ---------- */
  const slidesEl = $("#slides"), dotsEl = $("#dots"), slider = $("#slider");
  const n = C.banners.length;
  let cur = 0, timer = null;

  slidesEl.innerHTML = C.banners.map((b, i) =>
    `<div class="slide"><img src="${esc(b.image)}" alt="${esc(b.alt)}" ${i ? 'loading="lazy"' : ""} draggable="false"></div>`).join("");
  dotsEl.innerHTML = C.banners.map((_, i) => `<button class="dot" aria-label="بنر ${i + 1}" data-i="${i}"></button>`).join("");

  function go(i) {
    cur = (i + n) % n;
    slidesEl.style.transform = `translateX(${-cur * 100}%)`;
    $$(".dot").forEach((d, k) => d.classList.toggle("on", k === cur));
  }
  function stop() { clearInterval(timer); }
  function play() { stop(); if (n > 1) timer = setInterval(() => go(cur + 1), C.bannerIntervalMs || 5000); }

  $("#prevBtn").addEventListener("click", () => { go(cur - 1); play(); });
  $("#nextBtn").addEventListener("click", () => { go(cur + 1); play(); });
  dotsEl.addEventListener("click", (e) => { const d = e.target.closest(".dot"); if (d) { go(+d.dataset.i); play(); } });
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", play);

  let sx = 0, dx = 0, drag = false;
  slider.addEventListener("pointerdown", (e) => { drag = true; sx = e.clientX; dx = 0; stop(); });
  window.addEventListener("pointermove", (e) => { if (drag) dx = e.clientX - sx; });
  window.addEventListener("pointerup", () => {
    if (!drag) return; drag = false;
    if (Math.abs(dx) > 50) go(dx < 0 ? cur + 1 : cur - 1);
    play();
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  go(0); play();

  /* ---------- Features / about banner / note (ثابتة) ---------- */
  $("#features").innerHTML = C.features.map((f) => `
    <div class="feat reveal">${icon(f.icon)}<strong>${esc(f.title)}</strong><small>${esc(f.sub)}</small></div>`).join("");
  $("#aboutImg").src = C.aboutBanner;
  $("#aboutMore").href = C.aboutUrl || "about.html";
  $("#sizeNote").textContent = C.sizeNote || "";

  /* ---------- Carousel arrows (RTL) ---------- */
  const car = $("#latestList");
  const step = () => (car.querySelector(".l-card")?.offsetWidth || 260) + 18;
  $("#cPrev").addEventListener("click", () => car.scrollBy({ left: step() }));
  $("#cNext").addEventListener("click", () => car.scrollBy({ left: -step() }));

  /* ---------- Search (فلترة حيّة) ---------- */
  let query = "";
  function applyFilter() {
    const q = norm(query.trim());
    let shownLibs = 0, shownItems = 0;
    $$("#libGrid [data-search]").forEach((el) => { const ok = !q || norm(el.dataset.search).includes(q); el.style.display = ok ? "" : "none"; if (ok) shownLibs++; });
    $$("#latestList [data-search]").forEach((el) => { const ok = !q || norm(el.dataset.search).includes(q); el.style.display = ok ? "" : "none"; if (ok) shownItems++; });
    $("#noResults").hidden = !(q && !shownLibs && !shownItems);
  }
  V.onSearch = (v) => { query = v; applyFilter(); };

  /* ---------- Data-driven sections ---------- */
  function render(data) {
    $("#libGrid").innerHTML = data.libraries.map(V.libCard).join("");

    const items = (data.latest || []).slice(0, 10);
    $("#latest").hidden = !items.length;
    $("#latestList").innerHTML = items.map(V.itemCard).join("");

    applyFilter();
    V.reveal();
  }
  V.ready(render);
  V.reveal();
  $("#year") && ($("#year").textContent = new Date().getFullYear());
})();
