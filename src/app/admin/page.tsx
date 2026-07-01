"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

type TicketTier = {
  name: string;
  price: number;
  capacity: number;
};

// Mock data to show what the dashboard looks like before we connect the real database
const MOCK_EVENTS = [
  { id: 1, title: "Mahjong Night Vol. 1", date: "2026-08-15", status: "Upcoming" },
  { id: 2, title: "Beginner's Workshop", date: "2026-08-22", status: "Sold Out" }
];

export default function AdminDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([{ name: "", price: 0, capacity: 0 }]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Open form for a brand new event
  const handleAddNew = () => {
    setEditingEventId(null);
    setTitle(""); setDescription(""); setVenue(""); setCity(""); setAddress(""); setMapsUrl(""); setDate(""); setTime("");
    setTicketTiers([{ name: "", price: 0, capacity: 0 }]);
    setImageUrls([]);
    setIsFormOpen(true);
  };

  // Open form to edit an existing event
  const handleEdit = (id: number, eventTitle: string) => {
    setEditingEventId(id);
    // Pretend to load data for now
    setTitle(eventTitle); 
    setDescription("We will load the real data from Neon here in Step 4!");
    setIsFormOpen(true);
  };

  const handleAddTier = () => {
    setTicketTiers([...ticketTiers, { name: "", price: 0, capacity: 0 }]);
  };

  const handleTierChange = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTiers = [...ticketTiers];
    newTiers[index] = { ...newTiers[index], [field]: value as never };
    setTicketTiers(newTiers);
  };

  const handleRemoveTier = (index: number) => {
    const newTiers = ticketTiers.filter((_, i) => i !== index);
    setTicketTiers(newTiers);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid rgba(255, 134, 60, 0.4)",
    background: "#2A2420",
    color: "#F5ECD7",
    fontFamily: "var(--font-poppins)",
    fontSize: "1rem",
    marginBottom: "1.5rem",
    marginTop: "0.5rem"
  };

  const labelStyle = {
    color: "#F5ECD7",
    fontFamily: "var(--font-poppins)",
    fontWeight: 600,
    display: "block"
  };

  // -------------------------
  // VIEW 1: THE FORM
  // -------------------------
  if (isFormOpen) {
    return (
      <div style={{ padding: "8rem 2rem", minHeight: "100vh", maxWidth: "900px", margin: "0 auto" }}>
        <button 
          type="button"
          onClick={() => {
            console.log("Back button clicked!");
            setIsFormOpen(false);
          }}
          style={{ background: "transparent", border: "none", color: "#FF863C", fontSize: "1.1rem", fontFamily: "var(--font-poppins)", cursor: "pointer", marginBottom: "2rem", fontWeight: "bold" }}
        >
          ← Back to Dashboard
        </button>

        <h1 className="font-display" style={{ fontSize: "3rem", color: "#F5ECD7", marginBottom: "2rem" }}>
          {editingEventId ? "EDIT EVENT" : "CREATE NEW EVENT"}
        </h1>
  
        <div style={{ background: "#1A1410", padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255, 134, 60, 0.2)" }}>
          <label style={labelStyle}>Event Title</label>
          <input style={inputStyle} type="text" value={title} onChange={e => setTitle(e.target.value)} />
  
          <label style={labelStyle}>Description</label>
          <textarea style={{...inputStyle, minHeight: "150px", resize: "vertical"}} value={description} onChange={e => setDescription(e.target.value)} />
  
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Venue Name</label>
              <input style={inputStyle} type="text" value={venue} onChange={e => setVenue(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} type="text" value={city} onChange={e => setCity(e.target.value)} />
            </div>
          </div>
  
          <label style={labelStyle}>Address</label>
          <input style={inputStyle} type="text" value={address} onChange={e => setAddress(e.target.value)} />
  
          <label style={labelStyle}>Google Maps URL</label>
          <input style={inputStyle} type="text" value={mapsUrl} onChange={e => setMapsUrl(e.target.value)} />
  
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="text" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input style={inputStyle} type="text" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
  
          <div style={{ borderTop: "1px solid rgba(255, 134, 60, 0.2)", margin: "2rem 0", paddingTop: "2rem" }}>
            <h2 style={{ color: "#FF863C", fontFamily: "var(--font-poppins)", marginBottom: "1.5rem" }}>Ticket Tiers</h2>
            
            {ticketTiers.map((tier, index) => (
              <div key={index} style={{ background: "#2A2420", padding: "1.5rem", borderRadius: "8px", marginBottom: "1rem", position: "relative" }}>
                {ticketTiers.length > 1 && (
                  <button 
                    onClick={() => handleRemoveTier(index)}
                    style={{ position: "absolute", top: "1rem", right: "1rem", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: "bold" }}
                  >
                    X
                  </button>
                )}
                
                <label style={labelStyle}>Tier Name</label>
                <input style={inputStyle} type="text" value={tier.name} onChange={e => handleTierChange(index, 'name', e.target.value)} />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Price (in cents)</label>
                    <input style={inputStyle} type="number" value={tier.price || ""} onChange={e => handleTierChange(index, 'price', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Capacity</label>
                    <input style={inputStyle} type="number" value={tier.capacity || ""} onChange={e => handleTierChange(index, 'capacity', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            ))}
  
            <button 
              onClick={handleAddTier}
              style={{ background: "transparent", border: "1px solid #FF863C", color: "#F5ECD7", padding: "0.8rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: "bold", marginTop: "0.5rem" }}
            >
              + Add Another Ticket Tier
            </button>
          </div>
  
          <div style={{ borderTop: "1px solid rgba(255, 134, 60, 0.2)", margin: "2rem 0", paddingTop: "2rem" }}>
            <h2 style={{ color: "#FF863C", fontFamily: "var(--font-poppins)", marginBottom: "1.5rem" }}>Event Images</h2>
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                const urls = res.map(file => file.url);
                setImageUrls([...imageUrls, ...urls]);
                alert(`Successfully uploaded ${res.length} images!`);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            {imageUrls.length > 0 && (
              <p style={{ color: "#4ade80", marginTop: "1rem", fontFamily: "var(--font-poppins)", textAlign: "center", fontWeight: "bold" }}>
                ✓ {imageUrls.length} image(s) uploaded and ready.
              </p>
            )}
          </div>
  
          <button 
            style={{ width: "100%", background: "#FF863C", color: "#1A1410", padding: "1.2rem", borderRadius: "8px", border: "none", fontSize: "1.2rem", fontWeight: "bold", fontFamily: "var(--font-poppins)", cursor: "pointer", marginTop: "2rem" }}
          >
            {editingEventId ? "Update Event" : "Save New Event"}
          </button>
  
        </div>
      </div>
    );
  }

  // -------------------------
  // VIEW 2: THE DASHBOARD
  // -------------------------
  return (
    <div style={{ padding: "8rem 2rem", minHeight: "80vh", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1 className="font-display" style={{ fontSize: "3rem", color: "#F5ECD7" }}>ADMIN DASHBOARD</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <button 
            onClick={handleAddNew}
            style={{ background: "#FF863C", color: "#1A1410", border: "none", padding: "0.8rem 1.5rem", borderRadius: "6px", fontFamily: "var(--font-poppins)", fontWeight: "bold", cursor: "pointer" }}
          >
            + Create New Event
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ color: "#F5ECD7", fontFamily: "var(--font-poppins)", marginBottom: "1rem" }}>Existing Events</h2>
        
        {MOCK_EVENTS.map(event => (
          <div key={event.id} style={{ background: "#1A1410", padding: "1.5rem 2rem", borderRadius: "8px", border: "1px solid rgba(255, 134, 60, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ color: "#F5ECD7", fontFamily: "var(--font-poppins)", fontSize: "1.2rem", margin: "0 0 0.5rem 0" }}>{event.title}</h3>
              <p style={{ color: "rgba(245, 236, 215, 0.6)", margin: 0, fontFamily: "var(--font-poppins)" }}>{event.date} • {event.status}</p>
            </div>
            <button 
              onClick={() => handleEdit(event.id, event.title)}
              style={{ background: "transparent", border: "1px solid #F5ECD7", color: "#F5ECD7", padding: "0.5rem 1.5rem", borderRadius: "6px", fontFamily: "var(--font-poppins)", cursor: "pointer" }}
            >
              Edit Event
            </button>
          </div>
        ))}

        <p style={{ color: "rgba(245, 236, 215, 0.4)", fontFamily: "var(--font-poppins)", fontStyle: "italic", marginTop: "1rem" }}>
          (These are just placeholder events. In Step 4 we will connect this list to your real database!)
        </p>
      </div>
    </div>
  );
}
