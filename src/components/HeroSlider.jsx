// src/components/HeroSlider.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSlider({ sectionTitle, slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasSlides = slides && slides.length > 0;
  const active = hasSlides ? slides[activeIndex] : null;

  // Touch / drag refs
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);
  const isDragging = useRef(false);

  // ---------- AUTO ROTATE ----------
  useEffect(() => {
    if (!hasSlides || slides.length <= 1) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, [activeIndex, slides, hasSlides]);

  if (!hasSlides) return null;

  // ---------- NAV HELPERS ----------
  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleDotClick = (i) => setActiveIndex(i);

  // ---------- TOUCH + DRAG (MOBILE & DESKTOP) ----------
  const MIN_SWIPE = 40; // px

  function onTouchStart(e) {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = touchStartX.current;
    isDragging.current = true;
  }

  function onTouchMove(e) {
    if (!isDragging.current || !e.touches || e.touches.length === 0) return;
    touchCurrentX.current = e.touches[0].clientX;
  }

  function onTouchEnd() {
    if (!isDragging.current || touchStartX.current == null) return;
    const delta =
      (touchCurrentX.current ?? touchStartX.current) - touchStartX.current;

    if (Math.abs(delta) > MIN_SWIPE) {
      if (delta < 0) goNext();
      else goPrev();
    }

    isDragging.current = false;
    touchStartX.current = null;
    touchCurrentX.current = null;
  }

  // Mouse drag (desktop)
  function onMouseDown(e) {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchCurrentX.current = e.clientX;
  }

  function onMouseMove(e) {
    if (!isDragging.current) return;
    touchCurrentX.current = e.clientX;
  }

  function onMouseUp() {
    if (!isDragging.current || touchStartX.current == null) return;
    const delta =
      (touchCurrentX.current ?? touchStartX.current) - touchStartX.current;

    if (Math.abs(delta) > MIN_SWIPE) {
      if (delta < 0) goNext();
      else goPrev();
    }

    isDragging.current = false;
    touchStartX.current = null;
    touchCurrentX.current = null;
  }

  function onMouseLeave() {
    if (isDragging.current) onMouseUp();
  }

  return (
    <section className="hero-section hero-section-neon">
      {/* Header */}
      <div className="hero-slider-header">
        <div className="hero-slider-left">
          <span className="hero-slider-pill">PK ESPORTS • HIGHLIGHTS</span>
          <h2 className="hero-slider-title">{sectionTitle}</h2>
        </div>

        <div className="hero-slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Card – modal style with swipe / drag */}
      <div
        className="pk-card-shell"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="pk-card">
          <div className="pk-card-glow" />
          <div className="pk-card-inner">
            {/* Top row: tag + live soon */}
            <div className="pk-card-toprow">
              <span className="pk-card-pill">{active.tag}</span>

              <div className="pk-live-wrap">
                <span className="pk-live-dot" />
                <span className="pk-live-text">LIVE SOON</span>
              </div>
            </div>

            {/* Subtitle & title */}
            <p className="pk-card-subtitle">
              {active.meta?.size} PLAYERS • CUSTOM ROOM
            </p>
            <h3 className="pk-card-title">{active.title}</h3>

            {/* Description */}
            <p className="pk-card-desc">{active.description}</p>

            {/* Meta row */}
            <div className="pk-card-metarow">
              <div className="pk-card-meta-box">
                <span className="pk-meta-label">ENTRY</span>
                <span className="pk-meta-value">
                  ₹{active.meta?.entry ?? "--"}
                </span>
              </div>

              <div className="pk-card-meta-box">
                <span className="pk-meta-label">PRIZE POOL</span>
                <span className="pk-meta-value">
                  ₹{active.meta?.prize ?? "--"}
                </span>
              </div>

              <div className="pk-card-meta-box">
                <span className="pk-meta-label">SLOTS</span>
                <span className="pk-meta-value">
                  {active.meta?.size ?? "--"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="pk-card-actions">
              <Link
                to={active.ctaLink || "/tournaments"}
                className="pk-card-btn-main"
              >
                {active.ctaText || "View Tournaments"}
              </Link>
              <span className="pk-card-mini-text">
                Powered by PK Esports • Daily Secure Custom Rooms
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
