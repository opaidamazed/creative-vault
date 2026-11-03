/* ==========================================================
   Creative Vault — App logic (يقرأ كل شيء من config.js)
   ========================================================== */
(function () {
  "use strict";
  const C = window.VAULT_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#i-${id}"/></svg>`;
  const esc = (t) => String(t).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const isReal = (u) => u && u !== "#";

  /* ---------- Hero slider ---------- */
  const slidesEl = $("#slides"), dotsEl = $("#dots"), slider = $("#slider");
  let cur = 0, timer = null;
  const n = C.banners.length;

  slidesEl.innerHTML = C.banners.map((b, i) =>
    `<div class="slide"><img src="${esc(b.image)}" alt="${esc(b.alt)}" ${i ? 'loading="lazy"' : ""} draggable="false"></div>`).join("");
  dotsEl.innerHTML = C.banners.map((_, i) => `<button class="dot" aria-label="بنر ${i + 1}" data-i="${i}"></button>`).join("");

  function go(i) {
    cur = (i + n) % n;
    slidesEl.style.transform = `translateX(${-cur * 100}%)`;
    $$(".dot").forEach((d, k) => d.classList.toggle("on", k === cur));
  }
  function play() { stop(); if (n > 1) timer = setInterval(() => go(cur + 1), C.bannerIntervalMs || 5000); }
  function stop() { clearInterval(timer); }

  // في RTL السهم اليمين = السابق، واليسار = التالي (زي ما في التصميم)
  $("#prevBtn").addEventListener("click", () => { go(cur - 1); play(); });
  $("#nextBtn").addEventListener("click", () => { go(cur + 1); play(); });
  dotsEl.addEventListener("click", (e) => { const d = e.target.closest(".dot"); if (d) { go(+d.dataset.i); play(); } });
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", play);

  // سحب باللمس / الماوس
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

  /* ---------- Libraries ---------- */
  $("#libGrid").innerHTML = C.libraries.map((l) => `
    <article class="lib-card reveal ${l.featured ? "featured" : ""}" data-search="${esc(l.title + " " + l.desc)}">
      ${l.featured && l.badge ? `<span class="badge">${esc(l.badge)} ${icon("fire")}</span>` : ""}
      <img class="lib-icon" src="${esc(l.icon)}" alt="" loading="lazy">
      <h3>${esc(l.title)}</h3>
      <p>${esc(l.desc)}</p>
      <div class="meta">
        <span>${icon("file")}${esc(l.count)} ${esc(l.countLabel)}</span>
        <span>${icon("disk")}${esc(l.size)}</span>
      </div>
      <a class="btn btn-green dl" href="${esc(l.url)}" ${isReal(l.url) ? 'target="_blank" rel="noopener"' : ""} data-id="${esc(l.id)}">
        ${icon("down")}${esc(l.buttonText)}
      </a>
    </article>`).join("");

  /* ---------- Latest ---------- */
  $("#latestList").innerHTML = C.latest.map((x) => `
    <a class="l-card reveal" href="${esc(x.url)}" ${isReal(x.url) ? 'target="_blank" rel="noopener"' : ""} data-search="${esc(x.title)}">
      <div class="l-thumb">
        ${x.thumb ? `<img src="${esc(x.thumb)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        ${x.isNew ? '<span class="new-tag">NEW</span>' : ""}
      </div>
      <div class="l-body">
        <h4>${esc(x.title)}</h4>
        <div class="sz">${icon("file")}<span>${esc(x.size)}</span></div>
      </div>
    </a>`).join("");

  const car = $("#latestList");
  const step = () => (car.querySelector(".l-card")?.offsetWidth || 260) + 18;
  // RTL: scrollLeft سالب في المتصفحات الحديثة، فنستخدم scrollBy
  $("#cPrev").addEventListener("click", () => car.scrollBy({ left: step() }));
  $("#cNext").addEventListener("click", () => car.scrollBy({ left: -step() }));

  /* ---------- Features ---------- */
  $("#features").innerHTML = C.features.map((f) => `
    <div class="feat reveal">${icon(f.icon)}<strong>${esc(f.title)}</strong><small>${esc(f.sub)}</small></div>`).join("");

  /* ---------- About banner / social / contact ---------- */
  $("#aboutImg").src = C.aboutBanner;
  const aboutMore = $("#aboutMore");
  aboutMore.href = C.aboutUrl || "#";
  $$("[data-social]").forEach((a) => { a.href = C.social[a.dataset.social] || "#"; });
  ["#contactLink", "#contactLink2"].forEach((s) => {
    const a = $(s); if (!a) return;
    a.href = C.contactUrl || "#";
    if (isReal(C.contactUrl)) { a.target = "_blank"; a.rel = "noopener"; }
  });

  /* ---------- Search ---------- */
  const input = $("#searchInput");
  const norm = (s) => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
  function filter() {
    const q = norm(input.value.trim());
    let shown = 0;
    $$("[data-search]").forEach((el) => {
      const ok = !q || norm(el.dataset.search).includes(q);
      el.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    $("#noResults").hidden = shown > 0;
  }
  input.addEventListener("input", filter);
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault(); filter();
    $("#libraries").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menuBtn"), nav = $("#mainNav");
  const setMenu = (open) => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---------- Active nav on scroll ---------- */
  const secs = [["#top", "الرئيسية"], ["#libraries", "المكتبة"], ["#latest", "أحدث الإضافات"], ["#about", "حول الموقع"]];
  const links = $$(".nav-link");
  const spy = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = "#" + en.target.id;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  [$(".hero"), ...secs.slice(1).map(([s]) => $(s))].forEach((el, i) => { if (el) { if (i === 0) el.id = "heroSec"; spy.observe(el); } });
  // الهيرو = الرئيسية
  new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#top"));
  }), { rootMargin: "-45% 0px -50% 0px" }).observe($(".hero"));

  /* ---------- Reveal on scroll ---------- */
  const rv = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + "ms"; rv.observe(el); });

  /* ---------- Misc ---------- */
  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();
})();
