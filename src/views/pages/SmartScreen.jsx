import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SmartScreen() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [open, setOpen] = useState(false);

  const fullName = user?.fullName || "المستخدم";
  const courtName = user?.court_name || "المحكمة";

  const isInspection = courtName.includes("التفقدية");

  const greeting = isInspection
    ? "مرحبا بك في الإدارة المركزية"
    : `مرحبا بك في ${courtName}`;

  const subGreeting = isInspection
    ? "مرحبا بالتفقدية العامة"
    : "";

  const handleEnter = () => {
    setOpen(true);

    setTimeout(() => {
      if (user?.court_id) {
        navigate(`/court/${user.court_id}`, { replace: true });
      } else {
        navigate("/inspection-dashboard", { replace: true });
      }
    }, 2000);
  };

  return (
    <div style={styles.wrapper}>

      {/* OVERLAY */}
      <div style={styles.overlay} />

      {/* CONTENT */}
      <div style={styles.card}>

        <h1 style={styles.title}>{courtName}</h1>

        <h2 style={styles.subTitle}>{greeting}</h2>

        {subGreeting && (
          <p style={styles.subText}>{subGreeting}</p>
        )}

        <p style={styles.welcome}>👋 مرحباً {fullName}</p>

        <button onClick={handleEnter} style={styles.button}>
          🚪 اضغط للدخول
        </button>

      </div>

      {/* MODAL */}
      {open && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h2>⏳ جار الدخول...</h2>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",

    backgroundImage: "url('/court-door.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "white",

    padding: "30px",
    borderRadius: "20px",

    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.15)",

    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    width: "420px",
  },

  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  subTitle: {
    fontSize: "14px",
    opacity: 0.85,
    marginTop: "10px",
  },

  subText: {
    fontSize: "13px",
    opacity: 0.75,
    marginTop: "5px",
  },

  welcome: {
    fontSize: "14px",
    marginTop: "15px",
    marginBottom: "20px",
  },

  button: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",

    background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    color: "white",
    fontWeight: "bold",
  },

  modal: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  modalBox: {
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
};


