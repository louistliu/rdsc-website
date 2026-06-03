import Link from "next/link";
import styles from "./page.module.css";


export default function Home() {
  return (
    <main>
      <h1 className={`font-display ${styles.title}`}>RED DRAGON SOCIAL CLUB</h1>
      <p className={styles.subtext}>
          <span className={styles.firstLine}>WHERE TILES CLICK</span>
          <span className={styles.secondLine}>AND STRANGERS BECOME FRIENDS</span>
      </p>
    </main>
  );
}
