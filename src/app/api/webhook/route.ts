import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { ticketTiers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      for (const item of lineItems.data) {
        if (item.price && item.price.id) {
          const quantity = item.quantity || 1;
          const stripePriceId = item.price.id;

          await db
            .update(ticketTiers)
            .set({ ticketsSold: sql`${ticketTiers.ticketsSold} + ${quantity}` })
            .where(eq(ticketTiers.stripePriceId, stripePriceId));
            
          console.log(`Successfully recorded sale of ${quantity} tickets for Stripe Price: ${stripePriceId}`);
        }
      }
    } catch (err: any) {
      console.error("Error processing checkout.session.completed event:", err);
      return NextResponse.json({ error: "Failed to update database capacity" }, { status: 500 });
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
