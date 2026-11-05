const ALLOWED_ORIGIN = "https://opaidamazed.github.io";
const SUBJECTS = new Set([
  "اقتراح أو فكرة",
  "مشكلة في التحميل",
  "طلب ملحق جديد",
  "تعاون / شغل",
  "أخرى"
]);

function json(data, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin"
  };
  if (origin === ALLOWED_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function cleanSingleLine(value, max) {
  return String(value || "").replace(/[\\r\\n\\t]+/g, " ").trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (origin !== ALLOWED_ORIGIN) {
      return json({ success: false, error: "origin_not_allowed" }, 403, "");
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") {
      return json({ success: false, error: "method_not_allowed" }, 405, origin);
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ success: false, error: "invalid_content_type" }, 415, origin);
    }

    const length = Number(request.headers.get("Content-Length") || 0);
    if (length > 12000) {
      return json({ success: false, error: "payload_too_large" }, 413, origin);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ success: false, error: "invalid_json" }, 400, origin);
    }

    // Honeypot: silently accept bot submissions without forwarding them.
    if (String(data?._honey || "").trim()) {
      return json({ success: true }, 200, origin);
    }

    const name = cleanSingleLine(data?.name, 80);
    const email = cleanSingleLine(data?.email, 120);
    const subject = cleanSingleLine(data?.subject, 80);
    const message = String(data?.message || "").trim();

    if (name.length < 2 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email) ||
        !SUBJECTS.has(subject) || message.length < 10 || message.length > 2000) {
      return json({ success: false, error: "invalid_form_data" }, 400, origin);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return json({ success: false, error: "service_not_configured" }, 503, origin);
    }

    // Approximate per-IP protection. Cloudflare applies counters per edge location.
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success: allowed } = await env.CONTACT_LIMITER.limit({
      key: "contact:" + ip
    });
    if (!allowed) {
      return json({ success: false, error: "rate_limited" }, 429, origin);
    }

    const receivedAt = new Date().toISOString();
    const text = [
      "📩 رسالة جديدة من Creative Vault",
      "",
      "👤 الاسم: " + name,
      "📧 الإيميل: " + email,
      "📌 الموضوع: " + subject,
      "",
      "💬 الرسالة:",
      message,
      "",
      "🕒 وقت الاستلام: " + receivedAt
    ].join("\\n");

    try {
      const telegramResponse = await fetch(
        "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            disable_web_page_preview: true
          })
        }
      );

      const telegramData = await telegramResponse.json().catch(() => null);
      if (!telegramResponse.ok || !telegramData?.ok) {
        // Do not log or return Telegram's response: it may contain sensitive context.
        return json({ success: false, error: "telegram_delivery_failed" }, 502, origin);
      }

      return json({ success: true }, 200, origin);
    } catch {
      return json({ success: false, error: "delivery_unavailable" }, 502, origin);
    }
  }
};
