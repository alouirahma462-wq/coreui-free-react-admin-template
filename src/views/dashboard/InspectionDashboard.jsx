import React, { useState, useEffect } from "react";

export default function InspectionDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [openDoor, setOpenDoor] = useState(false);
  const [enterDashboard, setEnterDashboard] = useState(false);

  const [time, setTime] = useState("");

  const userName = user?.fullName || "المستخدم";

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

      {/* 🔥 GATE SCREEN */}
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

              <h1 style={styles.title}>
                🕵️ التفقدية العامة
              </h1>

              <h2 style={styles.sub}>
                👋 مرحبا {userName}
              </h2>

              <p style={styles.text}>
                اضغط للدخول إلى لوحة المراقبة
              </p>

              <button onClick={handleEnter} style={styles.btn}>
                الدخول
              </button>

            </div>
          )}

        </div>
      )}

      {/* 🔥 DASHBOARD */}
      {enterDashboard && (
        <>
          {/* 🔴 TOP BAR */}
          <div style={styles.topBar}>
            <div style={styles.marqueeTrack}>
              <div style={styles.marqueeText}>
                🇹🇳 وزارة العدل - التفقدية العامة - إشراف مركزي
              </div>
              <div style={styles.marqueeText}>
                🇹🇳 وزارة العدل - التفقدية العامة - إشراف مركزي
              </div>
            </div>
          </div>

          {/* 🔵 TIME BAR */}
          <div style={styles.timeBar}>
            ⏰ {time}
          </div>

          {/* CARD */}
          <div style={styles.card}>
            <h1>🕵️ التفقدية العامة</h1>

            <h2>👋 مرحبا {userName}</h2>

            <p>📊 لوحة مراقبة جميع المحاكم</p>

            <p>⚖️ نظام التفقدية - إدارة مركزية</p>
          </div>
        </>
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
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },

  gate: {
    position: "absolute",
    width: "100%",
    height: "100%",
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

  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },

  sub: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  text: {
    fontSize: "16px",
    marginBottom: "15px",
    opacity: 0.8,
  },

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
    height: "100%",
    backgroundImage: "url('/court-door.png')",
    backgroundSize: "200% 100%",
    backgroundPosition: "left",
    transformOrigin: "left",
    transition: "1.2s ease-in-out",
  },

  doorRight: {
    width: "50%",
    height: "100%",
    backgroundImage: "url('/court-door.png')",
    backgroundSize: "200% 100%",
    backgroundPosition: "right",
    transformOrigin: "right",
    transition: "1.2s ease-in-out",
  },

  topBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: "#b91c1c",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    zIndex: 9999,
  },

  marqueeTrack: {
    display: "flex",
    width: "max-content",
    animation: "move 15s linear infinite",
  },

  marqueeText: {
    whiteSpace: "nowrap",
    paddingRight: "120px",
    fontWeight: "bold",
  },

  timeBar: {
    position: "fixed",
    top: "40px",
    width: "100%",
    height: "35px",
    background: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    zIndex: 9998,
  },

  card: {
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    width: "420px",
  },
};


