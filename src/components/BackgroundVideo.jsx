// src/components/BackgroundVideo.jsx
import React from "react";
import bgVideo from "../assets/bg-video.mp4";

export default function BackgroundVideo({ children }) {
  return (
    <div className="bg-wrapper">
      {/* BACKGROUND VIDEO */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="bg-overlay"></div>

      {/* MAIN CONTENT */}
      <div className="bg-content">{children}</div>
    </div>
  );
}
