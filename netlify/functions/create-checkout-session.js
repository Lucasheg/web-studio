// ESM function (works with "type": "module")
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  const baseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: baseHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: baseHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // Sanity-check required env vars
  const required = [
    "STRIPE_SECRET_KEY",
    "PRICE_STARTER_BASE", "PRICE_STARTER_RUSH",
    "PRICE_GROWTH_BASE",  "PRICE_GROWTH_RUSH",
    "PRICE_SCALE_BASE",   "PRICE_SCALE_RUSH",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    return { statusCode: 500, headers: baseHeaders, body: JSON.stringify({ error: `Missing env vars: ${missing.join(", ")}` }) };
  }

  try {
    const { slug, rush, origin } = JSON.parse(event.body || "{}");

    const priceMap = {
      starter: rush ? process.env.PRICE_STARTER_RUSH : process.env.PRICE_STARTER_BASE,
      growth:  rush ? process.env.PRICE_GROWTH_RUSH  : process.env.PRICE_GROWTH_BASE,
      scale:   rush ? process.env.PRICE_SCALE_RUSH   : process.env.PRICE_SCALE_BASE,
    };

    const price = priceMap[slug];
    if (!price) {
      return { statusCode: 400, headers: baseHeaders, body: JSON.stringify({ error: "Invalid package" }) };
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      return_url: `${origin || "https://citeks.net"}/#/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    });

    return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ clientSecret: session.client_secret }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: baseHeaders, body: JSON.stringify({ error: err.message }) };
  }
}
