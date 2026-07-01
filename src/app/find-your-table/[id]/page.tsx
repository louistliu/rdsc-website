import { db } from "@/db";
import { events, ticketTiers } from "@/db/schema";
import { eq } from "drizzle-orm";
import EventCheckout from "./EventCheckout";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(eventId)) {
    return <p>Invalid Event ID.</p>;
  }

  const [event] = await db.select().from(events).where(eq(events.id, eventId));

  if (!event) {
    return <p>Event not found.</p>;
  }

  const tiers = await db.select().from(ticketTiers).where(eq(ticketTiers.eventId, eventId));

  return (
    <EventCheckout
      title={event.title}
      description={event.description}
      imageUrls={event.imageUrls}
      venue={event.venue}
      city={event.city}
      address={event.address}
      mapsUrl={event.mapsUrl}
      date={event.date}
      time={event.time}
      ticketOptions={tiers}
    />
  );
}
