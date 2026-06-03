"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type TicketOption = {
  priceId: string;
  priceDisplay: string;
};

type EventCheckoutProps = {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  ticketOptions: TicketOption[];
};

export default function EventCheckout({
  name,
  description,
  imageUrl,
  ticketOptions,
}: EventCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedPriceId, setSelectedPriceId] = useState(
    ticketOptions[0]?.priceId || ""
  );

  const handleCheckout = async () => {
    if (!selectedPriceId) {
      alert("Please select a ticket type.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: selectedPriceId,
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
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name || "Event Image"}
          width={600}
          height={400}
          className={styles.eventImage} 
        />
      )}
      <h1 className="font-display">{name}</h1>
      <p className={styles.description}>{description}</p>

      <div className={styles.checkoutBox}>
        <h2>Tickets</h2>

        <div className={styles.ticketInfo}>
          <label htmlFor="ticket-type">Ticket Type:</label>
          <select
            id="ticket-type"
            value={selectedPriceId}
            onChange={(e) => setSelectedPriceId(e.target.value)}
            className={styles.ticketSelect}
          >
            {ticketOptions.map((option) => (
              <option key={option.priceId} value={option.priceId}>
                {option.priceDisplay}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.ticketInfo}>
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

        <button
          className={styles.checkoutButton}
          onClick={handleCheckout}
          disabled={loading || ticketOptions.length === 0}
        >
          {loading ? "Processing..." : "Buy Tickets"}
        </button>
      </div>
    </main>
  );
}
