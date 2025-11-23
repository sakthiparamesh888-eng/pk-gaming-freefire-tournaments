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

  useEffect(() => {
    if (!savedUser) {
      navigate("/login", {
        state: { redirectTo: "/booking", tournament },
      });
    }
  }, [savedUser, navigate, tournament]);

  if (!savedUser) return null;

  const [form, setForm] = useState({
    ffUid: savedUser?.ffUid || "",
    ffName: savedUser?.ffName || "",
    realName: savedUser?.gamerName || "",
    phone: savedUser?.phone || "",
    levelConfirmed: false,
  });

  const [paymentDone, setPaymentDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingWA, setLoadingWA] = useState(false); // NEW SPINNER STATE

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "ffUid") {
      const cleaned = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, ffUid: cleaned }));
      return;
    }

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ⭐ UNIVERSAL WHATSAPP REDIRECT (FAST + FALLBACK)
  function openWhatsAppFast(text) {
    setLoadingWA(true); // Show spinner instantly
    const encoded = encodeURIComponent(text);

    const wa1 = `whatsapp://send?text=${encoded}`;
    const wa2 = `https://wa.me/?text=${encoded}`;

    // Fastest redirect
    window.location.href = wa1;

    // Fallback in case app URL fails
    setTimeout(() => {
      window.location.href = wa2;
    }, 400);
  }

  async function handleConfirm() {
    if (saving) return;

    if (!form.levelConfirmed) {
      alert("Please confirm that your Free Fire level is 40+.");
      return;
    }

    if (!paymentDone) {
      alert("Please confirm that you have completed the payment.");
      return;
    }

    if (form.ffUid.length < 8) {
      alert("Free Fire UID must be at least 8 digits.");
      return;
    }
    if (!form.phone || form.phone.length !== 10) {
      alert("Phone must be exactly 10 digits.");
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
      realName: form.realName,
      phone: form.phone,
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
      `Real Name: ${form.realName}`,
      `Phone: ${form.phone}`,
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
          phone: form.phone,
          match_id: tournament.id,
          paid: "YES",
        }),
      });

      setMessage("Booking saved. Opening WhatsApp…");
    } catch (err) {
      console.error(err);
      setMessage("Could not save booking, opening WhatsApp anyway.");
    }

    // ⭐ SUPER FAST REDIRECTION
    openWhatsAppFast(waMsg);

    setSaving(false);
    setPaymentDone(false);

    setForm({
      ffUid: savedUser?.ffUid || "",
      ffName: savedUser?.ffName || "",
      realName: savedUser?.gamerName || "",
      phone: savedUser?.phone || "",
      levelConfirmed: false,
    });

    navigate("/tournaments");
  }

  return (
    <div className="page page-booking glass-card">
      {/* LOADING SPINNER OVERLAY */}
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
        <p><strong>Level Rule:</strong> Level 40+ only.</p>

        <p className="info-text">Using details from your PK Esports account.</p>
      </div>

      <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Free Fire UID
          <input type="text" name="ffUid" value={form.ffUid} onChange={handleChange} />
        </label>

        <label>
          Free Fire Name
          <input type="text" name="ffName" value={form.ffName} onChange={handleChange} />
        </label>

        <label>
          Original Name
          <input type="text" name="realName" value={form.realName} onChange={handleChange} />
        </label>

        <label>
          Phone Number (WhatsApp)
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
        </label>

        {/* LEVEL CONFIRM */}
        <label className="checkbox-row">
          <input type="checkbox" name="levelConfirmed" checked={form.levelConfirmed} onChange={handleChange} />
          <span>I confirm my Free Fire level is 40+.</span>
        </label>

        {/* QR PAYMENT UI */}
        <div className="qr-box">
          <h3>Scan & Pay</h3>
          <img src="/qr-code.png" alt="Payment QR Code" className="qr-image" />
        </div>

        {/* PAYMENT CONFIRM */}
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={paymentDone}
            onChange={(e) => setPaymentDone(e.target.checked)}
          />
          <span>I have completed the payment.</span>
        </label>

        {/* CONFIRM BUTTON */}
        <div className="booking-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={handleConfirm}
            disabled={saving || !paymentDone}
          >
            Confirm & Send on WhatsApp
          </button>
        </div>

        {message && <p className="info-text">{message}</p>}
      </form>
    </div>
  );
}
