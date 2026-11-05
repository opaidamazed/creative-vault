/* Creative Vault — تفاصيل المكتبة أو الملحق */
(function () {
  "use strict";
  const V = window.Vault, D = window.VaultData, $ = V.$;
  const params = new URLSearchParams(location.search);
  const type = params.get("type") === "item" ? "item" : "library";
  const id = params.get("id") || "";
  const title = $("#detailTitle"), lead = $("#detailLead"), host = $("#detailContent");
  const esc = V.esc;
  const fmtContents = (value) => Array.isArray(value) ? value : String(value || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const notFound = () => {
    title.textContent = "المورد غير موجود";
    lead.textContent = "قد يكون الرابط غير صحيح أو تم حذف هذا المورد.";
    host.innerHTML = '<div class="detail-empty"><h2>لم نتمكن من العثور على هذا المورد</h2><a class="btn btn-green" href="library">العودة إلى المكتبة</a></div>';
  };
  function render(doc) {
    if (!doc) return notFound();
    const isLib = type === "library";
    const collection = isLib ? "libraries" : "latest";
    const image = isLib ? doc.icon : doc.thumb;
    const count = isLib ? [doc.count, doc.countLabel].filter(Boolean).join(" ") : "";
    const contents = fmtContents(doc.contents);
    const link = V.downloadAttrs(doc.url);
    title.textContent = doc.title || "معلومات المورد";
    lead.textContent = doc.desc || "كل التفاصيل التي تحتاج معرفتها قبل تحميل هذا المورد.";
    const meta = [
      doc.size ? '<span><b>الحجم</b><bdi dir="ltr">' + esc(doc.size) + '</bdi></span>' : "",
      count ? '<span><b>الملفات</b>' + esc(count) + '</span>' : "",
      doc.category && V.CATS[doc.category] ? '<span><b>التصنيف</b>' + esc(V.CATS[doc.category]) + '</span>' : "",
      typeof doc.downloads === "number" ? '<span><b>مرات التحميل</b>' + esc(V.fmt(doc.downloads)) + '</span>' : ""
    ].filter(Boolean).join("");
    host.innerHTML = `
      <article class="detail-card">
        <div class="detail-visual">${image ? '<img src="' + esc(V.safeImg(image)) + '" alt="' + esc(doc.title || "") + '">' : '<div class="detail-placeholder">' + V.icon("file") + '</div>'}</div>
        <div class="detail-info">
          <span class="detail-kicker">${isLib ? "مكتبة من Creative Vault" : "ملحق من Creative Vault"}</span>
          <h2>${esc(doc.title || "")}</h2>
          <p class="detail-description">${esc(doc.desc || "لم تتم إضافة وصف تفصيلي لهذا المورد بعد.")}</p>
          ${meta ? '<div class="detail-meta">' + meta + '</div>' : ""}
          <a class="btn btn-green detail-download" href="${esc(link.href)}" ${link.attrs} data-track="${collection}" data-id="${esc(id)}">${V.icon("down")}${esc(doc.buttonText || "تحميل " + (doc.title || "المورد"))}</a>
          <a class="btn btn-outline detail-back" href="library">${V.icon("chev-r")}العودة إلى المكتبة</a>
        </div>
      </article>
      <section class="contents-panel">
        <div class="eyebrow"><span>داخل المكتبة</span></div>
        <h2>محتويات ${isLib ? "المكتبة" : "الملحق"}</h2>
        ${contents.length ? '<ul class="contents-list">' + contents.map((item) => '<li>' + V.icon("check") + '<span>' + esc(item) + '</span></li>').join("") + '</ul>' : '<p class="contents-empty">سيتم إضافة تفاصيل المحتويات قريباً.</p>'}
      </section>`;
  }
  if (!id) { notFound(); return; }
  V.ready((data) => {
    const list = type === "library" ? (data.libraries || []) : (data.latest || []);
    render(list.find(x => String(x.id) === id));
  });
})();