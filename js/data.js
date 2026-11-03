/* ==========================================================
   Creative Vault — طبقة البيانات
   - لو Firebase متفعل: بيقرأ المكتبات والإضافات والإعدادات من Firestore
   - لو لأ (أو حصل عطل): بيستخدم config.js
   - بيحفظ نسخة في localStorage عشان الصفحة تظهر فوراً
   ========================================================== */
(function () {
  "use strict";
  const C = window.VAULT_CONFIG || {};
  const FC = window.FIREBASE_CONFIG || {};
  const configured = !!FC.apiKey && !/^YOUR_/i.test(FC.apiKey);

  let db = null, auth = null;
  if (configured && window.firebase) {
    try {
      firebase.initializeApp(FC);
      db = firebase.firestore();
      auth = typeof firebase.auth === "function" ? firebase.auth() : null;
    } catch (e) {
      console.warn("Firebase init failed:", e);
      db = null;
    }
  }

  const CACHE_KEY = "vault_cache_v1";
  const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; } };
  const writeCache = (d) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) { /* مساحة ممتلئة */ } };

  function fallback() {
    return {
      libraries: (C.libraries || []).map((l, i) => ({ downloads: 0, ...l, order: l.order != null ? l.order : i }))
        .sort((a, b) => a.order - b.order),
      latest: (C.latest || []).map((x) => ({ downloads: 0, createdAt: 0, ...x })),
      settings: {}
    };
  }

  /* cb(data, isFresh) — بيتنادى مرتين: بالنسخة المخزنة فوراً، وبعدين بالبيانات الحديثة */
  async function load(cb) {
    cb(db ? (readCache() || fallback()) : fallback(), false);
    if (!db) return;
    try {
      const [libs, lat, set] = await Promise.all([
        db.collection("libraries").orderBy("order").get(),
        db.collection("latest").orderBy("createdAt", "desc").get(),
        db.collection("settings").doc("site").get()
      ]);
      const data = {
        libraries: libs.docs.map((d) => ({ id: d.id, ...d.data() })),
        latest: lat.docs.map((d) => {
          const v = d.data();
          return { id: d.id, ...v, createdAt: (v.createdAt && v.createdAt.toMillis) ? v.createdAt.toMillis() : 0 };
        }),
        settings: set.exists ? set.data() : {}
      };
      if (!data.libraries.length) data.libraries = fallback().libraries; // قبل أول استيراد من اللوحة
      writeCache(data);
      cb(data, true);
    } catch (e) {
      console.warn("Firestore load failed, using fallback:", e);
    }
  }

  /* عدّاد التحميل: مرة واحدة لكل عنصر في الجلسة الواحدة */
  function track(col, id) {
    if (!db || !id) return;
    const k = "dl_" + col + "_" + id;
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch (e) { /* تجاهل */ }
    db.collection(col).doc(id)
      .update({ downloads: firebase.firestore.FieldValue.increment(1) })
      .catch(() => { /* العنصر مش موجود في Firestore — عادي */ });
  }

  window.VaultData = { enabled: !!db, db, auth, load, track, fallback };
})();
