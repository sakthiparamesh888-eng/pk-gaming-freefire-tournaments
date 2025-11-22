// src/pages/PaymentPendingPage.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../services/sheetsApi.js";
import "../styles/global.css";

const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function PaymentPendingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const tournament = location.state?.tournament;
  const form = location.state?.form;

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!tournament || !form) {
    return (
      <div className="room-page-container">
        <div className="page page-booking glass-card">
          <h1>Payment Status</h1>
          <p className="info-text">
            Payment details are missing. Please go back and try booking again.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/tournaments")}
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  async function handleSendWhatsApp() {
    if (saving) return;

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
      "",
      "_NOTE: I will attach my GPay payment screenshot to this message._",
    ];

    const msg = encodeURIComponent(textLines.join("\n"));

    const rawNum = typeof WHATSAPP_NUM === "string" ? WHATSAPP_NUM : "";
    const phoneDigits = rawNum.replace(/[^\d]/g, "");
    let waUrl = "";

    if (!phoneDigits) {
      console.error("WHATSAPP_NUM is not configured correctly:", WHATSAPP_NUM);
      alert("WhatsApp number is not configured. Please contact admin.");
    } else {
      waUrl = `https://wa.me/${phoneDigits}?text=${msg}`;
    }

    try {
      await createBooking(booking);
      setMessage("Booking saved. Opening WhatsApp…");
    } catch (err) {
      console.error(err);
      setMessage("Could not save booking to sheet. Opening WhatsApp anyway.");
    }

    if (waUrl) {
      window.open(waUrl, "_blank");
    }

    setSaving(false);
    setTimeout(() => {
      navigate("/tournaments");
    }, 800);
  }

  return (
    <div className="room-page-container">
      <div className="page page-booking glass-card payment-pending-page" style={{ maxWidth: 420 }}>

        <h1>Payment Pending Verification</h1>
        <p className="page-subtitle">
          If you have completed the GPay payment, please send your payment
          screenshot on WhatsApp to confirm your slot.
        </p>

        <div className="booking-details">
          <p>
            <strong>Tournament:</strong> {tournament.title} ({tournament.id})
          </p>
          <p>
            <strong>Mode:</strong>{" "}
            {tournament.mode === "BR" ? "Battle Royale" : "Clash Squad"}{" "}
            {tournament.subMode ? `• ${tournament.subMode}` : ""}
          </p>
          <p>
            <strong>Entry Fee:</strong> ₹{tournament.entryFee}
          </p>
          <p>
            <strong>Player:</strong> {form.ffName} ({form.ffUid})
          </p>
          <p>
            <strong>WhatsApp:</strong> {form.phone}
          </p>
        </div>

        <div className="payment-pending-box">
          <p className="info-text">✅ Step 1: Make sure you have completed the GPay payment.</p>
          <p className="info-text">
            ✅ Step 2: Click the button below to open WhatsApp and{" "}
            <strong>attach your payment screenshot</strong>.
          </p>
          <p className="info-text">✅ Step 3: Admin will verify and mark your slot as paid.</p>
        </div>

        <div className="booking-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/tournaments")}
            disabled={saving}
          >
            Cancel & Back to Tournaments
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSendWhatsApp}
            disabled={saving}
          >
            {saving ? "Processing..." : "Confirm & Send on WhatsApp"}
          </button>
        </div>

        {message && <p className="info-text">{message}</p>}
      </div>
    </div>
  );
}
