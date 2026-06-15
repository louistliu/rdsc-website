import styles from './faq.module.css';
import FaqAccordion from './FaqAccordion';

export default function FAQPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h1 className={`font-display ${styles.title}`}>
            FREQUENTLY<br />
            ASKED<br />
            QUESTIONS
          </h1>
          <img
            src="/FAQ_tiles.png"
            alt="Mahjong Tiles"
            className={styles.illustration}
          />
        </div>
        <div className={styles.rightColumn}>
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}
