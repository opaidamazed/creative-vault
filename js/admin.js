/* ==========================================================
   Creative Vault — لوحة التحكم (Firebase Auth بجوجل + Firestore)
   الحماية الحقيقية في firestore.rules، مش في الصفحة دي.
   ========================================================== */
(function () {
  "use strict";
  const V = window.Vault, D = window.VaultData, C = window.VAULT_CONFIG;
  const { $, $$, esc, fmt, CATS, safeImg } = V;

  const toast = (m, bad) => {
    const t = $("#toast");
    t.textContent = m; t.classList.toggle("bad", !!bad); t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 3600);
  };
  const permMsg = (e) => (e && e.code === "permission-denied")
    ? "مفيش صلاحية: تأكد إن إيميلك مكتوب في firestore.rules وإنك سجّلت دخول بنفس الحساب."
    : "حصل خطأ: " + ((e && e.message) || e);

  if (!D.enabled || !D.auth) { $("#loginView").hidden = true; $("#setupMsg").hidden = false; return; }
  const db = D.db, auth = D.auth;

  let libs = [], items = [], settings = {};
  let libsView = "list";
  try { libsView = localStorage.getItem("vault_admin_libs_view") === "grid" ? "grid" : "list"; } catch (e) { /* storage may be unavailable */ }
  const libsViewToggle = $("#libsViewToggle");
  function syncLibsViewToggle() {
    if (!libsViewToggle) return;
    const grid = libsView === "grid";
    libsViewToggle.setAttribute("aria-pressed", String(grid));
    libsViewToggle.setAttribute("aria-label", grid ? "التبديل إلى عرض القائمة" : "التبديل إلى عرض البطاقات");
    libsViewToggle.title = grid ? "عرض القائمة" : "عرض البطاقات";
    libsViewToggle.querySelector(".adm-view-icon").textContent = grid ? "☷" : "▦";
    libsViewToggle.querySelector(".adm-view-label").textContent = grid ? "عرض القائمة" : "عرض شبكي";
    $("#libsList").classList.toggle("is-grid", grid);
  }
  libsViewToggle.addEventListener("click", () => {
    libsView = libsView === "list" ? "grid" : "list";
    try { localStorage.setItem("vault_admin_libs_view", libsView); } catch (e) { /* storage may be unavailable */ }
    syncLibsViewToggle();
  });
  syncLibsViewToggle();

  /* ---------- Auth ---------- */
  auth.onAuthStateChanged((u) => {
    $("#loginView").hidden = !!u;
    $("#appView").hidden = !u;
    if (u) { $("#who").textContent = u.email || ""; reload(); }
  });
  $("#loginBtn").addEventListener("click", async () => {
    const err = $("#loginErr"); err.hidden = true;
    try { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
    catch (e) {
      err.hidden = false;
      err.textContent = e.code === "auth/unauthorized-domain"
        ? "الدومين ده مش مضاف في Firebase ← Authentication ← Settings ← Authorized domains."
        : "فشل تسجيل الدخول: " + (e.message || e.code);
    }
  });
  $("#logoutBtn").addEventListener("click", () => auth.signOut());

  /* ---------- Tabs ---------- */
  $$(".tab").forEach((b) => b.addEventListener("click", () => {
    $$(".tab").forEach((x) => x.classList.toggle("on", x === b));
    ["libs", "items", "settings"].forEach((k) => { $("#tab-" + k).hidden = k !== b.dataset.tab; });
  }));

  /* ---------- Load + render ---------- */
  async function reload() {
    try {
      const [a, b, c] = await Promise.all([
        db.collection("libraries").orderBy("order").get(),
        db.collection("latest").orderBy("createdAt", "desc").get(),
        db.collection("settings").doc("site").get()
      ]);
      libs = a.docs.map((d) => ({ id: d.id, ...d.data() }));
      items = b.docs.map((d) => { const v = d.data(); return { id: d.id, ...v, createdAt: v.createdAt && v.createdAt.toMillis ? v.createdAt.toMillis() : 0 }; });
      settings = c.exists ? c.data() : {};
      try { localStorage.removeItem("vault_cache_v1"); } catch (e) { /* تجاهل */ }
      render();
    } catch (e) { toast(permMsg(e), true); }
  }

  const pic = (src, ph) => `<div class="pic">${src ? `<img src="${esc(safeImg(src))}" alt="" onerror="this.remove()">` : (ph || "")}</div>`;

  function render() {
    $("#statLibs").textContent = fmt(libs.length);
    $("#statItems").textContent = fmt(items.length);
    $("#statDownloads").textContent = fmt([...libs, ...items].reduce((sum, x) => sum + (Number(x.downloads) || 0), 0));
    $("#libsList").classList.toggle("is-grid", libsView === "grid");
    $("#libsList").innerHTML = libs.length ? libs.map((l) => `
      <div class="row">${pic(l.icon)}
        <div><h4>${esc(l.title)}</h4>
          <small>${esc(l.count)} ${esc(l.countLabel)} · ${esc(l.size)}</small>
          <div class="tags">${l.featured ? '<span class="tag g">مميز</span>' : ""}<span class="tag">ترتيب ${+l.order || 0}</span><span class="tag">⬇ ${fmt(l.downloads)}</span></div></div>
        <div class="acts">
          <a class="btn-s" href="details?type=library&id=${encodeURIComponent(l.id)}" target="_blank" rel="noopener">معاينة</a><button class="btn-s" data-edit="lib" data-id="${esc(l.id)}" type="button">تعديل</button>
          <button class="btn-s" data-reset="libraries" data-id="${esc(l.id)}" type="button">تصفير العدّاد</button>
          <button class="btn-s danger" data-del="libraries" data-id="${esc(l.id)}" type="button">حذف</button>
        </div></div>`).join("") : '<div class="empty-row">مفيش مكتبات متخزنة.</div>';
    $("#seedBox").hidden = libs.length > 0;

    $("#itemsList").innerHTML = items.length ? items.map((x) => `
      <div class="row">${pic(x.thumb)}
        <div><h4>${esc(x.title)}</h4>
          <small>${esc(x.size || "")} ${x.category && CATS[x.category] ? "· " + esc(CATS[x.category]) : ""}</small>
          <div class="tags">${x.isNew ? '<span class="tag g">NEW</span>' : ""}<span class="tag">⬇ ${fmt(x.downloads)}</span></div></div>
        <div class="acts">
          <a class="btn-s" href="details?type=item&id=${encodeURIComponent(x.id)}" target="_blank" rel="noopener">معاينة</a><button class="btn-s" data-edit="item" data-id="${esc(x.id)}" type="button">تعديل</button>
          <button class="btn-s" data-reset="latest" data-id="${esc(x.id)}" type="button">تصفير العدّاد</button>
          <button class="btn-s danger" data-del="latest" data-id="${esc(x.id)}" type="button">حذف</button>
        </div></div>`).join("") : '<div class="empty-row">لسه مفيش إضافات. اضغط "+ إضافة ملحق" عشان تنزّل أول ملحق، وهيظهر في الموقع فوراً.</div>';

    const f = $("#settingsForm").elements, s = settings.social || {};
    const real = (u) => (u && u !== "#" ? u : "");
    f.contactUrl.value = real(settings.contactUrl);
    ["youtube", "facebook", "instagram", "telegram"].forEach((k) => { f[k].value = real(s[k]); });
  }

  /* ---------- Row actions ---------- */
  document.addEventListener("click", async (e) => {
    const add = e.target.closest("[data-add]");
    if (add) return openForm(add.dataset.add, null);
    const ed = e.target.closest("[data-edit]");
    if (ed) {
      const doc = (ed.dataset.edit === "lib" ? libs : items).find((x) => x.id === ed.dataset.id);
      return openForm(ed.dataset.edit, doc);
    }
    const del = e.target.closest("[data-del]");
    if (del && confirm("متأكد من الحذف؟ مش هتقدر ترجّعه.")) {
      try { await db.collection(del.dataset.del).doc(del.dataset.id).delete(); toast("اتحذف"); reload(); }
      catch (err) { toast(permMsg(err), true); }
    }
    const rs = e.target.closest("[data-reset]");
    if (rs && confirm("تصفير عدّاد التحميلات؟")) {
      try { await db.collection(rs.dataset.reset).doc(rs.dataset.id).update({ downloads: 0 }); toast("اتصفّر"); reload(); }
      catch (err) { toast(permMsg(err), true); }
    }
  });

  /* ---------- استيراد الافتراضي ---------- */
  $("#seedBtn").addEventListener("click", async () => {
    try {
      const batch = db.batch();
      (C.libraries || []).forEach((l, i) => {
        batch.set(db.collection("libraries").doc(l.id), { ...l, order: l.order != null ? l.order : i, downloads: 0, featured: !!l.featured, badge: l.badge || "" });
      });
      const clean = (u) => (u && u !== "#" ? u : "");
      const social = {};
      Object.keys(C.social || {}).forEach((k) => { social[k] = clean(C.social[k]); });
      batch.set(db.collection("settings").doc("site"), { contactUrl: clean(C.contactUrl), social }, { merge: true });
      await batch.commit();
      toast("تم الاستيراد ✔"); reload();
    } catch (e) { toast(permMsg(e), true); }
  });

  /* ---------- Settings ---------- */
  $("#settingsForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    try {
      await db.collection("settings").doc("site").set({
        contactUrl: f.contactUrl.value.trim(),
        social: { youtube: f.youtube.value.trim(), facebook: f.facebook.value.trim(), instagram: f.instagram.value.trim(), telegram: f.telegram.value.trim() }
      }, { merge: true });
      toast("اتحفظ ✔"); reload();
    } catch (err) { toast(permMsg(err), true); }
  });

  /* ---------- Dialog form ---------- */
  const dlg = $("#dlg"), form = $("#editForm");
  let editing = null, imgVal = "";

  function setPreview(src) {
    const p = $("#imgPrev");
    if (src) { p.src = safeImg(src); p.hidden = false; } else { p.removeAttribute("src"); p.hidden = true; }
  }

  function openForm(kind, doc) {
    editing = { kind, id: doc ? doc.id : null };
    form.reset();
    dlg.dataset.kind = kind;
    $("#dlgTitle").textContent = (doc ? "تعديل " : "إضافة ") + (kind === "lib" ? "مكتبة" : "ملحق");
    $("#imgLabel").textContent = kind === "lib" ? "الأيقونة" : "الصورة المصغّرة";
    $("#imgFile").value = "";
    const f = form.elements;
    const val = (n, v) => { f[n].value = v == null ? "" : v; };

    val("title", doc && doc.title); val("url", doc && doc.url); val("size", doc && doc.size);
    if (kind === "lib") {
      val("desc", doc ? doc.desc : ""); val("contents", Array.isArray(doc && doc.contents) ? doc.contents.join("\n") : (doc && doc.contents || "")); val("count", doc && doc.count);
      val("countLabel", doc ? doc.countLabel : "ملف"); val("buttonText", doc ? doc.buttonText : "");
      val("order", doc ? doc.order : libs.length); val("badge", doc && doc.badge);
      f.featured.checked = !!(doc && doc.featured);
    } else {
      val("desc", doc && doc.desc); val("contents", Array.isArray(doc && doc.contents) ? doc.contents.join("\n") : (doc && doc.contents || ""));
      val("category", doc ? doc.category : "sfx");
      f.isNew.checked = doc ? !!doc.isNew : true;
    }
    const img = kind === "lib" ? (doc && doc.icon) : (doc && doc.thumb);
    imgVal = img && /^data:/.test(img) ? img : "";
    f.imgText.value = img && !/^data:/.test(img) ? img : "";
    setPreview(img);
    dlg.showModal();
  }
  $("#cancelBtn").addEventListener("click", () => dlg.close());
  $("#imgClear").addEventListener("click", () => { imgVal = ""; form.elements.imgText.value = ""; $("#imgFile").value = ""; setPreview(""); });
  form.elements.imgText.addEventListener("input", (e) => { if (!imgVal) setPreview(e.target.value.trim()); });

  /* تصغير الصورة وتحويلها لـ data URL */
  function fileToDataURL(file, maxW, maxH) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        const r = Math.min(1, maxW / im.width, maxH / im.height);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.width * r)); c.height = Math.max(1, Math.round(im.height * r));
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        let out = c.toDataURL("image/webp", 0.82);
        if (!out.startsWith("data:image/webp")) out = c.toDataURL("image/jpeg", 0.82); // سفاري القديم
        res(out);
      };
      im.onerror = () => { URL.revokeObjectURL(url); rej(new Error("الصورة مش مفهومة")); };
      im.src = url;
    });
  }
  $("#imgFile").addEventListener("change", async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const [w, h] = editing.kind === "lib" ? [360, 360] : [640, 360];
      imgVal = await fileToDataURL(file, w, h);
      if (imgVal.length > 400000) throw new Error("الصورة كبيرة، جرّب صورة أصغر");
      form.elements.imgText.value = "";
      setPreview(imgVal);
    } catch (err) { imgVal = ""; toast(err.message, true); }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = form.elements, btn = $("#saveBtn");
    const img = imgVal || f.imgText.value.trim();
    btn.disabled = true;
    try {
      if (editing.kind === "lib") {
        const id = editing.id || ("lib_" + Date.now().toString(36));
        const data = {
          title: f.title.value.trim(), desc: f.desc.value.trim(), contents: f.contents.value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean), url: f.url.value.trim(), size: f.size.value.trim(),
          count: f.count.value.trim(), countLabel: f.countLabel.value.trim(), buttonText: f.buttonText.value.trim(),
          order: parseInt(f.order.value, 10) || 0, featured: f.featured.checked, badge: f.badge.value.trim(), icon: img
        };
        if (!editing.id) data.downloads = 0;
        await db.collection("libraries").doc(id).set(data, { merge: true });
      } else {
        const id = editing.id || ("it_" + Date.now().toString(36));
        const data = {
          title: f.title.value.trim(), desc: f.desc.value.trim(), contents: f.contents.value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean), url: f.url.value.trim(), size: f.size.value.trim(),
          category: f.category.value, isNew: f.isNew.checked, thumb: img
        };
        if (!editing.id) { data.downloads = 0; data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); }
        await db.collection("latest").doc(id).set(data, { merge: true });
      }
      dlg.close(); toast("اتحفظ ✔"); reload();
    } catch (err) { toast(permMsg(err), true); }
    finally { btn.disabled = false; }
  });
})();
