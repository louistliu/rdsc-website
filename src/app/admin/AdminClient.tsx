"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import "@uploadthing/react/styles.css";
import { createEvent, updateEvent, deleteEvent } from "@/lib/admin-actions";

type TicketTier = {
  id?: number;
  name: string;
  price: number;
  capacity: number;
};

type EventData = {
  id: number;
  title: string;
  description: string;
  venue: string;
  city: string;
  address: string;
  mapsUrl: string;
  date: string;
  time: string;
  imageUrls: string[];
  ticketTiers: TicketTier[];
};

export default function AdminClient({ initialEvents }: { initialEvents: EventData[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleAddNew = () => {
    setEditingEventId(null);
    setTitle(""); setDescription(""); setVenue(""); setCity(""); setAddress(""); setMapsUrl(""); setDate(""); setTime("");
    setTicketTiers([{ name: "", price: 0, capacity: 0 }]);
    setImageUrls([]);
    setIsFormOpen(true);
  };

  const handleEdit = (event: EventData) => {
    setEditingEventId(event.id);
    setTitle(event.title); 
    setDescription(event.description);
    setVenue(event.venue);
    setCity(event.city);
    setAddress(event.address);
    setMapsUrl(event.mapsUrl);
    setDate(event.date);
    setTime(event.time);
    setTicketTiers(event.ticketTiers.length > 0 ? event.ticketTiers : [{ name: "", price: 0, capacity: 0 }]);
    setImageUrls(event.imageUrls || []);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to completely delete this event? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    const res = await deleteEvent(id);
    setIsDeleting(false);
    
    if (res.success) {
      alert("Event deleted successfully.");
      if (editingEventId === id) setIsFormOpen(false);
    } else {
      alert("Failed to delete event: " + res.error);
    }
  };

  const handleSaveEvent = async () => {
    setIsSaving(true);
    const formData = {
      title, description, venue, city, address, mapsUrl, date, time,
      ticketTiers, imageUrls
    };

    const res = editingEventId 
      ? await updateEvent(editingEventId, formData)
      : await createEvent(formData);
      
    setIsSaving(false);
    
    if (res.success) {
      alert(editingEventId ? "Event Updated Successfully!" : "Event Saved Successfully!");
      setIsFormOpen(false);
    } else {
      alert("Failed to save event: " + res.error);
    }
  };

  const handleAddTier = () => setTicketTiers([...ticketTiers, { name: "", price: 0, capacity: 0 }]);
  const handleTierChange = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTiers = [...ticketTiers];
    newTiers[index] = { ...newTiers[index], [field]: value as never };
    setTicketTiers(newTiers);
  };
  const handleRemoveTier = (index: number) => setTicketTiers(ticketTiers.filter((_, i) => i !== index));

  const inputStyle = { width: "100%", padding: "0.8rem", borderRadius: "6px", border: "1px solid rgba(255, 134, 60, 0.4)", background: "#2A2420", color: "#F5ECD7", fontFamily: "var(--font-poppins)", fontSize: "1rem", marginBottom: "1.5rem", marginTop: "0.5rem" };
  const labelStyle = { color: "#F5ECD7", fontFamily: "var(--font-poppins)", fontWeight: 600, display: "block" };

  if (isFormOpen) {
    return (
      <div style={{ padding: "8rem 2rem", minHeight: "100vh", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <button type="button" onClick={() => setIsFormOpen(false)} style={{ background: "transparent", border: "none", color: "#FF863C", fontSize: "1.1rem", fontFamily: "var(--font-poppins)", cursor: "pointer", fontWeight: "bold" }}>
            ← Back to Dashboard
          </button>
          {editingEventId && (
            <button onClick={() => handleDelete(editingEventId)} disabled={isDeleting} style={{ background: "#ef4444", color: "white", padding: "0.6rem 1.2rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", fontFamily: "var(--font-poppins)" }}>
              {isDeleting ? "Deleting..." : "Delete Event"}
            </button>
          )}
        </div>

        <h1 className="font-display" style={{ fontSize: "3rem", color: "#F5ECD7", marginBottom: "2rem" }}>{editingEventId ? "EDIT EVENT" : "CREATE NEW EVENT"}</h1>
  
        <div style={{ background: "#1A1410", padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255, 134, 60, 0.2)" }}>
          <label style={labelStyle}>Event Title</label>
          <input style={inputStyle} type="text" value={title} onChange={e => setTitle(e.target.value)} />
  
          <label style={labelStyle}>Description</label>
          <textarea style={{...inputStyle, minHeight: "150px", resize: "vertical"}} value={description} onChange={e => setDescription(e.target.value)} />
  
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={labelStyle}>Venue Name</label><input style={inputStyle} type="text" value={venue} onChange={e => setVenue(e.target.value)} /></div>
            <div><label style={labelStyle}>City</label><input style={inputStyle} type="text" value={city} onChange={e => setCity(e.target.value)} /></div>
          </div>
  
          <label style={labelStyle}>Address</label>
          <textarea style={{...inputStyle, minHeight: "100px", resize: "vertical"}} value={address} onChange={e => setAddress(e.target.value)} />
  
          <label style={labelStyle}>Google Maps URL</label>
          <input style={inputStyle} type="text" value={mapsUrl} onChange={e => setMapsUrl(e.target.value)} />
  
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={labelStyle}>Date</label><input style={inputStyle} type="text" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div><label style={labelStyle}>Time</label><input style={inputStyle} type="text" value={time} onChange={e => setTime(e.target.value)} /></div>
          </div>
  
          <div style={{ borderTop: "1px solid rgba(255, 134, 60, 0.2)", margin: "2rem 0", paddingTop: "2rem" }}>
            <h2 style={{ color: "#FF863C", fontFamily: "var(--font-poppins)", marginBottom: "1.5rem" }}>Ticket Tiers</h2>
            {ticketTiers.map((tier, index) => (
              <div key={index} style={{ background: "#2A2420", padding: "1.5rem", borderRadius: "8px", marginBottom: "1rem", position: "relative" }}>
                {ticketTiers.length > 1 && (<button onClick={() => handleRemoveTier(index)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", padding: "0.2rem 0.6rem", cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: "bold" }}>X</button>)}
                <label style={labelStyle}>Tier Name</label><input style={inputStyle} type="text" value={tier.name} onChange={e => handleTierChange(index, 'name', e.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div><label style={labelStyle}>Price (in cents)</label><input style={inputStyle} type="number" value={tier.price || ""} onChange={e => handleTierChange(index, 'price', parseInt(e.target.value) || 0)} /></div>
                  <div><label style={labelStyle}>Capacity</label><input style={inputStyle} type="number" value={tier.capacity || ""} onChange={e => handleTierChange(index, 'capacity', parseInt(e.target.value) || 0)} /></div>
                </div>
              </div>
            ))}
            <button onClick={handleAddTier} style={{ background: "transparent", border: "1px solid #FF863C", color: "#F5ECD7", padding: "0.8rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--font-poppins)", fontWeight: "bold", marginTop: "0.5rem" }}>+ Add Another Ticket Tier</button>
          </div>
  
          <div style={{ borderTop: "1px solid rgba(255, 134, 60, 0.2)", margin: "2rem 0", paddingTop: "2rem" }}>
            <h2 style={{ color: "#FF863C", fontFamily: "var(--font-poppins)", marginBottom: "1.5rem" }}>Event Images</h2>
            <UploadDropzone endpoint="imageUploader" onClientUploadComplete={(res) => { const urls = res.map(file => file.url); setImageUrls([...imageUrls, ...urls]); alert(`Successfully uploaded ${res.length} images!`); }} onUploadError={(error: Error) => { alert(`ERROR! ${error.message}`); }} />
            {imageUrls.length > 0 && (
              <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "1rem" }}>
                {imageUrls.map((url, i) => (
                  <div key={i} style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,134,60,0.3)" }}>
                    <Image src={url} alt="Event upload" fill style={{ objectFit: "cover" }} />
                    <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} style={{ position: "absolute", top: "0.25rem", right: "0.25rem", background: "rgba(239,68,68,0.9)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>X</button>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <button onClick={handleSaveEvent} disabled={isSaving} style={{ width: "100%", background: "#FF863C", color: "#1A1410", padding: "1.2rem", borderRadius: "8px", border: "none", fontSize: "1.2rem", fontWeight: "bold", fontFamily: "var(--font-poppins)", cursor: "pointer", marginTop: "2rem", opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? "Saving..." : (editingEventId ? "Update Event" : "Save New Event")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8rem 2rem", minHeight: "80vh", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1 className="font-display" style={{ fontSize: "3rem", color: "#F5ECD7" }}>ADMIN DASHBOARD</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <button onClick={handleAddNew} style={{ background: "#FF863C", color: "#1A1410", border: "none", padding: "0.8rem 1.5rem", borderRadius: "6px", fontFamily: "var(--font-poppins)", fontWeight: "bold", cursor: "pointer" }}>+ Create New Event</button>
          <UserButton />
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ color: "#F5ECD7", fontFamily: "var(--font-poppins)", marginBottom: "1rem" }}>Existing Events</h2>
        
        {initialEvents.length === 0 ? (
          <p style={{ color: "rgba(245, 236, 215, 0.4)", fontFamily: "var(--font-poppins)", fontStyle: "italic" }}>No events found. Click &quot;Create New Event&quot; to get started.</p>
        ) : (
          initialEvents.map(event => (
            <div key={event.id} style={{ background: "#1A1410", padding: "1.5rem 2rem", borderRadius: "8px", border: "1px solid rgba(255, 134, 60, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ color: "#F5ECD7", fontFamily: "var(--font-poppins)", fontSize: "1.2rem", margin: "0 0 0.5rem 0" }}>{event.title}</h3>
                <p style={{ color: "rgba(245, 236, 215, 0.6)", margin: 0, fontFamily: "var(--font-poppins)" }}>{event.date} • {event.time}</p>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => handleEdit(event)} style={{ background: "transparent", border: "1px solid #F5ECD7", color: "#F5ECD7", padding: "0.5rem 1.5rem", borderRadius: "6px", fontFamily: "var(--font-poppins)", cursor: "pointer" }}>Edit Event</button>
                <button onClick={() => handleDelete(event.id)} disabled={isDeleting} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "0.5rem 1.5rem", borderRadius: "6px", fontFamily: "var(--font-poppins)", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
