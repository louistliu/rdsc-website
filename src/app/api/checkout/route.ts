import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { ticketTiers } from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid data" },
        { status: 400 }
      );
    }

    const priceIds = items.map((item: any) => item.priceId);

    const dbTiers = await db
      .select()
      .from(ticketTiers)
      .where(inArray(ticketTiers.stripePriceId, priceIds));

    for (const item of items) {
      const dbTier = dbTiers.find((t) => t.stripePriceId === item.priceId);
      
      if (!dbTier) {
        return NextResponse.json(
          { error: `Invalid ticket selected: ${item.priceId}` },
          { status: 400 }
        );
      }
      
      const remaining = Math.max(0, dbTier.capacity - dbTier.ticketsSold);
      if (item.quantity > remaining) {
        return NextResponse.json(
          { error: `Insufficient capacity for ${dbTier.name}. Only ${remaining} tickets left.` },
          { status: 400 }
        );
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const referer = req.headers.get("referer") || `${origin}/find-your-table`;

    const line_items = items.map((item: any) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: referer,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
