// /.netlify/functions/submission-created
// Triggered by Netlify on any Form submission.
// Sends a summary email to you + an auto-reply to the customer.
//
// ENV required:
//   RESEND_API_KEY
//   TO_EMAIL                      -> your inbox
//   FROM_EMAIL                    -> e.g., "CITEKS <contact@citeks.net>"
// Optional:
//   CC_EMAIL                      -> (if you want a CC on admin emails)

export async function handler(event) {
  try {
    const payload = JSON.parse(event.body || "{}").payload;
    if (!payload) return { statusCode: 400, body: "No payload" };

    const formName = payload.form_name || "";
    const allowed = ["contact", "brief-starter", "brief-growth", "brief-scale"];
    if (!allowed.includes(formName)) return { statusCode: 200, body: "Ignored form" };

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.TO_EMAIL;
    const FROM = process.env.FROM_EMAIL || "contact@citeks.net";
    const CC = process.env.CC_EMAIL;
    if (!RESEND_API_KEY || !TO || !FROM) {
      console.warn("Missing RESEND_API_KEY, TO_EMAIL, or FROM_EMAIL env vars.");
      return { statusCode: 500, body: "Email env vars not configured" };
    }

    const site = payload.site_url || "";
    const number = payload.number || "";
    const created = payload.created_at || "";
    const human = payload.human_fields || {};
    const data = payload.data || {};

    // Prefer human_fields (labelized), but merge any missing keys from raw data
    const merged = { ...data, ...human };

    // Build rows for admin summary (include all merged keys)
    const rows = Object.entries(merged)
      .filter(([k]) => k !== "form-name" && k !== "bot-field")
      .map(([k, v]) => `<tr><td style="padding:6px 10px;border:1px solid #eee;"><b>${escapeHtml(k)}</b></td><td style="padding:6px 10px;border:1px solid #eee;">${escapeHtml(String(v))}</td></tr>`)
      .join("");

    const adminTitle =
      formName === "contact"
        ? "New Contact submission"
        : `New ${formName.replace("brief-", "").toUpperCase()} Brief`;

    const adminHtml = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#0f172a;">
        <h2 style="margin:0 0 8px 0;">${adminTitle}</h2>
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
          Attachments (if any) are stored with the submission in Netlify Forms.<br/>
          Note: Netlify supports one file per field; we pre-declare up to 10.
        </p>
      </div>
    `;

    const adminSubject =
      formName === "contact"
        ? "CITEKS: New contact form"
        : `CITEKS: New ${formName.replace("brief-", "")} brief`;

    // --- Send admin summary ---
    await sendResend(RESEND_API_KEY, {
      from: FROM, to: [TO], cc: CC ? [CC] : undefined, subject: adminSubject, html: adminHtml,
    });

    // --- Auto-reply to customer (if email present) ---
    const customerEmail = merged.email && String(merged.email).trim();
    if (customerEmail) {
      const pkg = merged.package || formName.replace("brief-", "");
      const { subject, html } = pickCustomerTemplate(formName, pkg, FROM);
      await sendResend(RESEND_API_KEY, {
        from: FROM, to: [customerEmail], subject, html,
      });
    }

    return { statusCode: 200, body: "OK" };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: "Function error" };
  }
}

async function sendResend(API_KEY, { from, to, cc, subject, html }) {
  const body = { from, to, subject, html };
  if (cc && cc.length) body.cc = cc;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const txt = await r.text();
    console.error("Resend error:", txt);
    throw new Error("Resend send failed");
  }
}

function pickCustomerTemplate(formName, pkg, FROM) {
  const isBrief = formName.startsWith("brief-");
  const brand = "CITEKS";
  const sender = FROM.includes("<") ? FROM.split("<")[1].replace(">","").trim() : FROM;

  const variants = [
    {
      subject: isBrief
        ? `${brand}: Thanks — we received your ${pkg} brief`
        : `${brand}: Thanks — we received your message`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
          <p>Hi,</p>
          <p>Thanks for ${isBrief ? `sending your <b>${escapeHtml(String(pkg))}</b> brief` : "reaching out"}. We’ve received it and we’ll review now.</p>
          <p><b>Next steps</b><br/>
          • We’ll reply within one business day with any clarifying questions.<br/>
          • If you’ve already paid, we’ll confirm your slot and timeline.<br/>
          • Need to add assets? Just reply to this email or use the contact form.</p>
          <p>— ${brand}<br/>
          <a href="mailto:${sender}">${sender}</a></p>
        </div>
      `,
    },
    {
      subject: isBrief
        ? `${brand}: Your ${pkg} brief is in — here’s what happens next`
        : `${brand}: We’ve got your note — quick follow-up`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
          <p>Hi,</p>
          <p>We’ve received your ${isBrief ? `<b>${escapeHtml(String(pkg))}</b> brief` : "message"} and started a quick review.</p>
          <p>We’ll be back within one business day with:<br/>
          • Confirmation of scope & timeline<br/>
          • Any open questions<br/>
          • The immediate next step</p>
          <p>Talk soon,<br/>${brand}</p>
        </div>
      `,
    },
    {
      subject: isBrief
        ? `${brand}: Brief received — thank you`
        : `${brand}: Message received — thank you`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
          <p>Hi,</p>
          <p>Thanks for ${isBrief ? "submitting your brief" : "your message"} — appreciate the context.</p>
          <p>We’ll review and respond shortly.<br/>
          If anything changes on your end, just reply to this email.</p>
          <p>Best,<br/>${brand}</p>
        </div>
      `,
    }
  ];

  // simple rotation by timestamp
  const idx = Math.floor(Date.now() / 1000) % variants.length;
  return variants[idx];
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
