import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/stripe-actions";
import styles from "./page.module.css";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className={styles.container}>
      <h1 className={`font-display ${styles.title}`}>FIND YOUR TABLE</h1>
      
      <div className={styles.grid}>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {event.images[0] ? (
                  <Image
                    src={event.images[0]}
                    alt={event.name}
                    fill
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardLocation}>
                  {event.metadata?.city || event.metadata?.location || 'LOCATION TBA'}
                </h2>
                <p className={styles.cardDate}>
                  {event.metadata?.date || 'Date TBA'}
                </p>
                <p className={styles.cardTime}>
                  {event.metadata?.time || 'Time TBA'}
                </p>
                <Link href={`/find-your-table/${event.id}`} className={styles.takeSeatBtn}>
                  TAKE A SEAT
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noEvents}>No upcoming events found. Please check back later!</p>
        )}
      </div>
    </main>
  );
}
