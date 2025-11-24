// src/pages/AccessCheckPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/global.css";

const PLAYER_ACCESS_URL = import.meta.env.VITE_SHEETS_PLAYER_ACCESS_URL;

export default function AccessCheckPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchId = location.state?.matchId || "";

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify() {
    setError("");

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(PLAYER_ACCESS_URL);
      const data = await res.json();

      const found = data.find(
        (row) =>
          String(row.phone).trim() === String(phone).trim() &&
          String(row.match_id).trim() === String(matchId).trim()
      );

      if (!found) {
        setError("No record found. You are not registered for this match.");
        setLoading(false);
        return;
      }

      if (String(found.paid).toLowerCase() !== "yes") {
        setError("Payment Pending. Contact admin.");
        setLoading(false);
        return;
      }

      // SUCCESS → send phone ALSO!
      navigate("/room-details", { state: { matchId, phone } });

    } catch (err) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="room-page-container">
      <div className="page room-page room-access-page glass-card" style={{ padding: 20, maxWidth: 420 }}>
        <h2>Room Access Verification</h2>

        <p className="info-text">
          <strong>Match ID:</strong> {matchId}
        </p>

        <label style={{ marginTop: 10 }}>
          Enter Phone Number
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit WhatsApp number"
          />
        </label>

        {error && <p className="error-text" style={{ marginTop: 10 }}>{error}</p>}

        <button className="btn-primary btn-full" disabled={loading} onClick={handleVerify} style={{ marginTop: 20 }}>
          {loading ? "Checking…" : "Verify Access"}
        </button>

        <button
          className="btn-secondary btn-full"
          style={{ marginTop: 10 }}
          onClick={() => navigate("/tournaments")}
        >
          Back to Tournaments
        </button>
      </div>
    </div>
  );
}
