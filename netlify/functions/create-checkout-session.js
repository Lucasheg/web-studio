// ESM version (works with "type": "module")
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { slug, rush, origin } = JSON.parse(event.body || "{}");

    const priceMap = {
      starter: rush ? process.env.PRICE_STARTER_RUSH : process.env.PRICE_STARTER_BASE,
      growth:  rush ? process.env.PRICE_GROWTH_RUSH  : process.env.PRICE_GROWTH_BASE,
      scale:   rush ? process.env.PRICE_SCALE_RUSH   : process.env.PRICE_SCALE_BASE
    };

    const price = priceMap[slug];
    if (!price) return { statusCode: 400, body: "Invalid package" };

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      return_url: `${origin || "https://citeks.net"}/#/thank-you?session_id={CHECKOUT_SESSION_ID}`
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientSecret: session.client_secret })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server Error" };
  }
}
