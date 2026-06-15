import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contactInfo}>
        <a 
          href="https://www.instagram.com/reddragonsocialclub/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.contactRow}
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>@reddragonsocialclub</span>
        </a>
        <a 
          href="mailto:reddragonsocialclub@gmail.com" 
          className={styles.contactRow}
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>reddragonsocialclub@gmail.com</span>
        </a>
      </div>
      <div className={styles.copyright}>
        &copy; 2026 RDSC, All Rights Reserved
      </div>
    </footer>
  );
}
