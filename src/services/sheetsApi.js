// src/services/sheetsApi.js

const TOURNAMENTS_URL = import.meta.env.VITE_SHEETS_TOURNAMENTS_URL; // SHEET 2
const BOOKINGS_URL = import.meta.env.VITE_SHEETS_BOOKINGS_URL; // SHEET 3
const USERS_URL = import.meta.env.VITE_SHEETS_USERS_URL; // SHEET 1

const LOCAL_USER_KEY = "pk_esports_user";

/**
 * SHEET 2 → Tournaments & availability
 */
export async function fetchTournaments() {
  const res = await fetch(TOURNAMENTS_URL);
  if (!res.ok) throw new Error("Failed to load tournaments from sheet");

  const rows = await res.json();

  return rows
    .filter((row) => {
      const avRaw =
        row.available ??
        row.Available ??
        row.availability ??
        row.Availability ??
        "";

      const av = String(avRaw).toLowerCase().trim();

      return av === "yes" || av === "true" || av === "1" || av === "open";
    })
    .map((row, idx) => {
      const modeRaw = row.mode ?? row.Mode ?? "";
      let mode = "BR";

      if (typeof modeRaw === "string") {
        const m = modeRaw.toLowerCase();
        if (m === "cs" || m === "clash squad") {
          mode = "CS";
        } else {
          mode = "BR";
        }
      }

      const feeRaw = row.entryFee ?? row.EntryFee ?? 0;
      const feeClean = String(feeRaw).toLowerCase().trim();
      let entryFee = 0;
      if (feeClean !== "free" && feeClean !== "") {
        entryFee = parseInt(feeClean.replace(/[^\d]/g, ""), 10) || 0;
      }

      return {
        id: row.id ?? row.ID ?? idx + 1,
        mode,
        subMode: row.subMode ?? row.SubMode ?? "",
        title: row.title ?? row.Title ?? "PK Esports Room",
        entryFee,
        maxPlayers: Number(
          row.maxPlayers ?? row.MaxPlayers ?? (mode === "BR" ? 48 : 8)
        ),
        currentPlayers: Number(row.currentPlayers ?? row.CurrentPlayers ?? 0),
        minLevel: Number(row.minLevel ?? row.MinLevel ?? 40),
        startTime: row.startTime ?? row.StartTime ?? null,
        closeTime: row.closeTime ?? row.CloseTime ?? null,
        status: row.status ?? row.Status ?? "Open",
        category: row.category ?? row.Category ?? null,

        /* ✅ NEW: Load image column from Google Sheet */
        image: row.image ?? row.Image ?? row.img ?? row.Img ?? null,

        available:
          row.available ??
          row.Available ??
          row.availability ??
          row.Availability,
      };
    });
}


/**
 * SHEET 3 → bookings (when user confirms after GPay)
 */
export async function createBooking(booking) {
  if (!BOOKINGS_URL)
    throw new Error(
      "Bookings sheet URL (VITE_SHEETS_BOOKINGS_URL) not configured"
    );

  // Use no-cors + text/plain to avoid CORS preflight blocking the request
  await fetch(BOOKINGS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(booking),
  });

  // We can't read the response in no-cors mode (it will be opaque),
  // but Apps Script will still receive the JSON string in e.postData.contents
  // and append a row. Return a dummy object so BookingPage code works.
  return { success: true };
}

/**
 * SHEET 1 → user signup details
 */
export async function registerUser(user) {
  if (!USERS_URL)
    throw new Error("Users sheet URL (VITE_SHEETS_USERS_URL) not configured");

  // Use no-cors + text/plain to avoid CORS preflight blocking the request
  await fetch(USERS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(user),
  });

  // We can't read the response in no-cors mode (it will be "opaque"),
  // but Apps Script will still receive the JSON string in e.postData.contents
  // and append a row. We just return a dummy object so LoginPage code works.
  return { id: undefined };
}


/******** LOCAL LOGIN HELPERS (no backend auth) ********/

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
