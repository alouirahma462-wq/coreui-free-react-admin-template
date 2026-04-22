import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function CourtDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [time, setTime] = useState("");

  const courtName = user?.court_name || "المحكمة";

  useEffect(() => {
    const fetchCourt = async () => {
      if (!user?.court_name && user?.court_id) {
        const { data } = await supabase
          .from("courts")
          .select("name")
          .eq("id", user.court_id)
          .single();

        const updatedUser = {
          ...user,
          court_name: data?.name || "المحكمة",
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    };

    fetchCourt();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setTime(
        now.toLocaleString("ar-TN", {
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
    <>
      <div style={styles.wrapper}>

        {/* 🔴 RED BAR */}
        <div style={styles.redBar}>
          <div style={styles.marquee}>
            🇹🇳 وزارة العدل - {courtName} • الجمهورية التونسية •
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
            <h1>🏛️ {courtName}</h1>
            <h2>👤 {user?.fullName}</h2>
          </div>
        </div>

      </div>

      <style>
        {`
          @keyframes move {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </>
  );
}

/* =========================
   STYLES (FIXED + CLEAN)
========================= */
const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    backgroundImage: "url('/dashboard-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowX: "hidden", // 🔥 يمنع الخط الغريب/الكرسر
  },

  content: {
    paddingTop: "100px", // تحت الهيدر
    padding: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "15px",
    color: "white",
    maxWidth: "420px",
  },

  marquee: {
    whiteSpace: "nowrap",
    display: "inline-block",
    paddingLeft: "100%",
    animation: "move 15s linear infinite",
    fontWeight: "bold",
  },

  redBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: "#b91c1c",
    color: "white",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1000,
  },

  blueBar: {
    position: "fixed",
    top: "40px",
    left: 0,
    width: "100%",
    height: "40px",
    background: "#1e3a8a",
    color: "white",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1000,
  },
};






