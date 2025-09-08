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
      expand: ["payment_intent.latest_charge", "line_items.data.price"],
    });

    // Fallback totals
    let lineItemsTotal = null;
    if (session?.line_items?.data?.length) {
      lineItemsTotal = session.line_items.data.reduce((sum, li) => {
        const unit = li.price?.unit_amount || 0;
        const qty = li.quantity || 1;
        return sum + unit * qty;
      }, 0);
    }

    const chargeId = session?.payment_intent?.latest_charge?.id || null;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        payment_intent_id: session.payment_intent?.id || null,
        payment_intent_status: session.payment_intent?.status || null,
        charge_id: chargeId,
        amount_total: session.amount_total ?? null,
        line_items_total: lineItemsTotal,
        currency: session.currency,
        metadata: session.metadata || {},
      }),
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to load session" }) };
  }
}
