import { UserButton } from "@clerk/nextjs";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "8rem 2rem", minHeight: "80vh", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1 className="font-display" style={{ fontSize: "3rem", color: "#F5ECD7" }}>ADMIN DASHBOARD</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <div style={{ background: "#1A1410", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255, 134, 60, 0.2)" }}>
        <p style={{ color: "#F5ECD7", fontSize: "1.2rem", fontFamily: "var(--font-poppins)" }}>
          Welcome to the secure admin area. In the future, this is where you will be able to create products, set descriptions, and manage ticket capacities.
        </p>
      </div>
    </div>
  );
}
