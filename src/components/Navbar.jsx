// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import { getLocalUser } from "../services/sheetsApi.js";

export default function Navbar() {
  const [user, setUser] = useState(getLocalUser());

  // 🔥 Listen for login/logout events
  useEffect(() => {
    function updateUser() {
      setUser(getLocalUser());
    }

    window.addEventListener("user-changed", updateUser);

    return () => window.removeEventListener("user-changed", updateUser);
  }, []);

  const setActive = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");

  return (
    <header className="nav-shell">
      <div className="nav-logo">
        <span className="logo-main">PK</span>
        <span className="logo-sub">Esports</span>
      </div>

      <nav className="nav-links desktop-only">
        <NavLink to="/" className={setActive}>Home</NavLink>
        <NavLink to="/tournaments" className={setActive}>Tournaments</NavLink>

        {!user && (
          <NavLink to="/login" className={setActive}>
            Login / Signup
          </NavLink>
        )}

        {user && (
          <NavLink to="/login" className="nav-link gamer-icon">
            🎮
          </NavLink>
        )}

        {user && (
          <NavLink to="/my-bookings" className={setActive}>
            My Bookings
          </NavLink>
        )}

        <NavLink to="/about" className={setActive}>About Us</NavLink>
        <NavLink to="/contact" className={setActive}>Contact Us</NavLink>
      </nav>
    </header>
  );
}
