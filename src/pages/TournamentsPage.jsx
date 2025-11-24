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

  const filtered = tournaments.filter((t) => {
    // Mode filter
    if (modeFilter !== "ALL" && t.mode !== modeFilter) return false;

    // CS submode filter
    if (
      modeFilter === "CS" &&
      csTypeFilter !== "ALL" &&
      t.subMode !== csTypeFilter
    ) {
      return false;
    }

    // Search filter (id or title)
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

        {/* MAIN LOOP */}
        {filtered.map((t) => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
      </div>
    </div>
  );
}
