import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function CourtDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [time, setTime] = useState("");

  const courtName = user?.court_name || "المحكمة";

  /* ================= FETCH COURT ================= */
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

  /* ================= LIVE CLOCK ================= */
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

        {/* 🔴 TOP BAR */}
        <div style={styles.redBar}>
          <div style={styles.marqueeInner}>
            🇹🇳 وزارة العدل - {courtName} • الجمهورية التونسية •
          </div>
        </div>

        {/* 🔵 SECOND BAR */}
        <div style={styles.blueBar}>
          <div style={styles.marqueeInner}>
            ⏰ {time} •
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <div style={styles.card}>
            <h1>🏛️ {courtName}</h1>
            <h2>👤 {user?.fullName || "المستخدم"}</h2>

            <p style={{ marginTop: 10, opacity: 0.8 }}>
              لوحة المحكمة الرئيسية
            </p>
          </div>
        </div>

      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes move {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </>
  );
}

/* ================= STYLE ================= */
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

  /* ================= CONTENT ================= */
  content: {
    paddingTop: "110px", // مهم جداً لتحت الشريطين
    paddingLeft: "20px",
    paddingRight: "20px",
  },

  card: {
    maxWidth: "450px",
    padding: "20px",
    borderRadius: "15px",

    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",

    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  /* ================= MARQUEE ================= */
  marqueeInner: {
    whiteSpace: "nowrap",
    display: "inline-block",
    paddingLeft: "100%",
    animation: "move 18s linear infinite",
    fontWeight: "bold",
  },

  /* ================= TOP BAR ================= */
  redBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: "#b91c1c",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1000,
    color: "white",
  },

  /* ================= SECOND BAR ================= */
  blueBar: {
    position: "fixed",
    top: "40px",
    left: 0,
    width: "100%",
    height: "40px",
    background: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1000,
    color: "white",
  },
};






