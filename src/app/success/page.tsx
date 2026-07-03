import Link from "next/link";
import styles from "./page.module.css";

export default async function SuccessPage() {
  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={`font-display ${styles.title}`}>Thank You!</h1>
        <p className={styles.message}>
          Your order has been confirmed. A receipt has been sent to the email you provided.
          <br /><br />
          See you soon at the table!
        </p>
        <Link href="/" className={styles.homeLink}>
          Return Home
        </Link>
      </div>
    </main>
  );
}
