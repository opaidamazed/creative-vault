/* ==========================================================
   Creative Vault — صفحة المكتبة (بحث + تصنيفات + ترتيب)
   ========================================================== */
(function () {
  "use strict";
  const V = window.Vault, C = window.VAULT_CONFIG;
  const { $, $$, norm, CATS } = V;

  const params = new URLSearchParams(location.search);
  const st = { q: params.get("q") || "", cat: params.get("cat") || "all", sort: "new", libs: [], items: [] };
  const catOf = (x) => (CATS[x.category] ? x.category : "other");

  const input = $("#searchInput");
  if (input) input.value = st.q;
  $("#sizeNote").textContent = C.sizeNote || "";

  function render() {
    const q = norm(st.q.trim());

    // المكتبات الأساسية
    const libs = st.libs.filter((l) => !q || norm(l.title + " " + (l.desc || "")).includes(q));
    $("#libGrid").innerHTML = libs.map(V.libCard).join("");
    $("#libraries").hidden = !libs.length;

    // التصنيفات (بتظهر اللي فيها عناصر بس)
    const counts = {};
    st.items.forEach((x) => { const c = catOf(x); counts[c] = (counts[c] || 0) + 1; });
    if (st.cat !== "all" && !counts[st.cat]) st.cat = "all";
    const chips = [["all", "الكل", st.items.length], ...Object.keys(CATS).filter((k) => counts[k]).map((k) => [k, CATS[k], counts[k]])];
    $("#chips").innerHTML = chips.map(([k, t, n]) => `<button class="chip${st.cat === k ? " on" : ""}" data-cat="${k}">${t} <small>${n}</small></button>`).join("");

    // العناصر
    let list = st.items.filter((x) =>
      (st.cat === "all" || catOf(x) === st.cat) &&
      (!q || norm(x.title + " " + (CATS[x.category] || "")).includes(q)));
    if (st.sort === "popular") list.sort((a, b) => (+b.downloads || 0) - (+a.downloads || 0));
    else if (st.sort === "name") list.sort((a, b) => String(a.title).localeCompare(String(b.title), "ar"));
    else list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    $("#itemsGrid").innerHTML = list.map(V.itemCard).join("");
    const empty = $("#emptyMsg");
    if (!list.length) {
      empty.hidden = false;
      empty.textContent = st.items.length
        ? "مفيش نتائج مطابقة للبحث."
        : "لسه مفيش إضافات تانية — أول ما تنزل ملحقات جديدة هتلاقيها هنا.";
    } else empty.hidden = true;
    // بحث ملوش نتيجة في الإضافات بس له نتيجة في المكتبات: نخفي قسم الإضافات
    $("#results").hidden = !!q && !list.length && libs.length > 0;
    V.reveal();
  }

  $("#chips").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) { st.cat = b.dataset.cat; render(); } });
  $("#sortSel").addEventListener("change", (e) => { st.sort = e.target.value; render(); });
  V.onSearch = (v) => { st.q = v; render(); };

  V.ready((data) => { st.libs = data.libraries || []; st.items = data.latest || []; render(); });
})();
