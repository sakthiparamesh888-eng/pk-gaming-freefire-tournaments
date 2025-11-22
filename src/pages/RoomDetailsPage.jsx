import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/global.css"; // keep this

const ROOM_DETAILS_URL = import.meta.env.VITE_SHEETS_ROOM_DETAILS_URL;

export default function RoomDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const matchId = location.state?.matchId || "";
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetails() {
      try {
        const res = await fetch(ROOM_DETAILS_URL);
        const data = await res.json();

        const found = data.find(
          (row) => String(row.match_id).trim() === String(matchId).trim()
        );

        if (!found) {
          setError("Room details not updated by admin yet.");
        } else {
          setRoomData(found);
        }
      } catch (err) {
        setError("Server error. Could not load room details.");
      }
      setLoading(false);
    }

    loadDetails();
  }, [matchId]);


  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="page room-page room-details-page glass-card" style={{ padding: 20 }}>
        <h2>Loading Room Details…</h2>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return (
      <div className="page room-page room-details-page glass-card" style={{ padding: 20 }}>
        <h2>Room Details</h2>
        <p className="error-text">{error}</p>
        <button
          className="btn-secondary btn-full"
          onClick={() => navigate("/tournaments")}
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  // ---------- SUCCESS ----------
  return (
    <div
      className="page room-page room-details-page glass-card"
      style={{ padding: 25, maxWidth: 420 ,marginTop:60 }}
    >
      <h2>Match Room Details</h2>

      <p className="info-text">
        <strong>Match ID:</strong> {matchId}
      </p>

      <div className="room-box" style={{ marginTop: 20 }}>
        <p><strong>Room ID:</strong> {roomData.room_id}</p>
        <p><strong>Password:</strong> {roomData.room_pass}</p>
      </div>

      <div className="prize-box" style={{ marginTop: 25 }}>
        <h3>Prizes</h3>
        <p><strong>1st Prize:</strong> {roomData.prize1}</p>
        <p><strong>2nd Prize:</strong> {roomData.prize2}</p>
        <p><strong>3rd Prize:</strong> {roomData.prize3}</p>
      </div>

      <button
        className="btn-primary btn-full"
        style={{ marginTop: 20 }}
        onClick={() => navigate("/tournaments")}
      >
        Back to Tournaments
      </button>
    </div>
  );
}
