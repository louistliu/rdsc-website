"use server";

import { db } from "@/db";
import { events, ticketTiers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

export type EventFormData = {
  title: string;
  description: string;
  venue: string;
  city: string;
  address: string;
  mapsUrl: string;
  date: string;
  time: string;
  ticketTiers: { name: string; price: number; capacity: number; stripePriceId?: string; ticketsSold?: number }[];
  imageUrls: string[];
};

const utapi = new UTApi();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2024-04-10" as any, 
});

async function checkAdmin() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const allowedEmails = [
    "liulouis008@gmail.com",
    "reddragonsocialclub@gmail.com",
  ];

  if (!email || !allowedEmails.includes(email)) {
    throw new Error("Unauthorized: Strict Admin Access Required.");
  }
}

export async function createEvent(formData: EventFormData) {
  await checkAdmin();

  const { 
    title, description, venue, city, address, 
    mapsUrl, date, time, ticketTiers: tiers, imageUrls 
  } = formData;

  let stripeProductId: string | null = null;
  const createdStripePriceIds: string[] = [];

  try {
    const stripeProduct = await stripe.products.create({
      name: title,
      description: description || "Event Ticket",
    });
    stripeProductId = stripeProduct.id;

    const createdTiers: { name: string; price: number; capacity: number; stripePriceId: string; ticketsSold?: number }[] = [];
    if (tiers && tiers.length > 0) {
      for (const tier of tiers) {
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: tier.price,
          currency: 'eur',
          nickname: tier.name, 
        });
        createdStripePriceIds.push(stripePrice.id);
        createdTiers.push({ ...tier, stripePriceId: stripePrice.id });
      }
    }

    await db.transaction(async (tx) => {
      const [newEvent] = await tx.insert(events).values({
        title,
        description,
        venue,
        city,
        address,
        date,
        time,
        mapsUrl,
        imageUrls,
        stripeProductId: stripeProduct.id
      }).returning({ id: events.id });

      if (createdTiers.length > 0) {
        const tiersToInsert = createdTiers.map(tier => ({
          eventId: newEvent.id,
          name: tier.name,
          price: tier.price,
          capacity: tier.capacity,
          stripePriceId: tier.stripePriceId, 
        }));
        await tx.insert(ticketTiers).values(tiersToInsert);
      }
    });

    revalidatePath("/admin");
    return { success: true };

  } catch (error: unknown) {
    console.error("Error saving event:", error);
    
    if (stripeProductId) {
      await stripe.products.update(stripeProductId, { active: false }).catch(() => {});
    }
    for (const priceId of createdStripePriceIds) {
      await stripe.prices.update(priceId, { active: false }).catch(() => {});
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

export async function updateEvent(id: number, formData: EventFormData) {
  await checkAdmin();

  const { 
    title, description, venue, city, address, 
    mapsUrl, date, time, ticketTiers: tiers, imageUrls 
  } = formData;

  const createdStripePriceIds: string[] = [];

  try {
    const [oldEvent] = await db.select().from(events).where(eq(events.id, id));
    
    if (oldEvent && oldEvent.imageUrls) {
      const removedUrls = oldEvent.imageUrls.filter((url: string) => !imageUrls.includes(url));
      if (removedUrls.length > 0) {
        const fileKeys = removedUrls.map((url: string) => url.substring(url.lastIndexOf('/') + 1));
        await utapi.deleteFiles(fileKeys);
      }
    }

    if (oldEvent && oldEvent.stripeProductId) {
      await stripe.products.update(oldEvent.stripeProductId, {
        name: title,
        description: description || "Event Ticket",
      }).catch(console.error);
    }

    const oldTiers = await db.select().from(ticketTiers).where(eq(ticketTiers.eventId, id));
    const oldTiersMap = new Map(oldTiers.map(t => [t.name, t]));
    const pricesToArchive: string[] = [];

    const createdTiers: { name: string; price: number; capacity: number; stripePriceId: string; ticketsSold: number }[] = [];
    if (tiers && tiers.length > 0) {
      for (const tier of tiers) {
        let priceId = "pending_stripe_setup";
        let ticketsSold = 0;
        
        const oldTier = oldTiersMap.get(tier.name);

        if (oldTier && oldTier.price === tier.price && oldTier.stripePriceId) {
          priceId = oldTier.stripePriceId;
          ticketsSold = oldTier.ticketsSold;
          oldTiersMap.delete(tier.name);
        } else {
          if (oldEvent && oldEvent.stripeProductId) {
            const stripePrice = await stripe.prices.create({
              product: oldEvent.stripeProductId,
              unit_amount: tier.price,
              currency: 'eur',
              nickname: tier.name,
            });
            priceId = stripePrice.id;
            createdStripePriceIds.push(priceId);
          }
          if (oldTier) {
            ticketsSold = oldTier.ticketsSold;
            if (oldTier.stripePriceId && oldTier.stripePriceId.startsWith('price_')) {
              pricesToArchive.push(oldTier.stripePriceId);
            }
            oldTiersMap.delete(tier.name);
          }
        }
        
        createdTiers.push({ ...tier, stripePriceId: priceId, ticketsSold });
      }
    }

    for (const t of Array.from(oldTiersMap.values())) {
      if (t.stripePriceId && t.stripePriceId.startsWith('price_')) {
        pricesToArchive.push(t.stripePriceId);
      }
    }

    for (const pId of pricesToArchive) {
      await stripe.prices.update(pId, { active: false }).catch(console.error);
    }

    await db.transaction(async (tx) => {
      await tx.update(events).set({
        title, description, venue, city, address, 
        date, time, mapsUrl, imageUrls
      }).where(eq(events.id, id));

      await tx.delete(ticketTiers).where(eq(ticketTiers.eventId, id));

      if (createdTiers.length > 0) {
        const tiersToInsert = createdTiers.map(tier => ({
          eventId: id,
          name: tier.name,
          price: tier.price,
          capacity: tier.capacity,
          ticketsSold: tier.ticketsSold,
          stripePriceId: tier.stripePriceId, 
        }));
        await tx.insert(ticketTiers).values(tiersToInsert);
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating event:", error);

    for (const priceId of createdStripePriceIds) {
      await stripe.prices.update(priceId, { active: false }).catch(() => {});
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

export async function deleteEvent(id: number) {
  await checkAdmin();

  try {
    const [oldEvent] = await db.select().from(events).where(eq(events.id, id));
    if (oldEvent && oldEvent.imageUrls && oldEvent.imageUrls.length > 0) {
      const fileKeys = oldEvent.imageUrls.map((url: string) => url.substring(url.lastIndexOf('/') + 1));
      await utapi.deleteFiles(fileKeys);
    }

    if (oldEvent && oldEvent.stripeProductId) {
      await stripe.products.update(oldEvent.stripeProductId, { active: false }).catch(console.error);
    }

    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
