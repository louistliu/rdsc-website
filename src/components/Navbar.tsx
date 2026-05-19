import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "2rem" }}>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none", margin: 0, padding: 0 }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/events">Events</Link></li>
        <li><Link href="/work-with-us">Work With Us</Link></li>
        <li>
          <a href="https://instagram.com/reddragonsocialclub/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </li>
      </ul>
    </nav>
  );
}
