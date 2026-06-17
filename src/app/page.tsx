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
              THE<br />
              TABLE IS<br />
              WHERE IT<br />
              STARTS
            </h2>
            <Link href="/find-your-table" className={styles.aboutButton}>
              FIND YOUR TABLE
            </Link>
            <p className={styles.aboutText}>
              Red Dragon Social Club is a<br />
              mahjong community rooted in the<br />
              Netherlands. We host regular<br />
              mahjong meets and cultural events<br />
              across the Netherlands.<br />
              New to the game? Even better.
            </p>
          </div>
          <div className={styles.aboutRight}>
            <div className={styles.aboutImageWrapper}>
              {/* Note: This assumes the user will upload 'about-pic.jpg' */}
              <img src="/about-pic.jpg" alt="Playing Mahjong" className={styles.aboutImage} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
