"use server";

import { db } from "@/db";
import { events, ticketTiers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const utapi = new UTApi();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
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

export async function createEvent(formData: any) {
  await checkAdmin();

  const { 
    title, description, venue, city, address, 
    mapsUrl, date, time, ticketTiers: tiers, imageUrls 
  } = formData;

  let stripeProductId: string | null = null;
  const createdStripePriceIds: string[] = [];

  try {
    // 1. Create Stripe Product & Prices BEFORE database transaction
    const stripeProduct = await stripe.products.create({
      name: title,
      description: description || "Event Ticket",
    });
    stripeProductId = stripeProduct.id;

    const createdTiers: any[] = [];
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

    // 2. Synchronous Database Transaction
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

  } catch (error: any) {
    console.error("Error saving event:", error);
    
    // STRIPE ROLLBACK: If DB fails, archive the orphaned Stripe objects
    if (stripeProductId) {
      await stripe.products.update(stripeProductId, { active: false }).catch(() => {});
    }
    for (const priceId of createdStripePriceIds) {
      await stripe.prices.update(priceId, { active: false }).catch(() => {});
    }

    return { success: false, error: error.message };
  }
}

export async function updateEvent(id: number, formData: any) {
  await checkAdmin();

  const { 
    title, description, venue, city, address, 
    mapsUrl, date, time, ticketTiers: tiers, imageUrls 
  } = formData;

  const createdStripePriceIds: string[] = [];

  try {
    const [oldEvent] = await db.select().from(events).where(eq(events.id, id));
    
    // UploadThing Cleanup
    if (oldEvent && oldEvent.imageUrls) {
      const removedUrls = oldEvent.imageUrls.filter((url: string) => !imageUrls.includes(url));
      if (removedUrls.length > 0) {
        const fileKeys = removedUrls.map((url: string) => url.substring(url.lastIndexOf('/') + 1));
        await utapi.deleteFiles(fileKeys);
      }
    }

    // 1. Stripe API calls BEFORE database transaction
    if (oldEvent && oldEvent.stripeProductId) {
      await stripe.products.update(oldEvent.stripeProductId, {
        name: title,
        description: description || "Event Ticket",
      }).catch(console.error);
    }

    const oldTiers = await db.select().from(ticketTiers).where(eq(ticketTiers.eventId, id));
    for (const t of oldTiers) {
      if (t.stripePriceId && t.stripePriceId.startsWith('price_')) {
        await stripe.prices.update(t.stripePriceId, { active: false }).catch(console.error);
      }
    }

    const createdTiers: any[] = [];
    if (tiers && tiers.length > 0) {
      for (const tier of tiers) {
        let priceId = "pending_stripe_setup";
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
        createdTiers.push({ ...tier, stripePriceId: priceId });
      }
    }

    // 2. Synchronous Database Transaction
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
          stripePriceId: tier.stripePriceId, 
        }));
        await tx.insert(ticketTiers).values(tiersToInsert);
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event:", error);

    // STRIPE ROLLBACK: If DB fails, archive the newly created orphan prices
    for (const priceId of createdStripePriceIds) {
      await stripe.prices.update(priceId, { active: false }).catch(() => {});
    }

    return { success: false, error: error.message };
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
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
}
