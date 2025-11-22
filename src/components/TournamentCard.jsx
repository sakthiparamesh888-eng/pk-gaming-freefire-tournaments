// src/components/TournamentCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tournament-card.css";

function formatDateTime(value) {
  if (!value) return "-";

  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";

  const timePart = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const year = d.getFullYear();
  if (year < 1970) return timePart;

  const datePart = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${datePart} • ${timePart}`;
}

export default function TournamentCard({ tournament }) {
  const navigate = useNavigate();

  const {
    id,
    title,
    mode,
    subMode,
    entryFee,
    maxPlayers,
    currentPlayers,
    minLevel,
    startTime,
    closeTime,
    status,
    category,
    image, // <-- COMING FROM SHEETS
  } = tournament;

  const filledPct =
    maxPlayers && maxPlayers > 0
      ? Math.round((currentPlayers / maxPlayers) * 100)
      : 0;

  const statusLower = String(status || "").toLowerCase();
  const isLive = statusLower === "live";
  const isClosed = statusLower === "closed";

  const statusClass = isClosed
    ? "t-status t-status-closed"
    : isLive
    ? "t-status t-status-live"
    : "t-status t-status-upcoming";

  function handleBook() {
    if (isClosed) return;
    navigate("/booking", { state: { tournament } });
  }
  function handleRoomAccess() {
  navigate("/verify-access", { state: { matchId: id } });
}


  return (
    <div className="glass-card t-card">

      {/* 🔥 Inner blurred background image */}
      {image && (
        <div
          className="t-inner-bg"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* CONTENT */}
      <div className="t-card-content">
        <div className="t-header">
          <div>
            <p className="t-id">ID: #{id}</p>
            <h3>{title}</h3>
          </div>
          <div className="t-header-right">
            {category && <span className="t-category-chip">{category}</span>}
            <span className={statusClass}>
              {isLive ? "LIVE" : isClosed ? "Closed" : "Upcoming"}
            </span>
          </div>
        </div>

        <p className="t-mode">
          {mode === "CS" ? "Clash Squad" : "Battle Royale"}
          {subMode ? ` • ${subMode}` : ""}
        </p>

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

        <div className="t-times">
          <div>
            <span className="t-label">Starts</span>
            <span className="t-value">{formatDateTime(startTime)}</span>
          </div>
          <div>
            <span className="t-label">Slot closes</span>
            <span className="t-value">{formatDateTime(closeTime)}</span>
          </div>
        </div>

        <button
          className="btn-primary btn-full"
          onClick={handleBook}
          disabled={isClosed}
        >
          {isClosed ? "Registration Closed" : "Book Slot"}
        </button>
        <button
  className="btn-secondary btn-full"
  onClick={handleRoomAccess}
>
  Room Access
</button>

      </div>
    </div>
  );
}
