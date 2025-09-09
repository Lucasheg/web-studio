// /.netlify/functions/stripe-webhook.js
import Stripe from "stripe";

/**
 * ENV REQUIRED (Netlify → Site settings → Build & deploy → Environment):
 * - STRIPE_SECRET_KEY         (sk_test_... or sk_live_...)
 * - STRIPE_WEBHOOK_SECRET     (whsec_... for THIS endpoint + mode)
 * - RESEND_API_KEY
 * - FROM_EMAIL                e.g. "CITEKS <contact@citeks.net>"
 * - TO_EMAIL                  your admin inbox (gets an internal copy)
 */

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

  // Stripe signature header
  const sig =
    event.headers["stripe-signature"] ||
    event.headers["Stripe-Signature"] ||
    event.headers["STRIPE-SIGNATURE"];

  // IMPORTANT: use the raw body for signature verification
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
    // Ignore everything else
    return { statusCode: 200, body: "Ignored" };
  }

  try {
    const session = stripeEvent.data.object;

    // Retrieve the full session and expand PI+charges so we can compute a solid ID
    const sessionFull = await stripe.checkout.sessions.retrieve(session.id, {
      expand: [
        "payment_intent.charges",
        "payment_intent.latest_charge",
        "line_items",
      ],
    });

    // Metadata from your create session call
    const meta = sessionFull.metadata || {};
    const slug = String(meta.package || meta.slug || "").toLowerCase(); // "starter" | "growth" | "scale"
    const rushSelected = String(meta.rush || "").toLowerCase() === "true";

    // Package timelines (keep in sync with UI)
    const timelines = {
      starter: { days: 4, rushDays: 2, label: "Starter" },
      growth:  { days: 8, rushDays: 6, label: "Growth" },
      scale:   { days: 14, rushDays: 10, label: "Scale" },
    };
    const tl = timelines[slug] || { days: "—", rushDays: "—", label: slug || "Custom" };

    // Amount/currency
    const amount = typeof sessionFull.amount_total === "number"
      ? (sessionFull.amount_total / 100).toFixed(2)
      : null; // can be null for some flows
    const currency = (sessionFull.currency || "usd").toUpperCase();
    const amountString = amount != null ? `${amount} ${currency}` : `${currency}`;

    // Transaction ID fallback chain: PaymentIntent → Charge → Session (Order)
    const piObj = typeof sessionFull.payment_intent === "string"
      ? null
      : sessionFull.payment_intent;

    const paymentIntentId = typeof sessionFull.payment_intent === "string"
      ? sessionFull.payment_intent
      : (piObj?.id || null);

    let chargeId = null;
    if (piObj?.latest_charge) {
      chargeId = typeof piObj.latest_charge === "string"
        ? piObj.latest_charge
        : piObj.latest_charge.id;
    }
    if (!chargeId && Array.isArray(piObj?.charges?.data) && piObj.charges.data[0]) {
      chargeId = piObj.charges.data[0].id;
    }

    const hasCharge = !!(paymentIntentId || chargeId);
    const idLabel = hasCharge ? "Transaction ID" : "Order ID";
    const idValue = hasCharge ? (paymentIntentId || chargeId) : sessionFull.id; // cs_... when free/zero-total

    // Customer email (Stripe provides it reliably here)
    const customerEmail =
      sessionFull.customer_details?.email ||
      sessionFull.customer_email ||
      null;

    // Email infra
    const FROM = process.env.FROM_EMAIL || "contact@citeks.net";
    const TO = process.env.TO_EMAIL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY || !FROM || !TO) {
      console.error("Missing RESEND_API_KEY, FROM_EMAIL, or TO_EMAIL");
      return { statusCode: 500, body: "Email env missing" };
    }

    const rushText = rushSelected ? "rush selected" : "standard timeline";

    // -------- Customer email (Variant 1) --------
    if (customerEmail) {
      const subject = `CITEKS: Payment received — your ${tl.label} is locked in`;
      const html = `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
          <p>Hi,</p>
          <p>Thanks — your payment for <b>${escapeHtml(tl.label)}</b> (${escapeHtml(amountString)}) is confirmed.</p>
          <p><b>${escapeHtml(idLabel)}:</b> <b>${escapeHtml(idValue)}</b></p>
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

    // -------- Admin email (to you) --------
    const adminSubject = `CITEKS: Payment received — ${tl.label} (${amountString})`;
    const adminHtml = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.6;">
        <h2 style="margin:0 0 8px 0;">Payment received</h2>
        <p><b>Package:</b> ${escapeHtml(tl.label)} &nbsp; <b>Rush:</b> ${rushSelected ? "Yes" : "No"}</p>
        <p><b>Total:</b> ${escapeHtml(amountString)} &nbsp; <b>Currency:</b> ${escapeHtml(currency)}</p>
        <p><b>Payment Intent:</b> ${escapeHtml(paymentIntentId || "—")}<br/>
           <b>Charge:</b> ${escapeHtml(chargeId || "—")}<br/>
           <b>${escapeHtml(idLabel)}:</b> ${escapeHtml(idValue)}</p>
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

// ---------- helpers ----------

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
