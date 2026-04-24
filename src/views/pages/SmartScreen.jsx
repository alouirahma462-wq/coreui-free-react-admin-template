import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doorImg from "../assets/court-door.png";

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
    ? "مرحبا بك في التفقدية العامة - الإدارة المركزية"
    : `مرحبا بك في ${courtName}`;

  const handleEnter = () => {
    setOpen(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div style={styles.wrapper}>

      {/* BACKGROUND */}
      <div style={styles.overlay} />

      {/* CENTER CONTENT */}
      <div style={styles.card}>

        <img src={doorImg} alt="door" style={styles.door} />

        <h1 style={styles.title}>{courtName}</h1>

        <h2 style={styles.subTitle}>{greeting}</h2>

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
    backgroundImage: "url('/court-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
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
    width: "400px",
  },

  door: {
    width: "180px",
    marginBottom: "15px",
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
    animation: "float 3s ease-in-out infinite",
  },

  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },

  subTitle: {
    fontSize: "14px",
    opacity: 0.85,
    marginBottom: "10px",
  },

  welcome: {
    fontSize: "14px",
    marginBottom: "20px",
  },

  button: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",

    background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    color: "white",
    fontWeight: "bold",

    boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
  },

  modal: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
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
