import React, { useState } from "react";

export default function CourtDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 NEW STATE
  const [openDoor, setOpenDoor] = useState(false);
  const [enterDashboard, setEnterDashboard] = useState(false);

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
                🏛️ {user?.court_name || "المحكمة"}
              </h1>

              <h2 style={styles.sub}>
                👋 مرحبا {user?.fullName}
              </h2>

              <p style={styles.text}>اضغط هنا للدخول</p>

              <button onClick={handleEnter} style={styles.btn}>
                الدخول
              </button>

            </div>
          )}

        </div>
      )}

      {/* 🔥 ORIGINAL DASHBOARD */}
      {enterDashboard && (
        <div style={styles.card}>
          <h1>🏛️ المحكمة الابتدائية</h1>

          <h2>👋 مرحبا {user?.fullName}</h2>

          <p>📍 {user?.court_name || "غير محدد"}</p>
        </div>
      )}

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

  /* 🔥 GATE */
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

  /* 🔥 DOOR */
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

  /* 🔥 ORIGINAL CARD */
  card: {
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    width: "400px",
  },
};

