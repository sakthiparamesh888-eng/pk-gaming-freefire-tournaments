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

  useEffect(() => {
    if (!savedUser) window.location.href = "/login";
  }, [savedUser]);

  useEffect(() => {
    async function load() {
      try {
        const res1 = await fetch(BOOKINGS_URL);
        const allBookings = await res1.json();

        const filtered = allBookings.filter(
          (b) => String(b.phone).trim() === String(savedUser?.phone).trim()
        );

        const res2 = await fetch(PLAYER_ACCESS_URL);
        const accessData = await res2.json();

        setPlayerAccess(accessData);
        setMyBookings(filtered.reverse());
      } catch (err) {
        console.error("Failed:", err);
      }

      setLoading(false);
    }

    if (savedUser) load();
  }, [savedUser]);

  if (loading) return <div className="page">Loading…</div>;

  function getStatus(matchId) {
    const record = playerAccess.find(
      (p) =>
        String(p.phone).trim() === String(savedUser.phone).trim() &&
        String(p.match_id).trim() === String(matchId).trim()
    );

    if (!record) return "Unknown";

    return record.paid === "YES"
      ? "Verified (Paid)"
      : "Pending Admin Verification";
  }

  return (
    <div className="page booking-page">
      <div className="booking-header glass-card">
        <h1>My Bookings</h1>
        <p className="sub">
          These are the tournaments you have booked.
        </p>
      </div>

      {myBookings.length === 0 ? (
        <p className="no-books">You have not booked any tournaments yet.</p>
      ) : (
        <div className="booking-list">
          {myBookings.map((item, i) => (
            <div key={i} className="booking-card neon-card">
              <div className="b-row">
                <span className="b-label">Match ID</span>
                <span className="b-value">#{item.tournamentId}</span>
              </div>

              <div className="b-row">
                <span className="b-label">Title</span>
                <span className="b-value">{item.tournamentTitle}</span>
              </div>

              <div className="b-row">
                <span className="b-label">Mode</span>
                <span className="b-value">{item.mode}</span>
              </div>

              <div className="b-row">
                <span className="b-label">Entry Fee</span>
                <span className="b-value">₹{item.entryFee}</span>
              </div>

              <div className="b-row">
                <span className="b-label">Booked At</span>
                <span className="b-value small">{item.createdAt}</span>
              </div>

              <div className="b-row status-row">
                <span className="b-label">Status</span>
                <span
                  className={
                    getStatus(item.tournamentId).includes("Verified")
                      ? "status verified"
                      : "status pending"
                  }
                >
                  {getStatus(item.tournamentId)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
