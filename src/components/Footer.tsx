export default function Footer() {
  return (
    <footer style={{ marginTop: "auto", padding: "2rem 1rem", borderTop: "1px solid #ccc", textAlign: "center" }}>
      <p>&copy; {new Date().getFullYear()} RDSC. All rights reserved.</p>
    </footer>
  );
}
