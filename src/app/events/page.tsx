import Link from "next/link";

export default function EventsPage() {
  return (
    <main>
      <h1 className="font-display">Events</h1>
      <p>Here you can browse all our upcoming events.</p>
      
      <ul>
        <li>
          <Link href="/events/1">Event 1 - Details and Tickets</Link>
        </li>
        <li>
          <Link href="/events/2">Event 2 - Details and Tickets</Link>
        </li>
      </ul>
    </main>
  );
}
