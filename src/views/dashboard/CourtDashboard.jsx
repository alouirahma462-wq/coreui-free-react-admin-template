import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function CourtDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [openDoor, setOpenDoor] = useState(false);
  const [enterDashboard, setEnterDashboard] = useState(false);

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
      const now = new Date().toLocaleString("ar-TN", {
        timeZone: "Africa/Tunis",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setOpenDoor(true);

    setTimeout(() => {
      setEnterDashboard(true);
    }, 1200);
  };

  return (
    <div style={styles.page}>

      {/* 🔥 GATE */}
      {!enterDashboard && (
        <div style={styles.gate}>

          <div style={styles.doorContainer}>
            <div
              style={{
                ...styles.doorLeft,
                transform: openDoor ? "rotateY(-90deg)" : "rotateY(0deg)",
              }}
            />
            <div
              style={{
                ...styles.doorRight,
                transform: openDoor ? "rotateY(90deg)" : "rotateY(0deg)",
              }}
            />
          </div>

          {!openDoor && (
            <div style={styles.gateCard}>
              <h1 style={styles.title}>🏛️ {courtName}</h1>
              <h2 style={styles.sub}>👋 مرحبا {user?.fullName}</h2>
              <p style={styles.text}>اضغط هنا للدخول</p>

              <button onClick={handleEnter} style={styles.btn}>
                الدخول
              </button>
            </div>
          )}

        </div>
      )}

      {/* 🔥 DASHBOARD (inside layout safe) */}
      {enterDashboard && (
        <div style={styles.dashboardWrapper}>

          <div style={styles.topBar}>
            <div style={styles.marqueeTrack}>
              <div style={styles.marqueeText}>
                🇹🇳 وزارة العدل - {courtName}
              </div>
              <div style={styles.marqueeText}>
                🇹🇳 وزارة العدل - {courtName}
              </div>
            </div>
          </div>

          <div style={styles.timeBar}>
            ⏰ {time}
          </div>

          <div style={styles.content}>
            <div style={styles.card}>
              <h1>🏛️ {courtName}</h1>
              <h2>👋 مرحبا {user?.fullName}</h2>
              <p>📍 {courtName}</p>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}

const styles = {
  /* 🔥 IMPORTANT: يمنع كسر الـ layout */
  page: {
    minHeight: "100%",
    width: "100%",
    position: "relative",
    color: "white",
  },

  /* ===== GATE ===== */
  gate: {
    position: "absolute",
    inset: 0,
    background: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  gateCard: {
    textAlign: "center",
    zIndex: 5,
    padding: "30px",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
  },

  title: { fontSize: "28px", marginBottom: "10px" },
  sub: { fontSize: "20px", marginBottom: "10px" },
  text: { fontSize: "16px", marginBottom: "15px", opacity: 0.8 },

  btn: {
    padding: "14px 40px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "1px solid gold",
    background: "rgba(255,215,0,0.12)",
    color: "gold",
    cursor: "pointer",
  },

  doorContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    perspective: "1200px",
  },

  doorLeft: {
    width: "50%",
    backgroundImage: "url('/court-door.png')",
    backgroundSize: "200% 100%",
    backgroundPosition: "left",
    transformOrigin: "left",
    transition: "1.2s ease-in-out",
  },

  doorRight: {
    width: "50%",
    backgroundImage: "url('/court-door.png')",
    backgroundSize: "200% 100%",
    backgroundPosition: "right",
    transformOrigin: "right",
    transition: "1.2s ease-in-out",
  },

  /* ===== DASHBOARD SAFE WRAPPER ===== */
  dashboardWrapper: {
    width: "100%",
    minHeight: "100%",
  },

  topBar: {
    position: "sticky",
    top: 0,
    height: "40px",
    background: "#b91c1c",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 10,
  },

  timeBar: {
    position: "sticky",
    top: "40px",
    height: "35px",
    background: "#1e3a8a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
  },

  marqueeTrack: {
    display: "flex",
    animation: "move 15s linear infinite",
  },

  marqueeText: {
    whiteSpace: "nowrap",
    paddingRight: "120px",
    fontWeight: "bold",
  },

  content: {
    padding: "20px",
  },

  card: {
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    width: "400px",
  },
};


