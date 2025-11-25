// src/pages/ContactPage.jsx
import React from "react";
import "../styles/contact.css";

import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export default function ContactPage() {
  const cleanWa = WHATSAPP_NUM.replace(/\D/g, "");
  const waLink = cleanWa
    ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(
        "Hi PK Esports, I have a query regarding tournaments."
      )}`
    : "#";

  return (
    <div className="main-content page contact-page">
      {/* Top hero text */}
      <header className="contact-hero">
        <span className="contact-pill">PK ESPORTS • SUPPORT</span>
        <h1 className="contact-hero-title">Contact Us</h1>
        <p className="contact-hero-sub">
          Feel free to reach out for tournament help, booking issues,
          or partnership queries. We’re always listening.
        </p>
      </header>

      {/* Two-column layout (stack on mobile) */}
      <div className="contact-layout">
        {/* LEFT – main support card */}
        <section className="glass-card contact-main-card">
          <div className="contact-main-inner">
            <h2 className="contact-title">We’re Always Online</h2>
            <p className="contact-desc">
              PK Esports support team is available <strong>24/7</strong> during
              match hours. Drop a message any time – we usually respond within
              a few minutes.
            </p>

            {/* Primary quick actions */}
            <div className="contact-primary-actions">
              <a
                href="mailto:pkgaming@gmail.com"
                className="contact-chip"
              >
                <span className="contact-chip-icon">
                  <FaEnvelope />
                </span>
                <span className="contact-chip-text">
                  <span className="chip-label">Email Support</span>
                  <span className="chip-value">pkgamingtamil9940@gmail.com</span>
                </span>
              </a>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="contact-chip contact-chip-whatsapp"
              >
                <span className="contact-chip-icon">
                  <FaWhatsapp />
                </span>
                <span className="contact-chip-text">
                  <span className="chip-label">WhatsApp</span>
                  <span className="chip-value">
                    Direct chat with PK Esports
                  </span>
                </span>
              </a>
            </div>

            <p className="contact-note">
              <span className="dot-live" /> Fastest response via WhatsApp
              during tournament timings.
            </p>
          </div>
        </section>

        {/* RIGHT – social cards */}
        <section className="glass-card contact-social-card">
          <h3 className="contact-social-title">Follow Our Esports Updates</h3>
          <p className="contact-social-sub">
            Room IDs, prize pool upgrades, winners, and highlights – stay
            updated on all platforms.
          </p>

          <div className="contact-grid">
            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/pk_gaming_tamil_official/?igsh=eDB5OXI0cnZxZXF0&utm_source=qr#"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <div className="contact-icon-wrap insta">
                <FaInstagram className="contact-icon" />
              </div>
              <div className="contact-item-text">
                <h4>Instagram</h4>
                <p>@pk_esports_official</p>
              </div>
            </a>

            {/* FACEBOOK */}
            <a
              href="https://www.facebook.com/share/19fybSGUXv/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <div className="contact-icon-wrap fb">
                <FaFacebook className="contact-icon" />
              </div>
              <div className="contact-item-text">
                <h4>Facebook</h4>
                <p>PK Gaming Official</p>
              </div>
            </a>

            {/* YOUTUBE */}
            <a
              href="https://youtube.com/@pkgamingliv?si=epT6dcHngOyqX3dx"
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <div className="contact-icon-wrap yt">
                <FaYoutube className="contact-icon" />
              </div>
              <div className="contact-item-text">
                <h4>YouTube</h4>
                <p>PK Gaming Tamil</p>
              </div>
            </a>
          </div>

          {/* Big WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary contact-whatsapp-btn"
          >
            <FaWhatsapp className="wa-btn-icon" />
            <span>Chat on WhatsApp</span>
          </a>
        </section>
      </div>
    </div>
  );
}
