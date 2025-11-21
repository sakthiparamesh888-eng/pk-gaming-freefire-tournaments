// src/pages/HomePage.jsx
import React from "react";
import HeroSlider from "../components/HeroSlider.jsx";
import BackgroundVideo from "../components/BackgroundVideo.jsx";

export default function HomePage() {
  const brSlides = [
    {
      tag: "BR Tournament",
      title: "Daily BR Custom Rooms",
      description: "48 players, intense zone fights, zero hackers.",
      ctaText: "View BR Tournaments",
      ctaLink: "/tournaments",
      meta: { entry: 29, prize: 499, size: 48 },
    },
    {
      tag: "Rank Push",
      title: "Diamond to Heroic Grind",
      description: "Level 40+ only. Sweat lobbies for serious grinders.",
      ctaText: "Join Now",
      ctaLink: "/tournaments",
      meta: { entry: 59, prize: 999, size: 48 },
    },
    {
      tag: "Weekend Special",
      title: "Triple Prize Pool Sunday",
      description: "Limited lobbies, triple prize money, live stream.",
      ctaText: "Check Schedule",
      ctaLink: "/tournaments",
      meta: { entry: 79, prize: 1999, size: 48 },
    },
    {
      tag: "Clan Wars",
      title: "Clan vs Clan BR Battles",
      description: "Represent your clan and dominate the map.",
      ctaText: "Register Clan",
      ctaLink: "/tournaments",
      meta: { entry: 49, prize: 1499, size: 48 },
    },
    {
      tag: "No Emulators",
      title: "Mobile Only Fair Play",
      description: "Device check, strict rules, no cheating tolerated.",
      ctaText: "View Rules",
      ctaLink: "/about",
      meta: { entry: 0, prize: 0, size: 48 },
    },
  ];

  const csSlides = [
    {
      tag: "CS 1v1",
      title: "1v1 Ego Fights",
      description: "Prove your aim. Pure 1v1, no excuses.",
      ctaText: "View CS Tournaments",
      ctaLink: "/tournaments",
      meta: { entry: 19, prize: 299, size: 2 },
    },
    {
      tag: "CS 2v2",
      title: "Duo Clutch Rooms",
      description: "Perfect for best friends and duo mains.",
      ctaText: "Book a Slot",
      ctaLink: "/tournaments",
      meta: { entry: 29, prize: 499, size: 4 },
    },
    {
      tag: "CS 3v3",
      title: "Trios Tactics",
      description: "Coordination and callouts win these lobbies.",
      ctaText: "Check CS Slots",
      ctaLink: "/tournaments",
      meta: { entry: 39, prize: 799, size: 6 },
    },
    {
      tag: "CS 4v4",
      title: "Full Squad Faceoff",
      description: "Classic esports style 4v4 battles.",
      ctaText: "See Prize Pool",
      ctaLink: "/tournaments",
      meta: { entry: 49, prize: 1299, size: 8 },
    },
    {
      tag: "Ranked CS",
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
        <section className="hero-main glass-card">
          <h1>BR Esport Tournaments & CS Battles</h1>
          <p>
            PAN-India Free Fire tournaments powered by PK Esports — featuring
            secure rooms, anti-cheat monitoring, live Data-Base slot tracking,
            and lightning-fast WhatsApp confirmations.
          </p>
        </section>

        <HeroSlider sectionTitle="BR Esport Tournaments" slides={brSlides} />
        <HeroSlider sectionTitle="CS Tournaments" slides={csSlides} />

        <section className="home-highlight glass-card">
          <h2>RULES TO BE FOLLWED :</h2>
          <div className="home-grid">
            <div className="home-chip">
              <h3>Anti-Cheat & Fair Play</h3>
              <p>
                Hackers / Macro / Panel = Instant Ban Any form of cheating
                (Aimbot, ESP, GFX hacks, Macros, Mouse Panel, Keymapping,
                Headshot tools) leads to permanent ban from all PK Esports
                tournaments. Suspicious gameplay will be reviewed using killcam
                and admin monitoring. If caught, the entire squad may be
                disqualified depending on the case.
              </p>
            </div>

            <div className="home-chip">
              <h3>Device & Account Rules</h3>
              <p>
                Mobile-Only Tournaments Emulator players strictly not allowed
                unless tournament mentions "Open". Only Level 40+ accounts
                permitted to avoid smurfing & unfair advantages. Switching
                devices, sharing accounts, or using guest accounts is not
                allowed. Players must join using the same UID submitted during
                booking.
              </p>
            </div>

            <div className="home-chip">
              <h3>Behaviour & Match Rules</h3>
              <p>
                Respect, Discipline & Timings Toxic behaviour, abuse, or
                spamming in WhatsApp lobby = instant removal. Players must join
                rooms within 2 minutes after ID/PW is shared. No unnecessary
                delays, AFK, teaming, or intentional griefing. Admin decision is
                final in case of conflicts or disputes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </BackgroundVideo>
  );
}
