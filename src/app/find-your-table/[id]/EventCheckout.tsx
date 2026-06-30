"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type TicketOption = {
  priceId: string;
  name: string;
  priceDisplay: string;
  unitAmount: number;
};

type EventCheckoutProps = {
  name: string | null;
  imageUrl: string | null;
  location: string | null;
  venue: string | null;
  city: string | null;
  date: string | null;
  time: string | null;
  ticketOptions: TicketOption[];
};

export default function EventCheckout({
  name,
  location,
  venue,
  city,
  date,
  time,
  ticketOptions,
}: EventCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedPriceId, setSelectedPriceId] = useState(
    ticketOptions[0]?.priceId || ""
  );

  const selectedOption = ticketOptions.find((o) => o.priceId === selectedPriceId);
  const totalPrice = selectedOption
    ? ((selectedOption.unitAmount * quantity) / 100).toFixed(2)
    : "0.00";

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
      <div className={styles.gridContainer}>
        {/* LEFT COLUMN: Image Gallery & Tickets */}
        <div className={styles.leftColumn}>
          <div className={styles.galleryPlaceholder}></div>

          <div className={styles.ticketBox}>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>Ticket Type:</span>
              <div className={styles.ticketToggle}>
                {ticketOptions.map((option) => (
                  <button
                    key={option.priceId}
                    className={`${styles.toggleBtn} ${
                      selectedPriceId === option.priceId ? styles.activeToggle : ""
                    }`}
                    onClick={() => setSelectedPriceId(option.priceId)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>Quantity:</span>
              <div className={styles.quantityControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button className={styles.qtyBtn} onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>Total Price:</span>
              <span className={styles.totalPrice}>€{totalPrice}</span>
            </div>

            <button
              className={styles.getSeatsBtn}
              onClick={handleCheckout}
              disabled={loading || ticketOptions.length === 0}
            >
              {loading ? "PROCESSING..." : "GET SEATS"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className={styles.detailsColumn}>
          <h1 className={`font-display ${styles.title}`}>{name}</h1>

          <div className={styles.metaInfo}>
            { (venue || city || location) && (
              <div className={styles.metaRow}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icon}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{[venue, city].filter(Boolean).join(" • ") || location}</span>
              </div>
            )}
            { (date || time) && (
              <div className={styles.metaRow}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icon}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{[date, time].filter(Boolean).join(" • ")}</span>
              </div>
            )}
          </div>

          <div className={styles.description}>
            [Placeholder for Event Description]
          </div>

          <div className={styles.locationFooter}>
            <h3 className={`font-display ${styles.locationTitle}`}>Location</h3>
            <p className={styles.addressText}>
              [Placeholder for Event Address]
            </p>
            <p className={styles.mapsLink}>
              [Placeholder for Google Maps Link]
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
