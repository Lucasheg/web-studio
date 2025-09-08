// /.netlify/functions/stripe-webhook.js
import Stripe from "stripe";

// --- ENV needed ---
// STRIPE_SECRET_KEY         (already set)
// STRIPE_WEBHOOK_SECRET     <-- NEW (from Stripe dashboard for this endpoint)
// RESEND_API_KEY            (already set)
// FROM_EMAIL                (e.g., "CITEKS <contact@citeks.net>")
// TO_EMAIL                  (your inbox for admin copies)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return { statusCode: 500, body: "Webhook misconfigured" };
  }

  const sig =
    event.headers["stripe-signature"] ||
    event.headers["Stripe-Signature"] ||
    event.headers["STRIPE-SIGNATURE"];

  // Stripe needs the raw body (not parsed JSON)
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    // ignore other events
    return { statusCode: 200, body: "Ignored" };
  }

  try {
    const session = stripeEvent.data.object;

    // Retrieve expanded session to fetch PaymentIntent+Charge and line items
    const sessionFull = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["payment_intent.latest_charge", "line_items.data.price"],
    });

    const meta = sessionFull.metadata || {};
    const slug = String(meta.package || meta.slug || "").toLowerCase(); // "starter" | "growth" | "scale"
    const rushSelected = String(meta.rush || "").toLowerCase() === "true";

    // Timeline mapping based on your packages
    const timelines = {
      starter: { days: 4, rushDays: 2, label: "Starter" },
      growth: { days: 8, rushDays: 6, label: "Growth" },
      scale: { days: 14, rushDays: 10, label: "Scale" },
    };
    const tl = timelines[slug] || { days: "—", rushDays: "—", label: slug || "Custom" };

    const amount = typeof sessionFull.amount_total === "number"
      ? (sessionFull.amount_total / 100).toFixed(2)
      : null;
    const currency = (sessionFull.currency || "usd").toUpperCase();

    const pi = sessionFull.payment_intent;
    const chargeId = pi?.latest_charge?.id || null;
    const txId = pi?.id || chargeId || sessionFull.id; // PI → Charge → Session

    const customerEmail =
      sessionFull.customer_details?.email ||
      sessionFull.customer_email ||
      null;

    // Build text fragments
    const amountString = amount ? `${amount} ${currency}` : `${currency}`;
    const rushText = rushSelected ? "rush selected" : "standard timeline";

    // --- Emails ---
    const FROM = process.env.FROM_EMAIL || "contact@citeks.net";
    const TO = process.env.TO_EMAIL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY || !FROM || !TO) {
      console.error("Missing RESEND_API_KEY, FROM_EMAIL, or TO_EMAIL");
      return { statusCode: 500, body: "Email env missing" };
    }

    // 1) Customer — Variant 1
    if (customerEmail) {
      const subject = `CITEKS: Payment received — your ${tl.label} is locked in`;
      const html = `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
          <p>Hi,</p>
          <p>Thanks — your payment for <b>${escapeHtml(tl.label)}</b> (${escapeHtml(amountString)}) is confirmed. Your <b>Transaction ID</b> is <b>${escapeHtml(txId)}</b>.</p>
          <p><b>What happens next</b><br/>
          • We finalize your slot and share a brief kickoff note.<br/>
          • Timeline: <b>${escapeHtml(String(tl.days))} days</b> (${escapeHtml(rushText)}; rush timeline: <b>${escapeHtml(String(tl.rushDays))} days</b>).<br/>
          • If you need to add assets or context, just reply to this email.</p>
          <p>We’re excited to get started.</p>
          <p>— CITEKS<br/>
          <a href="mailto:${FROM.includes("<") ? escapeHtml(FROM.split("<")[1].replace(">","").trim()) : escapeHtml(FROM)}">
            ${FROM.includes("<") ? escapeHtml(FROM.split("<")[1].replace(">","").trim()) : escapeHtml(FROM)}
          </a></p>
        </div>
      `;
      await sendResend(RESEND_API_KEY, { from: FROM, to: [customerEmail], subject, html });
    }

    // 2) Admin copy (to you)
    const adminSubject = `CITEKS: Payment received — ${tl.label} (${amountString})`;
    const adminHtml = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
        <h2 style="margin:0 0 8px 0;">Payment received</h2>
        <p><b>Package:</b> ${escapeHtml(tl.label)} &nbsp; <b>Rush:</b> ${rushSelected ? "Yes" : "No"}</p>
        <p><b>Total:</b> ${escapeHtml(amountString)} &nbsp; <b>Currency:</b> ${escapeHtml(currency)}</p>
        <p><b>Transaction ID:</b> ${escapeHtml(txId)}</p>
        <p><b>Customer email (Stripe):</b> ${escapeHtml(customerEmail || "—")}</p>
        <p><b>Timelines:</b> ${escapeHtml(String(tl.days))} days (rush ${escapeHtml(String(tl.rushDays))} days)</p>
        <p style="color:#475569;">Source: checkout.session.completed</p>
      </div>
    `;
    await sendResend(RESEND_API_KEY, { from: FROM, to: [TO], subject: adminSubject, html: adminHtml });

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("Webhook handler error:", err);
    return { statusCode: 500, body: "Webhook handler error" };
  }
}

async function sendResend(API_KEY, { from, to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("Resend send failed:", txt);
    throw new Error("Resend send failed");
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
