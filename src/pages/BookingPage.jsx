// src/pages/BookingPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, getLocalUser } from "../services/sheetsApi.js";
import "../styles/booking.css";

const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_NUMBER;
const GPayUPI = import.meta.env.VITE_GPAY_UPI_ID;
const PLAYER_ACCESS_URL = import.meta.env.VITE_SHEETS_PLAYER_ACCESS_URL;

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tournament = location.state?.tournament;

  const savedUser = getLocalUser();

  const [form, setForm] = useState({
    ffUid: savedUser?.ffUid || "",
    ffName: savedUser?.ffName || "",
    realName: savedUser?.gamerName || "",
    phone: savedUser?.phone || "",
    levelConfirmed: false,
  });

  const [isPayClicked, setIsPayClicked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePayClick() {
    if (!form.levelConfirmed) {
      alert("You must confirm that your Free Fire level is 40+.");
      return;
    }

    if (!form.ffUid || !form.ffName || !form.realName || !form.phone) {
      alert("Please fill all fields before paying.");
      return;
    }

    setIsPayClicked(true);

    const amount = tournament.entryFee || 0;
    const note = encodeURIComponent(
      `PK Esports ${tournament.title} (${tournament.id})`
    );

    const upiUrl = `upi://pay?pa=${encodeURIComponent(
      GPayUPI
    )}&pn=${encodeURIComponent("PK Esports")}&am=${amount}&cu=INR&tn=${note}`;

    window.location.href = upiUrl;

    setTimeout(() => {
      navigate("/pending-payment", { state: { tournament, form } });
    }, 500);
  }

  async function handleConfirm() {
    if (saving) return;

    if (!isPayClicked) {
      alert("Please click Pay via GPay first.");
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
      createdAt: new Date().toISOString(),
    };

    // WhatsApp message
    const textLines = [
      "*PK Esports – Tournament Booking*",
      "",
      `Tournament: ${tournament.title} (${tournament.id})`,
      `Mode: ${tournament.mode === "BR" ? "BR" : "CS"}${
        tournament.subMode ? ` • ${tournament.subMode}` : ""
      }`,
      `Entry: ₹${tournament.entryFee}`,
      "",
      `FF UID: ${form.ffUid}`,
      `FF Name: ${form.ffName}`,
      `Real Name: ${form.realName}`,
      `Phone: ${form.phone}`,
      "",
      "Level: 40+ (confirmed)",
    ];

    const msg = encodeURIComponent(textLines.join("\n"));
    const phoneDigits = WHATSAPP_NUM.replace(/[^\d]/g, "");
    const waUrl = `https://wa.me/${phoneDigits}?text=${msg}`;

    try {
      const result = await createBooking(booking);

      if (result?.success === false && result?.reason === "duplicate") {
        alert("⚠ You have already booked this tournament.");
        setSaving(false);
        return;
      }

      // 🔥 AUTO INSERT INTO PlayerAccess
      await fetch(PLAYER_ACCESS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          phone: form.phone,
          match_id: tournament.id,
          paid: "NO",
        }),
      });

      setMessage("Booking saved to spreadsheet. Opening WhatsApp…");

    } catch (err) {
      console.error(err);
      setMessage("Could not save booking to sheet. Opening WhatsApp anyway.");
    }

    if (waUrl) window.open(waUrl, "_blank");

    setIsPayClicked(false);
    setSaving(false);

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
      <h1>Booking – {tournament.title}</h1>
      <p className="page-subtitle">
        Fill your Free Fire details, pay via GPay, and then confirm via WhatsApp.
      </p>

      <div className="booking-details">
        <p>
          <strong>Mode:</strong>{" "}
          {tournament.mode === "BR" ? "Battle Royale" : "Clash Squad"}{" "}
          {tournament.subMode ? `• ${tournament.subMode}` : ""}
        </p>
        <p>
          <strong>Entry Fee:</strong> ₹{tournament.entryFee}
        </p>
        <p>
          <strong>Slots:</strong> {tournament.currentPlayers}/{tournament.maxPlayers}
        </p>
        <p>
          <strong>Level Rule:</strong> Only Free Fire accounts level 40+ allowed.
        </p>

        {savedUser ? (
          <p className="info-text">Using details from your PK Esports account.</p>
        ) : (
          <p className="info-text">
            Tip: Signup once to auto-fill your details next time.
          </p>
        )}
      </div>

      <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Free Fire UID
          <input
            type="text"
            name="ffUid"
            value={form.ffUid}
            onChange={handleChange}
            placeholder="Enter your FF UID"
          />
        </label>

        <label>
          Free Fire Name
          <input
            type="text"
            name="ffName"
            value={form.ffName}
            onChange={handleChange}
            placeholder="Your in-game name"
          />
        </label>

        <label>
          Original Name
          <input
            type="text"
            name="realName"
            value={form.realName}
            onChange={handleChange}
            placeholder="Your real name"
          />
        </label>

        <label>
          Phone Number (WhatsApp)
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit WhatsApp number"
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="levelConfirmed"
            checked={form.levelConfirmed}
            onChange={handleChange}
          />
          <span>I confirm my Free Fire account level is 40 or above.</span>
        </label>

        <div className="booking-actions">
          <button type="button" className="btn-secondary" onClick={handlePayClick}>
            Pay via GPay (UPI)
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleConfirm}
            disabled={saving || !isPayClicked}
          >
            Confirm & Send on WhatsApp
          </button>
        </div>

        {message && <p className="info-text">{message}</p>}
      </form>
    </div>
  );
}
