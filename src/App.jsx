// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";

// Lazy-loaded pages (FIXED)
const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const TournamentsPage = React.lazy(() => import("./pages/TournamentsPage.jsx"));
const BookingPage = React.lazy(() => import("./pages/BookingPage.jsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const AboutPage = React.lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = React.lazy(() => import("./pages/ContactPage.jsx"));
const AccessCheckPage = React.lazy(() => import("./pages/AccessCheckPage.jsx"));
const RoomDetailsPage = React.lazy(() =>
  import("./pages/RoomDetailsPage.jsx")
);

const PaymentPendingPage = React.lazy(() =>
  import("./pages/PaymentPendingPage.jsx")
);

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
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



        </Route>
      </Routes>
    </Suspense>
  );
}
