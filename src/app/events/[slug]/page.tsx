"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

export default function EventDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const eventDetails = {
    name: "[Placeholder Event Name]",
    description: "[Placeholder Event Description]",
    priceDisplay: "€25.00",
    stripePriceId: "price_1TdgF25erftjVmiJzy7iCHsB",
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: eventDetails.stripePriceId,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className="font-display">
        {eventDetails.name} (Slug: {slug})
      </h1>
      
      <p className={styles.description}>
        {eventDetails.description}
      </p>
      
      <div className={styles.checkoutBox}>
        <h2>Tickets</h2>
        
        <div className={styles.ticketInfo}>
          <span>General Admission ({eventDetails.priceDisplay})</span>
          
          <div className={styles.quantitySelector}>
            <label htmlFor="quantity">Quantity:</label>
            <input 
              className={styles.quantityInput}
              type="number" 
              id="quantity" 
              min="1" 
              max="10" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        </div>

        <button 
          className={styles.checkoutButton}
          onClick={handleCheckout} 
          disabled={loading}
        >
          {loading ? "Processing..." : `Buy Tickets`}
        </button>
      </div>
    </main>
  );
}
