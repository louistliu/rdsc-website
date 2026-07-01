import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { events } from "@/db/schema";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const allEvents = await db.select().from(events);

  return (
    <main className={styles.container}>
      <h1 className={`font-display ${styles.title}`}>FIND YOUR TABLE</h1>
      
      <div className={styles.grid}>
        {allEvents.length > 0 ? (
          allEvents.map((event) => (
            <div key={event.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {event.imageUrls && event.imageUrls.length > 0 ? (
                  <Image
                    src={event.imageUrls[0]}
                    alt={event.title}
                    fill
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardLocation}>
                  {event.city || 'LOCATION TBA'}
                </h2>
                <p className={styles.cardDate}>
                  {event.date || 'Date TBA'}
                </p>
                <p className={styles.cardTime}>
                  {event.time || 'Time TBA'}
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
