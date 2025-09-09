// /.netlify/functions/session-status
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  try {
    const sessionId = new URLSearchParams(event.rawQuery || "").get("session_id");
    if (!sessionId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing session_id" }) };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "payment_intent.charges",
        "payment_intent.latest_charge",
        "line_items",
      ],
    });

    const piObj = typeof session.payment_intent === "string" ? null : session.payment_intent;
    const payment_intent_id = typeof session.payment_intent === "string"
      ? session.payment_intent
      : (piObj?.id || null);

    let charge_id = null;
    if (piObj?.latest_charge) {
      charge_id = typeof piObj.latest_charge === "string" ? piObj.latest_charge : piObj.latest_charge.id;
    }
    if (!charge_id && Array.isArray(piObj?.charges?.data) && piObj.charges.data[0]) {
      charge_id = piObj.charges.data[0].id;
    }

    // Optional derived total from line items (when amount_total not set)
    const line_items_total = (session.amount_total == null && session.line_items?.data?.length)
      ? session.line_items.data.reduce((sum, li) => sum + (li.amount_total || 0), 0)
      : null;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        payment_intent_id,
        charge_id,
        payment_intent_status: piObj?.status || null,
        amount_total: session.amount_total,
        line_items_total,
        currency: session.currency,
        metadata: session.metadata || {},
      }),
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to load session" }) };
  }
}
