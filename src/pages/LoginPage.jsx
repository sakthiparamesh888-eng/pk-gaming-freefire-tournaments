// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/login.css";
import {
  registerUser,
  loginUser,
  getLocalUser,
  saveLocalUser,
  clearLocalUser,
} from "../services/sheetsApi.js";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getLocalUser());
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [signupForm, setSignupForm] = useState({
    gamerName: "",
    phone: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    phone: "",
    password: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ----- common redirect helper -----
  function redirectAfterAuth() {
    if (location.state?.redirectTo === "/booking") {
      navigate("/booking", { state: { tournament: location.state.tournament } });
    } else {
      navigate("/");
    }
  }

  // ----- signup handlers -----
  function handleSignupChange(e) {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");

    const { gamerName, phone, password } = signupForm;

    if (!gamerName || !phone || !password) {
      alert("Please fill all fields.");
      return;
    }

    const cleanPhone = phone.replace(/[^\d]/g, "");
    if (cleanPhone.length !== 10) {
      alert("Phone must be a 10-digit number.");
      return;
    }

    if (password.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    setSaving(true);

    const payload = {
      gamerName,
      phone: cleanPhone,
      password,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await registerUser(payload);

      if (res?.success === false && res?.reason === "phone_exists") {
        setMessage("This phone number is already registered. Please login.");
        setMode("login");
        setSaving(false);
        return;
      }

      const storedUser = { gamerName, phone: cleanPhone };
      saveLocalUser(storedUser);
      setUser(storedUser);
      setMessage("Signup successful. You are now logged in.");
      redirectAfterAuth();
    } catch (err) {
      console.error(err);
      setMessage("Error while signing up. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ----- login handlers -----
  function handleLoginChange(e) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    const cleanPhone = loginForm.phone.replace(/[^\d]/g, "");

    if (!cleanPhone || !loginForm.password) {
      alert("Please enter phone and password.");
      return;
    }

    setSaving(true);
    try {
      const res = await loginUser({
        phone: cleanPhone,
        password: loginForm.password,
      });

      if (!res.success) {
        setMessage("Invalid phone or password.");
        setSaving(false);
        return;
      }

      saveLocalUser(res.user);
      setUser(res.user);
      setMessage("Login successful.");
      redirectAfterAuth();
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ----- logout -----
  function handleLogout() {
    clearLocalUser();
    setUser(null);
    setMessage("You have logged out on this device.");
  }

  // ===== Already logged in =====
  if (user) {
    return (
      <div className="page glass-card">
        <h1>My Account</h1>
        <p className="page-subtitle">
          You are logged in on this device. You can book tournaments directly.
        </p>

        <div className="booking-details">
          <p>
            <strong>Gamer Name:</strong> {user.gamerName}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
        </div>

        <button className="btn-secondary" onClick={handleLogout}>
          Logout on this device
        </button>

        {message && (
          <p className="info-text" style={{ marginTop: 8 }}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // ===== LOGIN + SIGNUP UI =====
  return (
    <div className="page glass-card">
      <div className="tab-header">
        <button
          type="button"
          className={`tab-btn ${mode === "login" ? "active" : ""}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === "signup" ? "active" : ""}`}
          onClick={() => setMode("signup")}
        >
          Signup
        </button>
      </div>

      {mode === "login" ? (
        <>
          <h1>Login</h1>
          <p className="page-subtitle">
            Login with your registered WhatsApp number and password.
          </p>

          <form className="booking-form" onSubmit={handleLogin}>
            <label>
              Phone Number (WhatsApp)
              <input
                type="tel"
                name="phone"
                value={loginForm.phone}
                onChange={handleLoginChange}
                placeholder="10-digit WhatsApp number"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
              />
            </label>

            <button className="btn-primary" disabled={saving}>
              {saving ? "Logging in..." : "Login"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>Signup</h1>
          <p className="page-subtitle">
            Create your PK Esports account once. Next time you will be auto-logged in
            on this device.
          </p>

          <form className="booking-form" onSubmit={handleSignup}>
            <label>
              Gamer Name
              <input
                type="text"
                name="gamerName"
                value={signupForm.gamerName}
                onChange={handleSignupChange}
                placeholder="Your in-game name"
              />
            </label>

            <label>
              Phone Number (WhatsApp)
              <input
                type="tel"
                name="phone"
                value={signupForm.phone}
                onChange={handleSignupChange}
                placeholder="10-digit WhatsApp number"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                placeholder="Choose a password"
              />
            </label>

            <button className="btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create Account"}
            </button>
          </form>
        </>
      )}

      {message && <p className="info-text">{message}</p>}
    </div>
  );
}
