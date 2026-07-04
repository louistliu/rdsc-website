'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.centerSection}>
        <ul className={styles.navlinks}>
          <li><Link href="/" className={styles.navlink}>Home</Link></li>
          <li><Link href="/find-your-table" className={styles.navlink}>Find your table</Link></li>
          <li><Link href="/collaborate-with-us" className={styles.navlink}>Collaborate with us</Link></li>
          <li><Link href="/faq" className={styles.navlink}>FAQ</Link></li>
        </ul>
        
        <button className={styles.hamburgerBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileNavlinks}>
            <li><Link href="/" className={styles.mobileNavlink} onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link href="/find-your-table" className={styles.mobileNavlink} onClick={() => setMenuOpen(false)}>Find your table</Link></li>
            <li><Link href="/collaborate-with-us" className={styles.mobileNavlink} onClick={() => setMenuOpen(false)}>Collaborate with us</Link></li>
            <li><Link href="/faq" className={styles.mobileNavlink} onClick={() => setMenuOpen(false)}>FAQ</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
