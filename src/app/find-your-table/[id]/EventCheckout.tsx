"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type TicketOption = {
  id: number;
  name: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  stripePriceId: string;
};

type EventCheckoutProps = {
  title: string | null;
  description: string | null;
  imageUrls: string[] | null;
  venue: string | null;
  city: string | null;
  address: string | null;
  mapsUrl: string | null;
  date: string | null;
  time: string | null;
  ticketOptions: TicketOption[];
};

export default function EventCheckout({
  title,
  description,
  imageUrls,
  venue,
  city,
  address,
  mapsUrl,
  date,
  time,
  ticketOptions,
}: EventCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPriceId, setSelectedPriceId] = useState(
    ticketOptions[0]?.stripePriceId || ""
  );

  const galleryImages = imageUrls ? imageUrls.slice(1) : [];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const selectedOption = ticketOptions.find((o) => o.stripePriceId === selectedPriceId);
  const totalPrice = selectedOption
    ? ((selectedOption.price * quantity) / 100).toFixed(2)
    : "0.00";

  const handleCheckout = async () => {
    alert("Checkout flow is currently disabled while we finalize the design.");
  };

  return (
    <main className={styles.container}>
      <div className={styles.gridContainer}>
        {/* LEFT COLUMN: Image Gallery & Tickets */}
        <div className={styles.leftColumn}>
          {galleryImages.length > 0 ? (
            <div className={styles.galleryContainer}>
              {/* Thumbnails */}
              <div className={styles.thumbnailList}>
                {galleryImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`${styles.thumbnailWrapper} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image src={img} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className={styles.mainImageWrapper}>
                <Image src={galleryImages[currentImageIndex]} alt={title || "Event Image"} fill style={{ objectFit: 'cover' }} />
                
                {galleryImages.length > 1 && (
                  <>
                    <button className={`${styles.navArrow} ${styles.navArrowLeft}`} onClick={handlePrevImage}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button className={`${styles.navArrow} ${styles.navArrowRight}`} onClick={handleNextImage}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyGalleryPlaceholder}>
              No additional images available
            </div>
          )}

          <div className={styles.ticketBox}>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>Ticket Type:</span>
              <div className={styles.ticketToggle}>
                {ticketOptions.map((option) => (
                  <button
                    key={option.stripePriceId}
                    className={`${styles.toggleBtn} ${
                      selectedPriceId === option.stripePriceId ? styles.activeToggle : ""
                    }`}
                    onClick={() => setSelectedPriceId(option.stripePriceId)}
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
          <h1 className={`font-display ${styles.title}`}>{title}</h1>

          <div className={styles.metaInfo}>
            { (venue || city) && (
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
                <span>{[venue, city].filter(Boolean).join(" • ")}</span>
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

          <div className={styles.description} style={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </div>

          <div className={styles.locationFooter}>
            <h3 className={`font-display ${styles.locationTitle}`}>Location</h3>
            <p className={styles.addressText} style={{ whiteSpace: 'pre-wrap' }}>
              {address}
            </p>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapsLink}>
                View on Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
