import React from "react";
import "../styles/contact.css";


import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa";

const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function ContactPage() {
  const wa = `https://wa.me/${WHATSAPP_NUM.replace(
    /\+/g,
    ""
  )}?text=${encodeURIComponent(
    "Hi PK Esports, I have a query regarding tournaments."
  )}`;

  return (
    <div className="main-content page">
      <h1 className="page-title">Contact Us</h1>
      <p className="page-subtitle">
        Feel free to reach out for tournament help, booking, or partnership.
      </p>

      {/* CONTACT CARD */}
      <div className="glass-card contact-card">
        <h2 className="contact-title">We’re Always Online</h2>
        <p className="contact-desc">
          PK Esports support team is available 24/7. Contact us anytime!
        </p>

        <div className="contact-grid">
          {/* EMAIL */}
          <a href="mailto:pkgaming@gmail.com" className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div>
              <h3>Email</h3>
              <p>pkgaming@gmail.com</p>
            </div>
          </a>

          {/* INSTAGRAM */}
          <a
            href="https://instagram.com"
            target="_blank"
            className="contact-item"
          >
            <FaInstagram className="contact-icon insta" />
            <div>
              <h3>Instagram</h3>
              <p>@pk_esports_official</p>
            </div>
          </a>

          {/* FACEBOOK */}
          <a
            href="https://www.facebook.com/share/19fybSGUXv/?mibextid=wwXIfr"
            target="_blank"
            className="contact-item"
          >
            <FaFacebook className="contact-icon fb" />
            <div>
              <h3>Facebook</h3>
              <p>PK Gaming Official</p>
            </div>
          </a>

          {/* YOUTUBE */}
          <a
            href="https://youtube.com/@pkgamingliv?si=epT6dcHngOyqX3dx"
            target="_blank"
            className="contact-item"
          >
            <FaYoutube className="contact-icon yt" />
            <div>
              <h3>YouTube</h3>
              <p>PK Gaming Tamil</p>
            </div>
          </a>
        </div>

        {/* WHATSAPP BUTTON */}
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="btn-primary btn-full"
          style={{ marginTop: "20px" }}
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
