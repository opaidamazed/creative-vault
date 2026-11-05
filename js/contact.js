/* ==========================================================
   Creative Vault — صفحة تواصل معنا
   إرسال الرسائل إلى Telegram عبر Cloudflare Worker آمن.
   ========================================================== */
(function () {
  "use strict";
  const V = window.Vault, C = window.VAULT_CONFIG || {};
  const { $, $$ } = V;

  const email = (C.contact && C.contact.email) || "obaidamazed@gmail.com";
  const ENDPOINT = "https://creative-vault-contact.creative-vault.workers.dev/contact";
  const COOLDOWN_MS = 60000, KEY = "vault_last_msg";

  // بيانات التواصل الجانبية تظل كما هي.
  $$( "[data-email]" ).forEach((el) => { el.textContent = email; });
  $$( "[data-mailto]" ).forEach((el) => { el.href = "mailto:" + email; });

  const form = $("#contactForm"), btn = $("#sendBtn"), msg = $("#formMsg");
  const btnLabel = btn.textContent;
  const f = form.elements;

  const show = (type, text) => {
    msg.hidden = false;
    msg.className = "form-msg " + type;
    msg.textContent = text;
  };
  const lastSent = () => { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } };
  const markSent = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) { /* تجاهل */ } };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (f._honey.value) return;

    const name = f["name"].value.trim();
    const mail = f["email"].value.trim();
    const subject = f["subject"].value;
    const message = f["message"].value.trim();

    if (name.length < 2) return show("err", "اكتب اسمك من فضلك.");
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(mail)) return show("err", "اكتب إيميل صحيح عشان أقدر أرد عليك.");
    if (message.length < 10) return show("err", "الرسالة قصيرة جداً، اكتب تفاصيل أكتر شوية.");
    if (Date.now() - lastSent() < COOLDOWN_MS) return show("err", "استنى دقيقة قبل ما تبعت رسالة تانية.");

    btn.disabled = true;
    btn.textContent = "جاري الإرسال...";
    msg.hidden = true;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: mail,
          subject,
          message,
          _honey: f._honey.value
        }),
        signal: ctrl.signal
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success !== true) {
        const err = new Error(data.error || ("HTTP " + res.status));
        err.code = data.error || "";
        throw err;
      }

      markSent();
      form.reset();
      show("ok", "وصلت رسالتك على تليجرام ✔ هرد عليك على الإيميل اللي كتبته في أقرب وقت.");
    } catch (err) {
      const text = err && err.code === "rate_limited"
        ? "وصلت لحد الإرسال المؤقت. استنى دقيقة وحاول تاني."
        : "تعذّر إرسال الرسالة حالياً. رسالتك ما زالت موجودة في الفورم؛ حاول تاني بعد شوية.";
      show("err", text);
    } finally {
      clearTimeout(timer);
      btn.disabled = false;
      btn.textContent = btnLabel;
    }
  });

  /* السوشيال واللينك الإضافي: بيظهروا بس لو متحطين */
  V.ready(() => {
    $$(".soc a[data-social]").forEach((a) => { if (a.getAttribute("href") === "#") a.hidden = true; });
    if (!$$( ".soc a[data-social]:not([hidden])" ).length) $("#socBox").hidden = true;
    if (V.isReal(V.contactUrl)) {
      const x = $("#extraContact");
      x.href = V.safeUrl(V.contactUrl);
      x.hidden = false;
    }
  });
})();
