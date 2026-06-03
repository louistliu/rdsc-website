import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/stripe-actions";
import styles from "./page.module.css";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className={styles.container}>
      <h1 className="font-display">FIND YOUR TABLE</h1>
      
      <div className={styles.grid}>
        {events.length > 0 ? (
          events.map((event) => (
            <Link href={`/find-your-table/${event.id}`} key={event.id} className={styles.card}>
              {event.images[0] && (
                <Image
                  src={event.images[0]}
                  alt={event.name}
                  width={400}
                  height={200}
                  className={styles.cardImage}
                />
              )}
              <div className={styles.cardContent}>
                {event.description && (
                  <p className={styles.cardDescription}>{event.description}</p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p>No upcoming events found. Please check back later!</p>
        )}
      </div>
    </main>
  );
}
