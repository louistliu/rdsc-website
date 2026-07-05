"use client";

import React, { useState, useRef } from "react";
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
  const [cart, setCart] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const galleryImages = imageUrls ? imageUrls.slice(1) : [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const slideWidth = scrollRef.current.offsetWidth;
      const activeIndex = Math.round(scrollPosition / slideWidth);
      if (activeIndex !== currentImageIndex) {
        setCurrentImageIndex(activeIndex);
      }
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'auto'
      });
      setCurrentImageIndex(index);
    }
  };

  const handleNextImage = () => {
    scrollToImage((currentImageIndex + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    scrollToImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleAddToCart = (priceId: string) => {
    setCart((prev) => ({ ...prev, [priceId]: 1 }));
  };

  const updateQuantity = (priceId: string, delta: number) => {
    setCart((prev) => {
      const option = ticketOptions.find((o) => o.stripePriceId === priceId);
      const remaining = option ? Math.max(0, option.capacity - option.ticketsSold) : 0;
      
      const newQty = Math.max(0, Math.min(remaining, (prev[priceId] || 0) + delta));
      return { ...prev, [priceId]: newQty };
    });
  };

  const totalCents = ticketOptions.reduce((acc, option) => {
    const qty = cart[option.stripePriceId] || 0;
    return acc + (option.price * qty);
  }, 0);

  const totalPrice = (totalCents / 100).toFixed(2);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleCheckout = async () => {
    if (totalItems === 0) {
      alert("Please add at least one ticket to your cart.");
      return;
    }
    setLoading(true);

    const items = ticketOptions
      .filter((option) => (cart[option.stripePriceId] || 0) > 0)
      .map((option) => ({
        priceId: option.stripePriceId,
        quantity: cart[option.stripePriceId],
      }));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
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
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      console.error("Checkout error:", error);
      alert(errorMsg);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.gridContainer}>
        {/* GALLERY AREA */}
        {galleryImages.length > 0 ? (
          <div className={styles.galleryArea}>
            <div className={styles.thumbnailList}>
              {galleryImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnailWrapper} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                  onClick={() => scrollToImage(index)}
                >
                  <Image src={img} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            
            <div className={styles.mainImageWrapper}>
              <div 
                className={styles.imageScrollTrack}
                ref={scrollRef}
                onScroll={handleScroll}
              >
                {galleryImages.map((img, idx) => (
                  <div key={idx} className={styles.imageSlide}>
                    <Image src={img} alt={title || "Event Image"} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              
              {galleryImages.length > 1 && (
                <>
                  <button className={`${styles.navArrow} ${styles.navArrowLeft}`} onClick={handlePrevImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button className={`${styles.navArrow} ${styles.navArrowRight}`} onClick={handleNextImage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>

                  <div className={styles.dotIndicators}>
                    {galleryImages.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`${styles.dot} ${idx === currentImageIndex ? styles.dotActive : ''}`}
                        onClick={() => scrollToImage(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={`${styles.galleryArea} ${styles.emptyGalleryPlaceholder}`}>
            No additional images available
          </div>
        )}

        {/* DETAILS AREA */}
        <div className={styles.detailsArea}>
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

        {/* TICKET AREA (DRAWER ON MOBILE) */}
        <div className={`${styles.ticketArea} ${isTicketDrawerOpen ? styles.drawerOpen : ''}`}>
          <div className={styles.ticketBox}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.ticketBoxTitle}>Tickets</h2>
              <button className={styles.closeDrawerBtn} onClick={() => setIsTicketDrawerOpen(false)}>×</button>
            </div>
            
            <div className={styles.cartList}>
              {ticketOptions.map((option) => {
                const qty = cart[option.stripePriceId] || 0;
                const remaining = Math.max(0, option.capacity - option.ticketsSold);
                const isSoldOut = remaining <= 0;
                
                return (
                  <div key={option.stripePriceId} className={styles.cartItemRow}>
                    <div className={styles.cartItemInfo}>
                      <span className={styles.cartItemName}>{option.name}</span>
                      <span className={styles.cartItemPrice}>€{(option.price / 100).toFixed(2)}</span>
                    </div>
                    
                    {isSoldOut ? (
                      <div className={styles.soldOutBtn}>Sold Out</div>
                    ) : qty === 0 ? (
                      <button className={styles.addBtn} onClick={() => handleAddToCart(option.stripePriceId)}>
                        Add
                      </button>
                    ) : (
                      <div className={styles.stepperControl}>
                        <button className={styles.stepperBtn} onClick={() => updateQuantity(option.stripePriceId, -1)}>-</button>
                        <span className={styles.stepperValue}>{qty}</span>
                        <button 
                          className={styles.stepperBtn} 
                          onClick={() => updateQuantity(option.stripePriceId, 1)}
                          disabled={qty >= remaining}
                          style={{ opacity: qty >= remaining ? 0.3 : 1, cursor: qty >= remaining ? 'not-allowed' : 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.totalRow}>
              <span className={styles.ticketLabel}>Total:</span>
              <span className={styles.totalPrice}>€{totalPrice}</span>
            </div>

            <button
              className={styles.getSeatsBtn}
              onClick={handleCheckout}
              disabled={loading || totalItems === 0}
            >
              {loading ? "PROCESSING..." : "GET SEATS"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className={styles.mobileStickyBar}>
        <button className={styles.stickyGetTicketsBtn} onClick={() => setIsTicketDrawerOpen(true)}>
          GET TICKETS
        </button>
      </div>
    </main>
  );
}
