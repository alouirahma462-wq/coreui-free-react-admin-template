import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function CourtDashboard() {
  const [user, setUser] = useState({});
  const [enter, setEnter] = useState(false);
  const [time, setTime] = useState("");

  const courtName = user?.court_name || "المحكمة";

  // ================= LOAD USER SAFE =================
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      setUser({});
    }
  }, []);

  // ================= TIME =================
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleString("ar-TN", {
          timeZone: "Africa/Tunis",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>

      {/* ================= GATE ================= */}
      {!enter && (
        <div style={styles.gate}>
          <div style={styles.card}>
            <h1>🏛️ {courtName}</h1>
            <h2>👋 مرحبا {user?.fullName || "مستخدم"}</h2>
            <button onClick={() => setEnter(true)} style={styles.btn}>
              الدخول
            </button>
          </div>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      {enter && (
        <div style={styles.dashboard}>

          <div style={styles.topBar}>
            🇹🇳 وزارة العدل - {courtName}
          </div>

          <div style={styles.timeBar}>
            ⏰ {time}
          </div>

          <div style={styles.content}>
            <div style={styles.cardBox}>
              <h1>🏛️ {courtName}</h1>
              <h2>👤 {user?.fullName || "مستخدم"}</h2>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

/* ================= SAFE STYLES ================= */
const styles = {
  page: {
    width: "100%",
    minHeight: "100%",
    color: "white",
  },

  gate: {
    position: "fixed",
    inset: 0,
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  dashboard: {
    width: "100%",
    minHeight: "100%",
  },

  topBar: {
    position: "sticky",
    top: 0,
    background: "#b91c1c",
    padding: "10px",
    zIndex: 10,
  },

  timeBar: {
    position: "sticky",
    top: "40px",
    background: "#1e3a8a",
    padding: "8px",
    textAlign: "center",
  },

  content: {
    padding: "20px",
  },

  card: {
    textAlign: "center",
    padding: "30px",
    background: "rgba(0,0,0,0.6)",
    borderRadius: "12px",
  },

  cardBox: {
    padding: "30px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
  },

  btn: {
    marginTop: "10px",
    padding: "12px 30px",
    borderRadius: "8px",
    background: "gold",
    border: "none",
    cursor: "pointer",
  },
};




