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
      setTime(
        new Date().toLocaleString("ar-TN", {
          timeZone: "Africa/Tunis",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ================= DASHBOARD ================= */}
      <div
        style={{
          width: "100%",
          minHeight: "100%", // ✅ بدل 100vh
          backgroundImage: "url('/dashboard-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >

        {/* 🔴 RED BAR */}
        <div style={styles.redBar}>
          <div style={styles.marquee}>
            🇹🇳 وزارة العدل - {courtName} • 🇹🇳 وزارة العدل - {courtName} •
          </div>
        </div>

        {/* 🔵 BLUE BAR */}
        <div style={styles.blueBar}>
          <div style={styles.marquee}>
            ⏰ {time} • {/* ✅ حذف التكرار */}
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <h1>🏛️ {courtName}</h1>
          <h2>👤 {user?.fullName}</h2>
        </div>

      </div>

      {/* ================= INLINE STYLE ================= */}
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
   INLINE STYLES OBJECT
========================= */
const styles = {
  content: {
    position: "relative",
    zIndex: 2,
    color: "white",
    padding: "30px",
    marginTop: "100px", // ✅ بدل top
  },

  marquee: {
    whiteSpace: "nowrap",
    display: "inline-block",
    paddingLeft: "100%",
    animation: "move 15s linear infinite",
    fontWeight: "bold",
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






