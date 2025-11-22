// src/pages/BookingSummaryPage.jsx
import React, { useEffect, useState } from "react";
import { getLocalUser } from "../services/sheetsApi";
import "../styles/booking.css";

const BOOKINGS_URL = import.meta.env.VITE_SHEETS_BOOKINGS_URL;
const PLAYER_ACCESS_URL = import.meta.env.VITE_SHEETS_PLAYER_ACCESS_URL;

export default function BookingSummaryPage() {
  const savedUser = getLocalUser();
  const [myBookings, setMyBookings] = useState([]);
  const [playerAccess, setPlayerAccess] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!savedUser) {
      window.location.href = "/login";
    }
  }, [savedUser]);

  // Load Bookings + PlayerAccess
  useEffect(() => {
    async function load() {
      try {
        // Load all bookings
        const res1 = await fetch(BOOKINGS_URL);
        const allBookings = await res1.json();

        const filtered = allBookings.filter(
          (b) => String(b.phone).trim() === String(savedUser?.phone).trim()
        );

        // Load PlayerAccess
        const res2 = await fetch(PLAYER_ACCESS_URL);
        const accessData = await res2.json();

        setPlayerAccess(accessData);
        setMyBookings(filtered.reverse());
      } catch (err) {
        console.error("Failed to load booking summary:", err);
      }

      setLoading(false);
    }

    if (savedUser) load();
  }, [savedUser]);

  if (loading) return <div className="page">Loading your bookings…</div>;

  // Find payment status for a booking
  function getStatus(matchId) {
    const record = playerAccess.find(
      (p) =>
        String(p.phone).trim() === String(savedUser.phone).trim() &&
        String(p.match_id).trim() === String(matchId).trim()
    );

    if (!record) return "Unknown / Not Found";

    return record.paid === "YES"
      ? "Verified (Paid)"
      : "Pending (until admin verifies)";
  }

  return (
    <div className="page glass-card">
      <h1>My Bookings</h1>
      <p className="page-subtitle">
        These are the tournaments you have booked.
      </p>

      {myBookings.length === 0 ? (
        <p className="info-text">You have not booked any tournaments yet.</p>
      ) : (
        <div className="booking-list">
          {myBookings.map((item, i) => (
            <div key={i} className="booking-summary-card">
              <p><strong>Match ID:</strong> {item.tournamentId}</p>
              <p><strong>Title:</strong> {item.tournamentTitle}</p>
              <p><strong>Mode:</strong> {item.mode}</p>
              <p><strong>Entry Fee:</strong> ₹{item.entryFee}</p>
              <p><strong>Booked At:</strong> {item.createdAt}</p>
              
              {/* 🔥 Auto Payment Status */}
              <p>
                <strong>Status:</strong> {getStatus(item.tournamentId)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
