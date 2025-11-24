// src/pages/RoomDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/global.css";

const ROOM_DETAILS_URL = import.meta.env.VITE_SHEETS_ROOM_DETAILS_URL;
const PLAYER_ACCESS_URL = import.meta.env.VITE_SHEETS_PLAYER_ACCESS_URL;

export default function RoomDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const matchId = location.state?.matchId || "";
  const accessPhone = location.state?.phone || "";

  const [roomData, setRoomData] = useState(undefined); // ⭐ IMPORTANT
  const [isAllowed, setIsAllowed] = useState(false);

  const [loadingAccess, setLoadingAccess] = useState(true);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [error, setError] = useState("");

  // ---------------- ACCESS CHECK ----------------
  useEffect(() => {
    async function verifyAccess() {
      if (!accessPhone) {
        setError("Access denied. Invalid phone.");
        setLoadingAccess(false);
        return;
      }

      try {
        const res = await fetch(PLAYER_ACCESS_URL);
        const sheet = await res.json();

        const access = sheet.find(
          (row) =>
            String(row.phone).trim() === String(accessPhone).trim() &&
            String(row.match_id).trim() === String(matchId).trim() &&
            String(row.paid).toLowerCase().trim() === "yes"
        );

        if (!access) {
          setError("You have not booked this match or payment is pending.");
        } else {
          setIsAllowed(true);
        }
      } catch (err) {
        setError("Server error. Cannot verify your access.");
      }

      setLoadingAccess(false);
    }

    verifyAccess();
  }, [matchId, accessPhone]);

  // ---------------- ROOM DETAILS ----------------
  useEffect(() => {
    if (!isAllowed) return;

    async function loadRoom() {
      setLoadingRoom(true);

      try {
        const res = await fetch(ROOM_DETAILS_URL);
        const data = await res.json();

        const found = data.find(
          (row) => String(row.match_id).trim() === String(matchId).trim()
        );

        if (!found) {
          setRoomData(null); // ⭐ means NOT FOUND but safe
        } else {
          setRoomData(found);
        }
      } catch (err) {
        setError("Failed to load room details.");
      }

      setLoadingRoom(false);
    }

    loadRoom();
  }, [isAllowed, matchId]);

  // ---------------- LOADING ----------------
  if (loadingAccess || loadingRoom || roomData === undefined) {
    return (
      <div className="page room-page room-details-page glass-card" style={{ padding: 20 }}>
        <h2>Loading Room Details…</h2>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="page room-page room-details-page glass-card" style={{ padding: 20 }}>
        <h2>Room Access</h2>
        <p className="error-text">{error}</p>
        <button className="btn-secondary btn-full" onClick={() => navigate("/tournaments")}>
          Back to Tournaments
        </button>
      </div>
    );
  }

  // ---------------- NOT UPDATED YET ----------------
  if (roomData === null) {
    return (
      <div className="page room-page room-details-page glass-card" style={{ padding: 20 }}>
        <h2>Room Details.Pls Join with in 3 mins</h2>
        <p className="error-text">Room Details Only available at the Starting time of Match Pls Join with in 3 mins.</p>
        <button className="btn-secondary btn-full" onClick={() => navigate("/tournaments")}>
          Back to Tournaments
        </button>
      </div>
    );
  }

  // ---------------- SUCCESS ----------------
  return (
    <div
      className="page room-page room-details-page glass-card"
      style={{ padding: 25, maxWidth: 420, marginTop: 60 }}
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
