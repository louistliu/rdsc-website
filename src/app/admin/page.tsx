import { db } from "@/db";
import { events, ticketTiers } from "@/db/schema";
import AdminClient from "./AdminClient";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {

  const allEvents = await db.select().from(events);
  const allTiers = await db.select().from(ticketTiers);

  const populatedEvents = allEvents.map(event => ({
    ...event,
    ticketTiers: allTiers.filter(t => t.eventId === event.id)
  }));

  return <AdminClient initialEvents={populatedEvents} />;
}
