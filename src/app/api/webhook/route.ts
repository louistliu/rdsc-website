import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { ticketTiers, events } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Resend } from "resend";

function generateEmailHtml(eventData: Record<string, string>, purchasedTickets: { quantity: number; name: string }[]) {
  const ticketsListHtml = purchasedTickets
    .map((t) => `<li><strong>${t.quantity}x ${t.name}</strong></li>`)
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #d11212;">Red Dragon Social Club</h1>
      <h2>Thank you for your purchase!</h2>
      <p>Your order for <strong>${eventData.title}</strong> has been confirmed.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details</h3>
        <p><strong>Date:</strong> ${eventData.date}</p>
        <p><strong>Time:</strong> ${eventData.time}</p>
        <p><strong>Venue:</strong> ${eventData.venue}</p>
        <p><strong>Address:</strong> ${eventData.address}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Your Tickets</h3>
        <ul>
          ${ticketsListHtml}
        </ul>
      </div>
      
      <p>See you at the table!</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMsg}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMsg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      const purchasedTickets: { quantity: number; name: string }[] = [];
      let eventData: Record<string, string> | null = null;

      for (const item of lineItems.data) {
        if (item.price && item.price.id) {
          const quantity = item.quantity || 1;
          const stripePriceId = item.price.id;

          await db
            .update(ticketTiers)
            .set({ ticketsSold: sql`${ticketTiers.ticketsSold} + ${quantity}` })
            .where(eq(ticketTiers.stripePriceId, stripePriceId));
            
          const [tierInfo] = await db
            .select({
              tierName: ticketTiers.name,
              eventName: events.title,
              eventDate: events.date,
              eventTime: events.time,
              eventVenue: events.venue,
              eventAddress: events.address,
            })
            .from(ticketTiers)
            .innerJoin(events, eq(ticketTiers.eventId, events.id))
            .where(eq(ticketTiers.stripePriceId, stripePriceId));

          if (tierInfo) {
            if (!eventData) {
              eventData = {
                title: tierInfo.eventName,
                date: tierInfo.eventDate,
                time: tierInfo.eventTime,
                venue: tierInfo.eventVenue,
                address: tierInfo.eventAddress,
              };
            }
            purchasedTickets.push({ name: tierInfo.tierName, quantity });
          }
        }
      }

      const buyerEmail = session.customer_details?.email;
      if (eventData && purchasedTickets.length > 0 && buyerEmail && process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'Red Dragon Social Club <onboarding@resend.dev>',
            to: buyerEmail,
            subject: `Your Tickets: ${eventData.title}`,
            html: generateEmailHtml(eventData, purchasedTickets),
          });
          console.log(`Confirmation email sent to ${buyerEmail}`);
        } catch (emailErr) {
          console.error("Failed to send Resend email:", emailErr);
        }
      } else if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing in .env.local. Database updated, but email was skipped.");
      }

    } catch (err: unknown) {
      console.error("Error processing checkout.session.completed event:", err);
      return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
