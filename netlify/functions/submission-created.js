// /.netlify/functions/submission-created
// Triggered automatically by Netlify on any Form submission.
// Sends a summary email using Resend's API.
// ENV required: RESEND_API_KEY, TO_EMAIL, FROM_EMAIL (e.g., "CITEKS <contact@citeks.net>")

export async function handler(event) {
  try {
    const payload = JSON.parse(event.body || "{}").payload;
    if (!payload) {
      return { statusCode: 400, body: "No payload" };
    }

    // Only react to forms we care about
    const formName = payload.form_name || "";
    const allowed = ["contact", "brief-starter", "brief-growth", "brief-scale"];
    if (!allowed.includes(formName)) {
      return { statusCode: 200, body: "Ignored form" };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.TO_EMAIL;
    const FROM = process.env.FROM_EMAIL || "contact@citeks.net";
    if (!RESEND_API_KEY || !TO || !FROM) {
      console.warn("Missing RESEND_API_KEY, TO_EMAIL, or FROM_EMAIL env vars.");
      return { statusCode: 500, body: "Email env vars not configured" };
    }

    const site = payload.site_url || "";
    const number = payload.number || "";
    const created = payload.created_at || "";
    const data = payload.data || {};            // raw fields
    const human = payload.human_fields || {};   // labeled fields

    // Build a simple HTML table of fields
    const rows = Object.entries(human).map(
      ([k, v]) => `<tr><td style="padding:6px 10px;border:1px solid #eee;"><b>${escapeHtml(k)}</b></td><td style="padding:6px 10px;border:1px solid #eee;">${escapeHtml(String(v))}</td></tr>`
    ).join("");

    const title =
      formName === "contact"
        ? "New Contact submission"
        : `New ${formName.replace("brief-", "").toUpperCase()} Brief`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#0f172a;">
        <h2 style="margin:0 0 8px 0;">${title}</h2>
        <div style="margin:0 0 8px 0;color:#475569;">
          <div><b>Form:</b> ${escapeHtml(formName)}</div>
          <div><b>Submission #:</b> ${escapeHtml(String(number))}</div>
          <div><b>Created:</b> ${escapeHtml(String(created))}</div>
          <div><b>Site:</b> ${escapeHtml(site)}</div>
        </div>
        <table style="border-collapse:collapse;border:1px solid #eee;">
          ${rows || `<tr><td style="padding:6px 10px;">(no readable fields)</td></tr>`}
        </table>
        <p style="color:#475569;margin-top:10px;">
          Attachments (if any) are stored with the submission in Netlify Forms.
        </p>
      </div>
    `;

    const subject =
      formName === "contact"
        ? "CITEKS: New contact form"
        : `CITEKS: New ${formName.replace("brief-", "")} brief`;

    // Send via Resend HTTP API (no extra package)
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject,
        html,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error("Resend error:", txt);
      return { statusCode: 502, body: "Failed to send email" };
    }

    return { statusCode: 200, body: "OK" };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: "Function error" };
  }
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
