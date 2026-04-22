import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function InspectionDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [time, setTime] = useState("");

  const userName = user?.fullName || "المستخدم";

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleString("ar-TN", {
          timeZone: "Africa/Tunis",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.wrapper}>

      {/* 🔴 RED BAR */}
      <div style={styles.redBar}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل - التفقدية العامة • الجمهورية التونسية •
        </div>
      </div>

      {/* 🔵 BLUE BAR */}
      <div style={styles.blueBar}>
        <div style={styles.marquee}>
          ⏰ {time} •
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <div style={styles.card}>
          <h1>🕵️ التفقدية العامة</h1>
          <h2>👋 مرحبا {userName}</h2>

          <p>📊 لوحة مراقبة جميع المحاكم</p>
          <p>⚖️ نظام التفقدية - إدارة مركزية</p>
        </div>
      </div>

      {/* KEYFRAMES */}
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
   STYLE (FIXED + CLEAN)
========================= */

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    backgroundImage: "url('/dashboard-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowX: "hidden", // 🔥 يمنع الخط الغريب
  },

  content: {
    position: "relative",
    zIndex: 2,
    padding: "30px",
    marginTop: "100px",
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "15px",
    color: "white",
    maxWidth: "450px",
  },

  marquee: {
    whiteSpace: "nowrap",
    display: "inline-block",
    animation: "move 15s linear infinite",
    fontWeight: "bold",
    paddingLeft: "100%",
  },

  redBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: "#b91c1c",
    color: "white",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 10,
  },

  blueBar: {
    position: "absolute",
    top: "40px",
    left: 0,
    width: "100%",
    height: "40px",
    background: "#1e3a8a",
    color: "white",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 10,
  },
};






