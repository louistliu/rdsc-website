"use server";

import { db } from "@/db";
import { events, ticketTiers } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function createEvent(formData: any) {
  const { 
    title, description, venue, city, address, 
    mapsUrl, date, time, ticketTiers: tiers, imageUrls 
  } = formData;

  try {
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
        imageUrls
      }).returning({ id: events.id });

      if (tiers && tiers.length > 0) {
        const tiersToInsert = tiers.map((tier: any) => ({
          eventId: newEvent.id,
          name: tier.name,
          price: tier.price,
          capacity: tier.capacity,
          stripePriceId: "pending_stripe_setup", 
        }));

        await tx.insert(ticketTiers).values(tiersToInsert);
      }
    });

    revalidatePath("/admin");
    return { success: true };

  } catch (error: any) {
    console.error("Error saving event:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEvent(id: string, formData: any) {
  const { 
    title, description, venue, city, address, 
    mapsUrl, date, time, ticketTiers: tiers, imageUrls 
  } = formData;

  try {
    const [oldEvent] = await db.select().from(events).where(eq(events.id, id));
    if (oldEvent && oldEvent.imageUrls) {
      const removedUrls = oldEvent.imageUrls.filter((url: string) => !imageUrls.includes(url));
      if (removedUrls.length > 0) {
        const fileKeys = removedUrls.map((url: string) => url.substring(url.lastIndexOf('/') + 1));
        await utapi.deleteFiles(fileKeys);
      }
    }

    await db.transaction(async (tx) => {
      await tx.update(events).set({
        title, description, venue, city, address, 
        date, time, mapsUrl, imageUrls
      }).where(eq(events.id, id));

      await tx.delete(ticketTiers).where(eq(ticketTiers.eventId, id));

      if (tiers && tiers.length > 0) {
        const tiersToInsert = tiers.map((tier: any) => ({
          eventId: id,
          name: tier.name,
          price: tier.price,
          capacity: tier.capacity,
          stripePriceId: "pending_stripe_setup", 
        }));

        await tx.insert(ticketTiers).values(tiersToInsert);
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEvent(id: string) {
  try {
    // 1. Fetch the event to get its images
    const [oldEvent] = await db.select().from(events).where(eq(events.id, id));
    if (oldEvent && oldEvent.imageUrls && oldEvent.imageUrls.length > 0) {
      const fileKeys = oldEvent.imageUrls.map((url: string) => url.substring(url.lastIndexOf('/') + 1));
      await utapi.deleteFiles(fileKeys);
    }

    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
}
