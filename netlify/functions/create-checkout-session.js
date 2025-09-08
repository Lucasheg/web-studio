// /.netlify/functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { slug, rush, origin, uiMode } = JSON.parse(event.body || "{}");

    const priceMap = {
      starter: rush ? process.env.PRICE_STARTER_RUSH : process.env.PRICE_STARTER_BASE,
      growth:  rush ? process.env.PRICE_GROWTH_RUSH  : process.env.PRICE_GROWTH_BASE,
      scale:   rush ? process.env.PRICE_SCALE_RUSH   : process.env.PRICE_SCALE_BASE,
    };

    const price = priceMap[slug];
    if (!price) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid package" }) };
    }

    const successUrl = `${origin || "https://example.com"}/#/thank-you?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl  = `${origin || "https://example.com"}/#/pay/${slug}`;

    // embedded vs hosted
    if (uiMode === "hosted") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { package: slug, rush: rush ? "true" : "false" },
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: session.url }),
      };
    } else {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        line_items: [{ price, quantity: 1 }],
        return_url: successUrl,
        metadata: { package: slug, rush: rush ? "true" : "false" },
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSecret: session.client_secret }),
      };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
}
