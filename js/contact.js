/* ==========================================================
   Creative Vault — صفحة تواصل معنا
   الرسالة بتتبعت عن طريق خدمة FormSubmit (من غير سيرفر) وبتوصل على الإيميل.
   أول رسالة بعد النشر بتبعت لإيميلك رسالة تفعيل — اضغط Activate مرة واحدة بس.
   ========================================================== */
(function () {
  "use strict";
  const V = window.Vault, C = window.VAULT_CONFIG || {};
  const { $, $$ } = V;

  const email = (C.contact && C.contact.email) || "obaidamazed@gmail.com";
  const ENDPOINT = "https://formsubmit.co/ajax/" + email;
  const COOLDOWN_MS = 60000, KEY = "vault_last_msg";

  $$("[data-email]").forEach((el) => { el.textContent = email; });
  $$("[data-mailto]").forEach((el) => { el.href = "mailto:" + email; });

  const form = $("#contactForm"), btn = $("#sendBtn"), msg = $("#formMsg");
  const btnLabel = btn.textContent;
  const f = form.elements;

  const show = (type, text) => { msg.hidden = false; msg.className = "form-msg " + type; msg.textContent = text; };
  const lastSent = () => { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } };
  const markSent = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) { /* تجاهل */ } };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (f._honey.value) return; // بوت

    const name = f["name"].value.trim(), mail = f["email"].value.trim();
    const subject = f["subject"].value, message = f["message"].value.trim();

    if (name.length < 2) return show("err", "اكتب اسمك من فضلك.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return show("err", "اكتب إيميل صحيح عشان أقدر أرد عليك.");
    if (message.length < 10) return show("err", "الرسالة قصيرة جداً، اكتب تفاصيل أكتر شوية.");
    if (Date.now() - lastSent() < COOLDOWN_MS) return show("err", "استنى دقيقة قبل ما تبعت رسالة تانية.");

    btn.disabled = true; btn.textContent = "جاري الإرسال...";
    msg.hidden = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: name, email: mail, subject: subject, message: message,
          _subject: "رسالة جديدة من Creative Vault: " + subject,
          _template: "table", _captcha: "false"
        }),
        signal: ctrl.signal
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !(data.success === true || data.success === "true")) throw new Error(data.message || "send failed");
      markSent();
      form.reset();
      show("ok", "وصلت رسالتك ✔ هرد عليك على إيميلك في أقرب وقت.");
    } catch (err) {
      show("err", "تعذّر الإرسال حالياً. جرّب تاني بعد شوية، أو ابعتلي على " + email + " مباشرة.");
    } finally {
      clearTimeout(timer);
      btn.disabled = false; btn.textContent = btnLabel;
    }
  });

  /* السوشيال واللينك الإضافي: بيظهروا بس لو متحطين */
  V.ready(() => {
    $$(".soc a[data-social]").forEach((a) => { if (a.getAttribute("href") === "#") a.hidden = true; });
    if (!$$(".soc a[data-social]:not([hidden])").length) $("#socBox").hidden = true;
    if (V.isReal(V.contactUrl)) {
      const x = $("#extraContact");
      x.href = V.safeUrl(V.contactUrl);
      x.hidden = false;
    }
  });
})();
