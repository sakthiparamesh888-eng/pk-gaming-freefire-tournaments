// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import '../styles/login.css'
import {
  registerUser,
  getLocalUser,
  saveLocalUser,
  clearLocalUser,
} from "../services/sheetsApi.js";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getLocalUser());
  const [form, setForm] = useState({
    gamerName: "",
    ffUid: "",
    ffName: "",
    phone: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    // FF UID — numbers only
    if (name === "ffUid") {
      const cleaned = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, ffUid: cleaned }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSignup(e) {
    e.preventDefault();

    if (!form.gamerName || !form.ffUid || !form.ffName || !form.phone) {
      alert("Please fill all fields.");
      return;
    }

    if (form.ffUid.length < 8) {
      alert("Free Fire UID must be at least 8 digits and numbers only.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      gamerName: form.gamerName,
      ffUid: form.ffUid,
      ffName: form.ffName,
      phone: form.phone,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await registerUser(payload);
      const storedUser = {
        ...payload,
        id: res.id ?? undefined,
      };

      saveLocalUser(storedUser);
      setUser(storedUser);

      // 🔥 redirect back to booking if redirected earlier
      if (location.state?.redirectTo === "/booking") {
        navigate("/booking", { state: { tournament: location.state.tournament } });
        return;
      }

      setMessage("Signup successful. You are now logged in on this device.");
    } catch (err) {
      console.error(err);
      setMessage("Error while signing up. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearLocalUser();
    setUser(null);
    setForm({
      gamerName: "",
      ffUid: "",
      ffName: "",
      phone: "",
    });
    setMessage("You have logged out on this device.");
  }

  // ✔ Already logged in
  if (user) {
    return (
      <div className="page glass-card">
        <h1>My Account</h1>
        <p className="page-subtitle">
          You already signed up. You will stay logged in on this device – no
          need to login every time.
        </p>

        <div className="booking-details">
          <p><strong>Gamer Name:</strong> {user.gamerName}</p>
          <p><strong>FF UID:</strong> {user.ffUid}</p>
          <p><strong>FF Name:</strong> {user.ffName}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>

        <button className="btn-secondary" onClick={handleLogout}>
          Logout on this device
        </button>

        {message && <p className="info-text" style={{ marginTop: 8 }}>{message}</p>}
      </div>
    );
  }

  // ✔ Signup UI
  return (
    <div className="page glass-card">
      <h1>Signup</h1>
      <p className="page-subtitle">
        Create your PK Esports player profile once. Next time you visit from
        this device you will be auto-logged in.
      </p>

      <form className="booking-form" onSubmit={handleSignup}>
        <label>
          Gamer Name
          <input
            type="text"
            name="gamerName"
            value={form.gamerName}
            onChange={handleChange}
            placeholder="Your in-game name"
          />
        </label>

        <label>
          Free Fire UID
          <input
            type="text"
            name="ffUid"
            value={form.ffUid}
            onChange={handleChange}
            placeholder="Enter your Free Fire UID"
          />
        </label>

        <label>
          Free Fire Name
          <input
            type="text"
            name="ffName"
            value={form.ffName}
            onChange={handleChange}
            placeholder="Your Free Fire profile name"
          />
        </label>

        <label>
          Phone Number (WhatsApp)
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit WhatsApp number"
          />
        </label>

        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Create Account"}
        </button>

        {message && <p className="info-text">{message}</p>}
      </form>
    </div>
  );
}
