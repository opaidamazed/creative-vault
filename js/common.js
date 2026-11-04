/* ==========================================================
   Creative Vault — المشترك بين الصفحات
   (الهيدر والفوتر والأيقونات والكروت والبحث والقائمة)
   ========================================================== */
(function () {
  "use strict";
  const C = window.VAULT_CONFIG || {};
  const D = window.VaultData;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const icon = (id) => `<svg class="i"><use href="#i-${id}"/></svg>`;
  const isReal = (u) => !!u && u !== "#";
  const safeUrl = (u) => (/^\s*(javascript|data|vbscript):/i.test(u || "") ? "#" : (u || "#"));
  const safeImg = (u) => (/^\s*(javascript|vbscript):/i.test(u || "") ? "" : (u || ""));

  /* ---------- لينكات التحميل: أكتر من لينك (كل واحد في سطر) + تحويل درايف للتحميل المباشر ---------- */
  const parseUrls = (u) => String(u == null ? "" : u).split(/[\s,]+/).filter(Boolean);
  const driveId = (u) => {
    const m = String(u).match(/drive\.google\.com\/(?:file\/d\/|open\?(?:[^#]*&)?id=|uc\?(?:[^#]*&)?id=)([\w-]{10,})/);
    return m ? m[1] : null;
  };
  const directUrl = (u) => {
    const id = driveId(u);
    return id ? `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t` : u;
  };
  /* بيرجّع href + attributes الزرار: لو كل اللينكات ملفات درايف بيبقى تحميل مباشر، غير كده بيفتح اللينك في تبويب جديد */
  const dlAttrs = (raw) => {
    const orig = parseUrls(raw).map(safeUrl).filter(isReal);
    if (!orig.length) return { href: "#", attrs: "" };
    if (orig.every(driveId)) {
      const urls = orig.map(directUrl);
      return { href: urls[0], attrs: `data-urls="${esc(urls.join(" "))}" data-orig="${esc(orig[0])}"` };
    }
    return { href: orig[0], attrs: 'target="_blank" rel="noopener"' };
  };
  const fmt = (n) => {
    n = +n || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  };
  const norm = (s) => String(s || "").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
  const CATS = { sfx: "مؤثرات صوتية", music: "موسيقى", video: "فيديو وخامات", design: "تصميم", other: "أخرى" };
  const page = document.body.dataset.page || "";

  const V = { $, $$, esc, icon, isReal, safeUrl, safeImg, fmt, norm, CATS, downloadAttrs: dlAttrs, onSearch: null, social: {}, contactUrl: "#" };
  window.Vault = V;

  /* ---------- SVG sprite ---------- */
  const S = (id, inner) => `<symbol id="i-${id}" viewBox="0 0 24 24">${inner}</symbol>`;
  const st = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    ${S("home", `<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" ${st}/>`)}
    ${S("grid", `<g ${st}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></g>`)}
    ${S("info", `<g ${st}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></g>`)}
    ${S("mail", `<g ${st}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></g>`)}
    ${S("search", `<g ${st}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></g>`)}
    ${S("down", `<path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" ${st}/>`)}
    ${S("chev-l", `<path d="M15 5l-7 7 7 7" ${st}/>`)}
    ${S("chev-r", `<path d="M9 5l7 7-7 7" ${st}/>`)}
    ${S("up", `<path d="M12 19V6m0 0l-6 6m6-6l6 6" ${st}/>`)}
    ${S("file", `<g ${st}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/></g>`)}
    ${S("disk", `<g ${st}><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></g>`)}
    ${S("fire", `<path d="M12 2c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z" fill="currentColor"/>`)}
    ${S("headphones", `<g ${st}><path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></g>`)}
    ${S("bolt", `<path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="currentColor"/>`)}
    ${S("shield", `<g ${st}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/></g>`)}
    ${S("infinity", `<path d="M12 12c-2-3-3.5-4-5.5-4a4 4 0 000 8c2 0 3.5-1 5.5-4zm0 0c2 3 3.5 4 5.5 4a4 4 0 000-8c-2 0-3.5 1-5.5 4z" ${st}/>`)}
    ${S("thumb", `<path d="M7 11v9H4v-9zm0 0l4-8c1.5 0 2.5 1 2.5 2.5V9h5a2 2 0 012 2.3l-1 6.5A2 2 0 0117.5 19H7" fill="currentColor"/>`)}
    ${S("youtube", `<g ${st}><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></g>`)}
    ${S("facebook", `<path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" ${st}/>`)}
    ${S("instagram", `<g ${st}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/></g>`)}
    ${S("telegram", `<path d="M21 4L3 11l6 2 2 6 3-4 5 3z" ${st}/>`)}
    ${S("check", `<path d="M5 12.5l4.5 4.5L19 7.5" ${st}/>`)}
    ${S("edit", `<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" ${st}/>`)}
    ${S("trash", `<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" ${st}/>`)}
    ${S("plus", `<path d="M12 5v14M5 12h14" ${st}/>`)}
  </defs></svg>`;
  document.body.insertAdjacentHTML("afterbegin", sprite);

  /* ---------- Header / Footer ---------- */
  const hostH = $("#siteHeader"), hostF = $("#siteFooter");
  if (hostH) {
    const links = [["home", "index.html", "home", "الرئيسية"], ["library", "library.html", "grid", "المكتبة"],
                   ["about", "about.html", "info", "حول الموقع"], ["contact", "contact.html", "mail", "تواصل معنا"]];
    hostH.innerHTML = `
    <header class="site-header" id="top"><div class="container header-inner">
      <a href="index.html" class="brand" aria-label="Creative Vault">
        <img src="assets/logo.png" alt="" class="brand-logo" onerror="this.style.display='none'">
        <span class="brand-text"><span>Creative</span><span class="g">Vault</span></span>
      </a>
      <nav class="main-nav" id="mainNav" aria-label="القائمة الرئيسية">
        ${links.map(([k, h, ic, t]) => `<a href="${h}" class="nav-link${k === page ? " active" : ""}">${icon(ic)}${t}</a>`).join("")}
      </nav>
      <form class="search" id="searchForm" role="search">${icon("search")}
        <input type="search" id="searchInput" placeholder="ابحث في المكتبة..." autocomplete="off" aria-label="بحث">
      </form>
      <button class="menu-btn" id="menuBtn" aria-label="القائمة" aria-expanded="false"><span></span><span></span><span></span></button>
    </div></header>`;
  }
  if (hostF) {
    hostF.innerHTML = `
    <footer class="site-footer"><div class="container footer-inner">
      <div class="f-brand">
        <img src="assets/logo.png" alt="" class="brand-logo" onerror="this.style.display='none'">
        <div><div class="brand-text"><span>Creative</span><span class="g">Vault</span></div><small>Your Creative Resources Hub</small></div>
      </div>
      <nav class="f-links" aria-label="روابط الفوتر">
        <a href="index.html">الرئيسية</a><a href="library.html">المكتبة</a><a href="about.html">حول الموقع</a><a href="contact.html">تواصل معنا</a>
      </nav>
      <p class="copy">© ${new Date().getFullYear()} Creative Vault. جميع الحقوق محفوظة.</p>
      <button class="to-top" id="toTop" aria-label="للأعلى">${icon("up")}</button>
    </div></footer>`;
    $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menuBtn"), nav = $("#mainNav");
  if (menuBtn && nav) {
    const setMenu = (o) => { nav.classList.toggle("open", o); menuBtn.setAttribute("aria-expanded", o); };
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  }

  /* ---------- Search (الصفحة تحدد V.onSearch؛ غير كده بنروح صفحة المكتبة) ---------- */
  const input = $("#searchInput"), form = $("#searchForm");
  if (input && form) {
    input.addEventListener("input", () => { if (V.onSearch) V.onSearch(input.value); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (V.onSearch) {
        V.onSearch(input.value);
        const t = $("#libraries") || $("#results");
        if (t) t.scrollIntoView({ behavior: "smooth" });
      } else {
        location.href = "library.html?q=" + encodeURIComponent(input.value.trim());
      }
    });
  }

  /* ---------- Cards ---------- */
  const detailsUrl = (type, id) => `details.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
  V.libCard = (l) => {
    const dl = +l.downloads || 0;
    const link = dlAttrs(l.url);
    return `
    <article class="lib-card reveal ${l.featured ? "featured" : ""}" data-search="${esc((l.title || "") + " " + (l.desc || ""))}">
      ${l.featured && l.badge ? `<span class="badge">${esc(l.badge)} ${icon("fire")}</span>` : ""}
      <img class="lib-icon" src="${esc(safeImg(l.icon))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <h3>${esc(l.title)}</h3>
      <p>${esc(l.desc)}</p>
      <div class="meta">
        <span>${icon("file")}${esc(l.count)} ${esc(l.countLabel)}</span>
        <span>${icon("disk")}<bdi dir="ltr">${esc(l.size)}</bdi></span>
        ${dl > 0 ? `<span title="عدد مرات التحميل">${icon("down")}${fmt(dl)}</span>` : ""}
      </div>
      <a class="btn btn-green dl" href="${esc(link.href)}" ${link.attrs} data-track="libraries" data-id="${esc(l.id)}">
        ${icon("down")}${esc(l.buttonText || "تحميل")}
      </a>
      <a class="btn btn-outline details-btn" href="${detailsUrl("library", l.id)}">${icon("info")}معلومات عن المكتبة</a>
    </article>`;
  };

  V.itemCard = (x) => {
    const dl = +x.downloads || 0;
    const link = dlAttrs(x.url);
    const isNew = x.isNew || (x.createdAt && Date.now() - x.createdAt < 6048e5);
    const cat = CATS[x.category];
    return `
    <article class="l-card reveal" data-search="${esc((x.title || "") + " " + (cat || ""))}">
      <div class="l-thumb">
        ${x.thumb ? `<img src="${esc(safeImg(x.thumb))}" alt="" loading="lazy" onerror="this.remove()">` : `<span class="thumb-ph">${icon("headphones")}</span>`}
        ${isNew ? '<span class="new-tag">NEW</span>' : ""}
        ${cat ? `<span class="cat-tag">${esc(cat)}</span>` : ""}
      </div>
      <div class="l-body">
        <h4>${esc(x.title)}</h4>
        <div class="sz"><span class="dc">${dl > 0 ? icon("down") + " " + fmt(dl) : ""}</span><span class="sw">${icon("file")} <bdi dir="ltr">${esc(x.size || "")}</bdi></span></div>
        <a class="btn btn-green item-download" href="${esc(link.href)}" ${link.attrs} data-track="latest" data-id="${esc(x.id)}">${icon("down")}تحميل</a>
        <a class="btn btn-outline details-btn" href="${detailsUrl("item", x.id)}">${icon("info")}معلومات عن الملحق</a>
      </div>
    </article>`;
  };

  /* عدّاد التحميل */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-track]");
    if (a && D) D.track(a.dataset.track, a.dataset.id);
  });

  /* ---------- تحميل مباشر: بيبدأ من غير ما يفتح صفحة جوجل درايف، وبيدعم أكتر من ملف ---------- */
  let dlToast = null, dlTimer = null;
  function showDlToast(count, orig) {
    if (!dlToast) {
      dlToast = document.createElement("div");
      dlToast.className = "dl-toast";
      dlToast.setAttribute("role", "status");
      document.body.appendChild(dlToast);
    }
    dlToast.textContent = count > 1
      ? `بدأ تحميل ${count} ملفات... لو المتصفح سألك، اسمح بالتحميلات المتعددة.`
      : "بدأ التحميل... لو ما بدأش خلال ثواني ";
    if (count === 1) {
      const a = document.createElement("a");
      a.href = orig; a.target = "_blank"; a.rel = "noopener"; a.textContent = "افتح صفحة التحميل";
      dlToast.appendChild(a);
    }
    requestAnimationFrame(() => dlToast.classList.add("show"));
    clearTimeout(dlTimer);
    dlTimer = setTimeout(() => dlToast.classList.remove("show"), 10000);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-urls]");
    if (!a || e.button || e.ctrlKey || e.metaKey || e.shiftKey) return; // ctrl/كليك وسط: السلوك العادي
    e.preventDefault();
    const urls = a.dataset.urls.split(" ").filter(Boolean);
    urls.forEach((u, i) => setTimeout(() => {
      const f = document.createElement("iframe");
      f.style.display = "none"; f.src = u;
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 600000);
    }, i * 1500));
    showDlToast(urls.length, a.dataset.orig);
  });

  /* ---------- Reveal on scroll ---------- */
  const rv = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); }
  }), { threshold: 0.1 });
  V.reveal = () => $$(".reveal").forEach((el, i) => {
    if (el.dataset.rv) return;
    el.dataset.rv = "1";
    el.style.transitionDelay = (i % 5) * 70 + "ms";
    rv.observe(el);
  });

  /* ---------- تحميل البيانات + تطبيق الإعدادات (سوشيال / تواصل) ---------- */
  function applyLinks() {
    $$("[data-social]").forEach((a) => {
      const u = safeUrl(V.social[a.dataset.social]);
      a.href = u;
      if (isReal(u)) { a.target = "_blank"; a.rel = "noopener"; } else { a.removeAttribute("target"); }
    });
  }
  V.ready = (cb) => D.load((data) => {
    const s = data.settings || {};
    V.social = { ...(C.social || {}), ...(s.social || {}) };
    V.contactUrl = s.contactUrl || C.contactUrl || "#";
    applyLinks();
    cb && cb(data);
  });
})();
