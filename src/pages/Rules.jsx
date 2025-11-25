import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaStar } from "react-icons/fa";
import "../styles/rules.css";

export default function Rules() {
  return (
    <div className="rules-bg text-white px-5 pb-24 pt-16 overflow-hidden">

      {/* Page Title */}
      <motion.h1
        className="rules-title text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        RULES & INFO
      </motion.h1>

      {/* Cards container */}
      <motion.div
        className="flex flex-col gap-8 mt-10 relative z-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.25 } },
        }}
      >

        {/* MATCH RULES */}
        <motion.div
          className="rules-card"
          variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="rules-header">
            <FaCheckCircle className="rules-icon text-orange-400" />
            <h2 className="rules-section-title">Match Rules</h2>
          </div>

          <ul className="rules-list">
            <li>No hacking, teaming, or modded apps — permanent ban.</li>
            <li>Join lobby within 3 minutes after Room ID is released.</li>
            <li>Matches will not restart for device/internet issues.</li>
            <li>Leaving mid-match removes prize eligibility.</li>
          </ul>
        </motion.div>

        {/* IMPORTANT INFORMATION */}
        <motion.div
          className="rules-card"
          variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="rules-header">
            <FaStar className="rules-icon text-yellow-300" />
            <h2 className="rules-section-title">Important Information</h2>
          </div>

          <ul className="rules-list">
            <li>Room ID & Password released in  5 minutes before match time.</li>
            <li>Prizes distributed within 30 minutes after match ends.</li>
            <li>Winners may need to upload results screenshot.</li>
            <li>Only registered in-game name will be considered.</li>
          </ul>
        </motion.div>

        {/* WARNINGS */}
        <motion.div
          className="rules-card"
          variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
        >
          <div className="rules-header">
            <FaExclamationTriangle className="rules-icon text-red-400" />
            <h2 className="rules-section-title">Warnings</h2>
          </div>

          <ul className="rules-list">
            <li>Toxic behavior = immediate permanent ban.</li>
            <li>Fake payment proofs = account blacklist.</li>
            <li>Incorrect IGN may delay prize distribution.</li>
          </ul>
        </motion.div>

      </motion.div>

      {/* Cinematic bottom fade */}
      <div className="rules-bottom-fade"></div>
    </div>
  );
}
