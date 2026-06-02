import Link from "next/link";
import styles from "./page.module.css";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.session_id;

  return (
    <main className={styles.container}>
      <h1 className="font-display">Thank You!</h1>
      <p className={styles.message}>
        Your order has been confirmed. A receipt has been sent to the email address you provided.
      </p>
      {sessionId && (
        <p className={styles.sessionId}>
          Session ID: {sessionId as string}
        </p>
      )}
      <Link href="/" className={styles.homeLink}>
        Return Home
      </Link>
    </main>
  );
}
