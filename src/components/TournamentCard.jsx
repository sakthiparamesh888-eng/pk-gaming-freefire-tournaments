// src/components/TournamentCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tournament-card.css";

import { getLocalUser, fetchBookings } from "../services/sheetsApi";

function formatDateTime(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";

  const timePart = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const datePart = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${datePart} • ${timePart}`;
}

export default function TournamentCard({ tournament }) {
  const navigate = useNavigate();

  // ⭐ NEW: Already booked system
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  useEffect(() => {
    async function checkBooking() {
      const user = getLocalUser();
      if (!user) return;

      try {
        const bookings = await fetchBookings();

        const found = bookings.some(
          (b) =>
            String(b.tournamentId) === String(tournament.id) &&
            String(b.phone) === String(user.phone)
        );

        if (found) setAlreadyBooked(true);
      } catch (err) {
        console.error("Booking check failed", err);
      }
    }

    checkBooking();
  }, [tournament.id]);

  // ---- Read new structure ----
  const {
    id,
    title,
    mode,
    subMode,
    entryFee,
    maxPlayers,
    currentPlayers,
    minLevel,
    status,
    category,
    image,
    slotOpenTime,
    slotCloseTime,
    matchStartTime,
    matchCloseTime,
  } = tournament;

  // ---------- PROGRESS ----------
  const filledPct =
    maxPlayers && maxPlayers > 0
      ? Math.round((currentPlayers / maxPlayers) * 100)
      : 0;

  const slotsFull = maxPlayers && currentPlayers >= maxPlayers;

  // ---------- TIME CONVERSIONS ----------
  const now = new Date();

  const openTime = slotOpenTime ? new Date(slotOpenTime) : null;
  const closeTime = slotCloseTime ? new Date(slotCloseTime) : null;
  const startTime = matchStartTime ? new Date(matchStartTime) : null;
  const endTime = matchCloseTime ? new Date(matchCloseTime) : null;

  // ---------- TIME CONDITIONS ----------
  const beforeOpen = openTime && now < openTime;
  const duringBooking = openTime && closeTime && now >= openTime && now <= closeTime;
  const afterBookingBeforeMatch = closeTime && startTime && now > closeTime && now < startTime;
  const isPlaying = startTime && now >= startTime && (!endTime || now <= endTime);
  const isFinished = endTime && now > endTime;

  // ---------- BUTTON LOGIC ----------
  let bookLabel = "Book Slot";
  let disabled = false;

  if (alreadyBooked) {
    bookLabel = "Already Booked";
    disabled = true;
  } else if (beforeOpen) {
    bookLabel = "Coming Soon";
    disabled = true;
  } else if (duringBooking) {
    bookLabel = "Book Slot";
    disabled = false;
  } else if (afterBookingBeforeMatch) {
    bookLabel = "Registration Closed";
    disabled = true;
  } else if (isPlaying) {
    bookLabel = "Match Playing";
    disabled = true;
  } else if (slotsFull) {
    bookLabel = "Slots Full";
    disabled = true;
  } else if (isFinished) {
    bookLabel = "Match Finished";
    disabled = true;
  }

  // BOOK BUTTON CLICK
  function handleBook() {
    if (disabled) return;
    navigate("/booking", { state: { tournament } });
  }

  function handleRoomAccess() {
    navigate("/verify-access", { state: { matchId: id } });
  }

  return (
    <div className="glass-card t-card">
      {/* 🔥 Inner background */}
      {image && (
        <div
          className="t-inner-bg"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      <div className="t-card-content">
        <div className="t-header">
          <div>
            <p className="t-id">ID: #{id}</p>
            <h3>{title}</h3>
          </div>
          <div className="t-header-right">
            {category && <span className="t-category-chip">{category}</span>}
            <span
              className={
                isPlaying
                  ? "t-status t-status-live"
                  : isFinished
                  ? "t-status t-status-closed"
                  : beforeOpen
                  ? "t-status t-status-upcoming"
                  : slotsFull
                  ? "t-status t-status-closed"
                  : duringBooking
                  ? "t-status t-status-live"
                  : "t-status t-status-closed"
              }
            >
              {isPlaying
                ? "PLAYING"
                : isFinished
                ? "FINISHED"
                : beforeOpen
                ? "Upcoming"
                : slotsFull
                ? "Slots Full"
                : duringBooking
                ? "Open"
                : "Closed"}
            </span>
          </div>
        </div>

        <p className="t-mode">
          {mode === "CS" ? "Clash Squad" : "Battle Royale"}
          {subMode ? ` • ${subMode}` : ""}
        </p>

        {/* Details */}
        <div className="t-details">
          <div>
            <span className="t-label">Entry</span>
            <span className="t-value">{entryFee ? `₹${entryFee}` : "Free"}</span>
          </div>
          <div>
            <span className="t-label">Slots</span>
            <span className="t-value">
              {currentPlayers}/{maxPlayers}
            </span>
          </div>
          <div>
            <span className="t-label">Min Level</span>
            <span className="t-value">{minLevel}+</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="t-progress">
          <div className="t-progress-bar">
            <div
              className="t-progress-fill"
              style={{ width: `${Math.min(filledPct, 100)}%` }}
            />
          </div>
          <p className="t-progress-text">
            {filledPct}% filled
            {filledPct >= 70 && filledPct < 100 && (
              <span className="t-fast"> • Filling fast</span>
            )}
          </p>
        </div>

        {/* Time Display */}
        <div className="t-times">
          <div>
            <span className="t-label">Booking Opens</span>
            <span className="t-value">{formatDateTime(slotOpenTime)}</span>
          </div>
          <div>
            <span className="t-label">Booking Closes</span>
            <span className="t-value">{formatDateTime(slotCloseTime)}</span>
          </div>
          <div>
            <span className="t-label">Match Starts</span>
            <span className="t-value">{formatDateTime(matchStartTime)}</span>
          </div>
        </div>

        {/* BOOK BUTTON */}
        <button
          className="btn-primary btn-full"
          onClick={handleBook}
          disabled={disabled}
        >
          {bookLabel}
        </button>

        {/* ROOM ACCESS */}
        <button className="btn-secondary btn-full" onClick={handleRoomAccess}>
          Room Access
        </button>
      </div>
    </div>
  );
}
