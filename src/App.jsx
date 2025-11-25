// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import FloatingAlertButton from "./components/FloatingAlertButton.jsx";

// Lazy-loaded pages
const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const TournamentsPage = React.lazy(() => import("./pages/TournamentsPage.jsx"));
const BookingPage = React.lazy(() => import("./pages/BookingPage.jsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const AboutPage = React.lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = React.lazy(() => import("./pages/ContactPage.jsx"));
const AccessCheckPage = React.lazy(() => import("./pages/AccessCheckPage.jsx"));
const RoomDetailsPage = React.lazy(() => import("./pages/RoomDetailsPage.jsx"));
const PaymentPendingPage = React.lazy(() =>
  import("./pages/PaymentPendingPage.jsx")
);
const BookingSummaryPage = React.lazy(() =>
  import("./pages/BookingSummaryPage.jsx")
);
const RulesPage = React.lazy(() => import("./pages/Rules.jsx"));

// 🔥 READ USER CORRECTLY FROM LOCAL STORAGE
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("pk_esports_user") || "null");
  } catch {
    return null;
  }
};

function AppLayout() {
  const user = getUser(); // 🔥 FIXED

  return (
    <>
      {/* 🔔 Always visible on top of all pages */}
      <FloatingAlertButton phone={user?.phone} />

      {/* Global Navbar */}
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation & Footer */}
      <BottomNav />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="loading-screen">Loading...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pending-payment" element={<PaymentPendingPage />} />
          <Route path="/verify-access" element={<AccessCheckPage />} />
          <Route path="/room-details" element={<RoomDetailsPage />} />
          <Route path="/my-bookings" element={<BookingSummaryPage />} />
          <Route path="/rules" element={<RulesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
