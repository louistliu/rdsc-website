import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={`font-display ${styles.title}`}>
            RED DRAGON<br />
            SOCIAL CLUB
          </h1>
          <div className={styles.heroBottomRow}>
            <p className={styles.subtext}>
              <span className={styles.firstLine}>WHERE TILES CLICK</span>
              <span className={styles.secondLine}>AND STRANGERS BECOME FRIENDS</span>
            </p>
            <Link href="/find-your-table" className={styles.heroButton}>
              FIND YOUR TABLE
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutLeft}>
            <h2 className={`font-display ${styles.aboutTitle}`}>
              THE{' '}<br className={styles.desktopBr} />
              TABLE IS{' '}<br className={styles.desktopBr} />
              WHERE IT{' '}<br className={styles.desktopBr} />
              STARTS
            </h2>
            <Link href="/find-your-table" className={styles.aboutButton}>
              FIND YOUR TABLE
            </Link>
            <p className={styles.aboutText}>
              Red Dragon Social Club is a{' '}<br className={styles.desktopBr} />
              mahjong community rooted in the{' '}<br className={styles.desktopBr} />
              Netherlands. We host regular{' '}<br className={styles.desktopBr} />
              mahjong meets and cultural events{' '}<br className={styles.desktopBr} />
              across the Netherlands.{' '}<br className={styles.desktopBr} />
              New to the game? Even better.
            </p>
          </div>
          <div className={styles.aboutRight}>
            <div className={styles.aboutImageWrapper}>
              <img src="/about-pic.jpg" alt="Playing Mahjong" className={styles.aboutImage} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
