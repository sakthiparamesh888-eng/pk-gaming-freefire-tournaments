// src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, getLocalUser } from "../services/sheetsApi.js";
import "../styles/booking.css";

const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_NUMBER;
const PLAYER_ACCESS_URL = import.meta.env.VITE_SHEETS_PLAYER_ACCESS_URL;

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tournament = location.state?.tournament;

  const savedUser = getLocalUser();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!savedUser) {
      navigate("/login", {
        state: { redirectTo: "/booking", tournament },
      });
    }
  }, [savedUser, navigate, tournament]);

  if (!savedUser) return null;

  // User input fields
  const [form, setForm] = useState({
    ffUid: savedUser?.ffUid || "",
    ffName: savedUser?.ffName || "",
    levelConfirmed: false,
  });

  const [paymentDone, setPaymentDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingWA, setLoadingWA] = useState(false);

  if (!tournament) {
    return (
      <div className="page page-booking">
        <p className="error-text">No tournament selected.</p>
        <button className="btn-primary" onClick={() => navigate("/tournaments")}>
          Go to Tournaments
        </button>
      </div>
    );
  }

  // Handle form input
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "ffUid") {
      const cleaned = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, ffUid: cleaned }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // FAST WHATSAPP REDIRECT
  function openWhatsAppFast(text) {
    setLoadingWA(true);
    const encoded = encodeURIComponent(text);

    const raw = String(WHATSAPP_NUM || "").replace(/[^\d]/g, "");
    const fullNumber = raw.length === 10 ? `91${raw}` : raw;

    const waWeb = `https://wa.me/${fullNumber}?text=${encoded}`;
    const waApp = `whatsapp://send?phone=${fullNumber}&text=${encoded}`;

    window.location.href = waApp;
    setTimeout(() => (window.location.href = waWeb), 350);
  }

  // Confirm Booking
  async function handleConfirm() {
    if (saving) return;

    const now = new Date();

    const slotOpen = tournament.slotOpenTime ? new Date(tournament.slotOpenTime) : null;
    const slotClose = tournament.slotCloseTime ? new Date(tournament.slotCloseTime) : null;

    if (slotOpen && now < slotOpen) {
      alert("Booking not opened yet!");
      return;
    }

    if (slotClose && now > slotClose) {
      alert("Slot Booking Closed!");
      return;
    }

    if (!form.levelConfirmed) {
      alert("Please confirm that your Free Fire level is 40+.");
      return;
    }

    if (!paymentDone) {
      alert("Please confirm that you have completed the payment.");
      return;
    }

    if (!form.ffUid || form.ffUid.length < 8) {
      alert("Free Fire UID must be at least 8 digits.");
      return;
    }

    const realName = savedUser.gamerName;
    const phone = savedUser.phone;

    if (!phone || String(phone).replace(/\D/g, "").length !== 10) {
      alert("Your saved WhatsApp number must be 10 digits.");
      return;
    }

    setSaving(true);
    setMessage("");

    const booking = {
      tournamentId: tournament.id,
      tournamentTitle: tournament.title,
      mode: tournament.mode,
      subMode: tournament.subMode || "",
      entryFee: tournament.entryFee,
      ffUid: form.ffUid,
      ffName: form.ffName,
      realName,
      phone,
      levelConfirmed: !!form.levelConfirmed,
      paidConfirmed: !!paymentDone,
      createdAt: new Date().toISOString(),
    };

    const waMsg = [
      "*PK Esports – Tournament Booking*",
      "",
      `Tournament: ${tournament.title} (${tournament.id})`,
      `Mode: ${tournament.mode}${tournament.subMode ? " • " + tournament.subMode : ""}`,
      `Entry: ₹${tournament.entryFee}`,
      "",
      `FF UID: ${form.ffUid}`,
      `FF Name: ${form.ffName}`,
      `Real Name: ${realName}`,
      `Phone: ${phone}`,
      "",
      "Level: 40+ (confirmed)",
      "Payment: Done (user confirmed)",
    ].join("\n");

    try {
      const result = await createBooking(booking);

      if (result?.success === false && result?.reason === "duplicate") {
        alert("⚠ You have already booked this tournament.");
        setSaving(false);
        return;
      }

      await fetch(PLAYER_ACCESS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          phone,
          match_id: tournament.id,
          paid: "YES",
        }),
      });

      setMessage("Booking saved. Opening WhatsApp…");
    } catch (err) {
      console.error(err);
      setMessage("Could not save booking, opening WhatsApp anyway.");
    }

    openWhatsAppFast(waMsg);

    setTimeout(() => {
      setSaving(false);
      setPaymentDone(false);
      setForm((prev) => ({
        ...prev,
        ffUid: savedUser?.ffUid || "",
        ffName: savedUser?.ffName || "",
        levelConfirmed: false,
      }));
      navigate("/tournaments");
    }, 1000);
  }

  return (
    <div className="page page-booking glass-card">
      {loadingWA && (
        <div className="wa-spinner-overlay">
          <div className="wa-spinner"></div>
          <p>Opening WhatsApp…</p>
        </div>
      )}

      <h1>Booking – {tournament.title}</h1>

      <div className="booking-details">
        <p><strong>Mode:</strong> {tournament.mode}{tournament.subMode ? " • " + tournament.subMode : ""}</p>
        <p><strong>Entry Fee:</strong> ₹{tournament.entryFee}</p>
        <p><strong>Slots:</strong> {tournament.currentPlayers}/{tournament.maxPlayers}</p>
      </div>

      <div className="booking-details" style={{ marginTop: 16 }}>
        <p><strong>Gamer Name:</strong> {savedUser.gamerName}</p>
        <p><strong>WhatsApp:</strong> {savedUser.phone}</p>
      </div>

      <form className="booking-form" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>

        {/* PAYMENT QR SECTION */}
        <div className="payment-box" style={{
          marginTop: "20px",
          padding: "20px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h3 style={{ marginBottom: "10px" }}>Scan & Pay</h3>

          <img
            src="/qr-code.png"
            alt="Payment QR"
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          />

          <p className="info-text">
            After payment, check the box below and continue.
          </p>
        </div>

        <label>
          Free Fire UID
          <input type="text" name="ffUid" value={form.ffUid} onChange={handleChange} placeholder="Enter your Free Fire UID" />
        </label>

        <label>
          Free Fire Name
          <input type="text" name="ffName" value={form.ffName} onChange={handleChange} placeholder="Your Free Fire profile name" />
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="levelConfirmed" checked={form.levelConfirmed} onChange={handleChange} />
          My Free Fire level is 40+.
        </label>

        <label className="checkbox-row">
          <input type="checkbox" checked={paymentDone} onChange={() => setPaymentDone(v => !v)} />
          I have completed the payment.
        </label>

        <div className="booking-actions">
          <button type="submit" className="btn-primary btn-full" disabled={saving}>
            {saving ? "Saving & Opening WhatsApp…" : "Confirm & Send on WhatsApp"}
          </button>
          <button type="button" className="btn-secondary btn-full" onClick={() => navigate("/tournaments")}>
            Cancel
          </button>
        </div>

        {message && <p className="info-text" style={{ marginTop: 10 }}>{message}</p>}
      </form>
    </div>
  );
}
