// src/services/sheetsApi.js

const TOURNAMENTS_URL = import.meta.env.VITE_SHEETS_TOURNAMENTS_URL; // SHEET 2
const BOOKINGS_URL = import.meta.env.VITE_SHEETS_BOOKINGS_URL;       // SHEET 3
const USERS_URL = import.meta.env.VITE_SHEETS_USERS_URL;             // SHEET 1
const PLAYER_ACCESS_URL = import.meta.env.VITE_SHEETS_PLAYERACCESS_URL; // SHEET 4

const LOCAL_USER_KEY = "pk_esports_user";

/* ============================================================
   ⭐ SHEET 2 → TOURNAMENTS  (UPDATED)
============================================================ */
export async function fetchTournaments() {
  const res = await fetch(TOURNAMENTS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load tournaments from sheet");

  const rows = await res.json();

  /* ⭐ NEW → Fetch PlayerAccess sheet */
  let playerAccess = [];
  if (PLAYER_ACCESS_URL) {
    try {
      const res2 = await fetch(PLAYER_ACCESS_URL, { cache: "no-store" });
      if (res2.ok) playerAccess = await res2.json();
    } catch (err) {
      console.warn("PlayerAccess fetch failed:", err);
    }
  }

  return rows
    .filter((row) => {
      const av =
        String(
          row.available ??
            row.Available ??
            row.availability ??
            row.Availability ??
            ""
        )
          .toLowerCase()
          .trim();

      return av === "yes" || av === "true" || av === "open" || av === "1";
    })
    .map((row, idx) => {
      const modeRaw = row.mode ?? row.Mode ?? "";
      let mode = "BR";
      if (typeof modeRaw === "string") {
        const m = modeRaw.toLowerCase();
        if (m === "cs" || m === "clash squad") mode = "CS";
      }

      // ENTRY FEE
      const feeRaw = row.entryFee ?? row.EntryFee ?? 0;
      const feeClean = String(feeRaw).toLowerCase().trim();
      let entryFee = 0;
      if (feeClean !== "free" && feeClean !== "") {
        entryFee = parseInt(feeClean.replace(/[^\d]/g, ""), 10) || 0;
      }

      const basePlayers =
        Number(row.currentPlayers ?? row.CurrentPlayers ?? 0);

      /* ⭐ FINAL FIX:

         Your PlayerAccess sheet columns are:
         - phone
         - match_id
         - paid

         So we match:
         - p.match_id === tournament.id
         - p.paid === "yes"
      */
      const verifiedPlayers = playerAccess.filter(
        (p) =>
          String(p.match_id).trim() ===
            String(row.id ?? row.ID ?? idx + 1).trim() &&
          String(p.paid).toLowerCase().trim() === "yes"
      ).length;

      return {
        id: row.id ?? row.ID ?? idx + 1,
        mode,
        subMode: row.subMode ?? row.SubMode ?? "",
        title: row.title ?? row.Title ?? "PK Esports Room",

        // ⭐ Prize Pool
        prizePool:
          row.prizePool ??
          row.PrizePool ??
          row.prize ??
          row.Prize ??
          null,

        entryFee,

        maxPlayers: Number(
          row.maxPlayers ?? row.MaxPlayers ?? (mode === "BR" ? 48 : 8)
        ),

        currentPlayers: basePlayers + verifiedPlayers,

        minLevel: Number(row.minLevel ?? row.MinLevel ?? 40),

        slotOpenTime: row.slotOpenTime ?? row.SlotOpenTime ?? null,
        slotCloseTime: row.slotCloseTime ?? row.SlotCloseTime ?? null,
        matchStartTime: row.matchStartTime ?? row.MatchStartTime ?? null,
        matchCloseTime: row.matchCloseTime ?? row.MatchCloseTime ?? null,

        status: row.status ?? row.Status ?? "Open",
        category: row.category ?? row.Category ?? null,
        image: row.image ?? row.Image ?? row.img ?? row.Img ?? null,

        available:
          row.available ??
          row.Available ??
          row.availability ??
          row.Availability,
      };
    });
}

/* ============================================================
   SHEET 3 → BOOKINGS
============================================================ */
export async function createBooking(booking) {
  if (!BOOKINGS_URL)
    throw new Error("Bookings sheet URL (VITE_SHEETS_BOOKINGS_URL) missing");

  const res = await fetch(BOOKINGS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(booking),
  });

  let text = "";
  try {
    text = await res.text();
  } catch {}

  try {
    return JSON.parse(text); // success / duplicate
  } catch {
    return { success: true };
  }
}

/* ⭐ Fetch All Bookings */
export async function fetchBookings() {
  const res = await fetch(BOOKINGS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load bookings");
  return await res.json();
}

/* ============================================================
   SHEET 1 → USERS (Signup)
============================================================ */
export async function registerUser(user) {
  if (!USERS_URL)
    throw new Error("Users sheet URL (VITE_SHEETS_USERS_URL) missing");

  const res = await fetch(USERS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(user),
  });

  let text = "";
  try {
    text = await res.text();
  } catch {}

  try {
    return JSON.parse(text);
  } catch {
    return { success: true };
  }
}

/* ============================================================
   LOGIN → Check Phone + Password
============================================================ */
export async function loginUser({ phone, password }) {
  if (!USERS_URL)
    throw new Error("Users sheet URL (VITE_SHEETS_USERS_URL) missing");

  const res = await fetch(USERS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load users");

  const rows = await res.json();

  const cleanPhone = String(phone).replace(/[^\d]/g, "");

  const match = rows.find((row) => {
    const rowPhone = String(row.phone || "").replace(/[^\d]/g, "");
    const rowPass = String(row.password || "");
    return rowPhone === cleanPhone && rowPass === String(password);
  });

  if (!match) return { success: false, error: "invalid_credentials" };

  const user = {
    gamerName: match.gamerName || "",
    phone: match.phone,
  };

  return { success: true, user };
}

/* ============================================================
   LOCAL STORAGE HELPERS
============================================================ */
export function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveLocalUser(user) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export function clearLocalUser() {
  localStorage.removeItem(LOCAL_USER_KEY);
}
