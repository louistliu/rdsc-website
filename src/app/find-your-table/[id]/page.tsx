import { getEventById } from "@/lib/stripe-actions";
import EventCheckout from "./EventCheckout";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const event = await getEventById(resolvedParams.id);

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <EventCheckout
      name={event.name}
      imageUrl={event.imageUrl}
      location={event.location}
      venue={event.venue}
      city={event.city}
      date={event.date}
      time={event.time}
      ticketOptions={event.ticketOptions}
    />
  );
}
