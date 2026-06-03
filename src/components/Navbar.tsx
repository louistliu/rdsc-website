import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navlinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/find-your-table">Find your table</Link></li>
        <li><Link href="/collaborate-with-us">Collaborate with us</Link></li>
      </ul>
    </nav>
  );
}
