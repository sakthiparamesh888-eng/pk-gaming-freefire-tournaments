// src/pages/TournamentsPage.jsx

import React, { useEffect, useState } from "react";
import { fetchTournaments } from "../services/sheetsApi.js";
import TournamentCard from "../components/TournamentCard.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modeFilter, setModeFilter] = useState("ALL");
  const [csTypeFilter, setCsTypeFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  // -------------------------------
  // Popup for first-time visitors
  // -------------------------------
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("visited_tournaments_page");

    if (!visited) {
      setShowPopup(true);
      localStorage.setItem("visited_tournaments_page", "yes");
    }
  }, []);

  // -------------------------------
  // Fetch tournaments
  // -------------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTournaments();
        setTournaments(data);
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // -------------------------------
  // Filtering
  // -------------------------------
  const filtered = tournaments.filter((t) => {
    if (modeFilter !== "ALL" && t.mode !== modeFilter) return false;

    if (
      modeFilter === "CS" &&
      csTypeFilter !== "ALL" &&
      t.subMode !== csTypeFilter
    ) {
      return false;
    }

    if (
      searchText &&
      !(
        `${t.id}`.toLowerCase().includes(searchText.toLowerCase()) ||
        `${t.title}`.toLowerCase().includes(searchText.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="page page-tournaments">

      {/* ---------------- POPUP ---------------- */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box glass-card">
            <h2>Only Squad Entry Allowed</h2>
<p>
  For squads, only <strong>1 player needs to register</strong>.  
  Your full team will be added by the admin after confirmation.
</p>


            <button
              className="btn-primary"
              style={{ marginTop: "15px" }}
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* ---------------------------------------- */}

      <h1 className="page-title"></h1>
      <p className="page-subtitle"></p>

      <CategoryFilter
        modeFilter={modeFilter}
        setModeFilter={setModeFilter}
        csTypeFilter={csTypeFilter}
        setCsTypeFilter={setCsTypeFilter}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {loading && <p className="info-text">Loading tournaments…</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="t-grid">
        {!loading && !filtered.length && (
          <p className="info-text">
            No tournaments match the filter right now. Check again later.
          </p>
        )}

        {filtered.map((t) => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
      </div>
    </div>
  );
}
