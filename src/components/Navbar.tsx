'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled down more than 50 pixels
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logoLink}>
          {/* Placeholder image, waiting for /logo.png in the public folder */}
          <img src="/Logo.png" alt="RDSC Logo" className={styles.logo} />
        </Link>
      </div>
      
      <div className={styles.centerSection}>
        <ul className={styles.navlinks}>
          <li><Link href="/" className={styles.navlink}>Home</Link></li>
          <li><Link href="/find-your-table" className={styles.navlink}>Find your table</Link></li>
          <li><Link href="/collaborate-with-us" className={styles.navlink}>Collaborate with us</Link></li>
          <li><Link href="/faq" className={styles.navlink}>FAQ</Link></li>
        </ul>
      </div>

      <div className={styles.rightSection}>
        {/* Empty section to balance the grid and ensure perfect centering */}
      </div>
    </nav>
  );
}
