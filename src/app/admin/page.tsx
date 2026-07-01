"use client";

import { UserButton } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "8rem 2rem", minHeight: "80vh", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1 className="font-display" style={{ fontSize: "3rem", color: "#F5ECD7" }}>ADMIN DASHBOARD</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div style={{ background: "#1A1410", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255, 134, 60, 0.2)" }}>
        <p style={{ color: "#F5ECD7", fontSize: "1.2rem", fontFamily: "var(--font-poppins)", marginBottom: "2rem" }}>
          Welcome to the secure admin area. Let's test the image uploader below!
        </p>

        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            alert(`Upload Completed! Successfully uploaded ${res.length} files.`);
            console.log("Files: ", res);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
    </div>
  );
}
