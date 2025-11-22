// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaGamepad, FaUserAlt, FaPhone, FaListAlt } from "react-icons/fa";
import { getLocalUser } from "../services/sheetsApi.js";
import "../styles/bottomnav.css";

export default function BottomNav() {
  const user = getLocalUser(); // 🔥 check login

  const getClass = ({ isActive }) =>
    isActive ? "b-item active" : "b-item";

  return (
    <nav className="bottom-nav">

      <NavLink to="/" className={getClass}>
        <div className="b-icon">
          <FaHome />
        </div>
        <span className="b-label">Home</span>
      </NavLink>

      <NavLink to="/tournaments" className={getClass}>
        <div className="b-icon">
          <FaGamepad />
        </div>
        <span className="b-label">Play</span>
      </NavLink>

      {/* 🔥 If user logged in → Show MY BOOKINGS */}
      {user ? (
        <NavLink to="/my-bookings" className={getClass}>
          <div className="b-icon">
            <FaListAlt />
          </div>
          <span className="b-label">My Bookings</span>
        </NavLink>
      ) : (
        <NavLink to="/login" className={getClass}>
          <div className="b-icon">
            <FaUserAlt />
          </div>
          <span className="b-label">Account</span>
        </NavLink>
      )}

      <NavLink to="/contact" className={getClass}>
        <div className="b-icon">
          <FaPhone />
        </div>
        <span className="b-label">Contact</span>
      </NavLink>

    </nav>
  );
}
