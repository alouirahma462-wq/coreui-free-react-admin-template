import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function InspectionDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [time, setTime] = useState("");

  const userName = "التفقدية العامة - الإدارة المركزية";

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const day = now.toLocaleDateString("ar-TN", {
        weekday: "long",
        timeZone: "Africa/Tunis",
      });

      const clock = now.toLocaleString("ar-TN", {
        timeZone: "Africa/Tunis",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setTime(`${day} • ⏰ ${clock}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.wrapper}>

      {/* 🔵 BLUE BAR ONLY */}
      <div style={styles.blueBar}>
        <div style={styles.marquee}>
          📅 {time}
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <div style={styles.card}>
          <h1>🕵️ التفقدية العامة</h1>
          <h2>🏛️ {userName}</h2>

          <p>📊 لوحة مراقبة جميع المحاكم</p>
          <p>⚖️ نظام التفقدية - إدارة مركزية</p>
        </div>
      </div>

      <style>
        {`
          @keyframes move {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>

    </div>
  );
}

/* =========================
   STYLE (FIXED CLEAN)
========================= */
const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    backgroundImage: "url('/dashboard-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowX: "hidden",
  },

  content: {
    position: "relative",
    zIndex: 2,
    padding: "30px",
    paddingTop: "120px", // 🔥 مهم حتى ما يغطيه الهيدر + الشريط
  },

  card: {
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    padding: "22px",
    borderRadius: "18px",
    color: "white",
    maxWidth: "450px",
  },

  marquee: {
    whiteSpace: "nowrap",
    display: "inline-block",
    paddingLeft: "100%",
    animation: "move 18s linear infinite",
    fontWeight: "bold",
  },

  blueBar: {
    position: "fixed",
    top: "0px",
    left: 0,
    width: "100%",
    height: "40px",
    background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1000,
    color: "white",
  },
};








