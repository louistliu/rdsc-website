import Image from 'next/image';
import styles from './faq.module.css';
import Accordion from './Accordion';

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
          <Image
            src="/FAQ_tiles.png"
            alt="Mahjong Tiles"
            width={240}
            height={240}
            style={{ width: '100%', height: 'auto', maxWidth: '240px' }}
            className={styles.illustration}
          />
        </div>
        <div className={styles.rightColumn}>
          <Accordion />
        </div>
      </div>
    </div>
  );
}
