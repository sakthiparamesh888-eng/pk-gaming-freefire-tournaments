// src/pages/HomePage.jsx
import React from "react";
import HeroSlider from "../components/HeroSlider.jsx";
import BackgroundVideo from "../components/BackgroundVideo.jsx";

export default function HomePage() {
  const brSlides = [
    {
      tag: "BR TOURNAMENT",
      title: "Daily BR Custom Rooms",
      description: "48 players, intense zone fights, zero hackers.",
      ctaText: "View BR Tournaments",
      ctaLink: "/tournaments",
      meta: { entry: 29, prize: 499, size: 48 },
    },
    {
      tag: "RANK PUSH",
      title: "Diamond to Heroic Grind",
      description: "Level 40+ only. Sweat lobbies for serious grinders.",
      ctaText: "Join Now",
      ctaLink: "/tournaments",
      meta: { entry: 59, prize: 999, size: 48 },
    },
    {
      tag: "WEEKEND SPECIAL",
      title: "Triple Prize Pool Sunday",
      description: "Limited lobbies, triple prize money, live stream.",
      ctaText: "Check Schedule",
      ctaLink: "/tournaments",
      meta: { entry: 79, prize: 1999, size: 48 },
    },
    {
      tag: "CLAN WARS",
      title: "Clan vs Clan BR Battles",
      description: "Represent your clan and dominate the map.",
      ctaText: "Register Clan",
      ctaLink: "/tournaments",
      meta: { entry: 49, prize: 1499, size: 48 },
    },
    {
      tag: "NO EMULATORS",
      title: "Mobile Only Fair Play",
      description: "Device check, strict rules, no cheating tolerated.",
      ctaText: "View Rules",
      ctaLink: "/about",
      meta: { entry: 30, prize: 500, size: 48 },
    },
  ];

  const csSlides = [
    {
      tag: "CS 1V1",
      title: "1v1 Ego Fights",
      description: "Prove your aim. Pure 1v1, no excuses.",
      ctaText: "View CS Tournaments",
      ctaLink: "/tournaments",
      meta: { entry: 19, prize: 299, size: 2 },
    },
    {
      tag: "CS 2V2",
      title: "Duo Clutch Rooms",
      description: "Perfect for best friends and duo mains.",
      ctaText: "Book a Slot",
      ctaLink: "/tournaments",
      meta: { entry: 29, prize: 499, size: 4 },
    },
    {
      tag: "CS 3V3",
      title: "Trios Tactics",
      description: "Coordination and callouts win these lobbies.",
      ctaText: "Check CS Slots",
      ctaLink: "/tournaments",
      meta: { entry: 39, prize: 799, size: 6 },
    },
    {
      tag: "CS 4V4",
      title: "Full Squad Faceoff",
      description: "Classic esports style 4v4 battles.",
      ctaText: "See Prize Pool",
      ctaLink: "/tournaments",
      meta: { entry: 49, prize: 1299, size: 8 },
    },
    {
      tag: "RANKED CS",
      title: "Ranked Clash Squad Rooms",
      description: "Sweaty ranked feel with custom rules.",
      ctaText: "Join Ranked CS",
      ctaLink: "/tournaments",
      meta: { entry: 29, prize: 599, size: 8 },
    },
  ];

  return (
    <BackgroundVideo>
      <div className="page page-home">
        {/* Top hero text */}
        <section className="hero-main glass-card hero-main-neon">
          <h1>BR Esport Tournaments & CS Battles</h1>
          <p>
            PAN-India Free Fire tournaments powered by PK Esports — secure
            rooms, anti-cheat monitoring, live DB slot tracking & instant
            WhatsApp confirmations.
          </p>
        </section>

        {/* BR + CS sliders */}
        <HeroSlider sectionTitle="BR Esport Tournaments" slides={brSlides} />
        <HeroSlider sectionTitle="CS Tournaments" slides={csSlides} />

        {/* Rules section */}
        <section className="home-highlight glass-card rules-card">
          <h2>RULES TO BE FOLLOWED</h2>
          <div className="rules-grid">
            <div className="rule-chip">
              <h3>Anti-Cheat & Fair Play</h3>
              <p>
                Hackers / Macro / Panel = instant ban. Any form of cheating
                (Aimbot, ESP, GFX hacks, macros, mouse panel, keymapping,
                headshot tools) leads to permanent ban from PK Esports
                tournaments. Suspicious gameplay will be reviewed by admin.
              </p>
            </div>

            <div className="rule-chip">
              <h3>Device & Account Rules</h3>
              <p>
                Only 1 PC player per team allowed. Level 40+ accounts only.
                Switching devices, sharing accounts, or guest accounts are not
                allowed. Players must join using the same UID given in booking.
              </p>
            </div>

            <div className="rule-chip">
              <h3>Behaviour & Match Rules</h3>
              <p>
                Respect & discipline are mandatory. Toxic behaviour or spam in
                WhatsApp lobby = instant removal. Join rooms within 2 minutes
                after ID/PW is shared. No teaming, griefing or AFK. Admin
                decision is final.
              </p>
            </div>
          </div>
        </section>
      </div>
    </BackgroundVideo>
  );
}
