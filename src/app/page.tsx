import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home / Landing Page</h1>
      <p>Welcome to our website!</p>
      
      <section>
        <h2>Featured Events</h2>
        {/* Placeholder for event cards */}
        <ul>
          <li>
            <Link href="/events/1">Event 1 (Click to view details)</Link>
          </li>
          <li>
            <Link href="/events/2">Event 2 (Click to view details)</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
