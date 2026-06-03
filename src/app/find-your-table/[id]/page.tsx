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
      description={event.description}
      imageUrl={event.imageUrl}
      ticketOptions={event.ticketOptions}
    />
  );
}
