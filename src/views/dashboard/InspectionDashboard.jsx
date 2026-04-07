import React from "react";

export default function InspectionDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>🕵️ التفقدية العامة</h1>

        <h2>👋 مرحبا {user?.fullName}</h2>

        <p>📊 لوحة مراقبة جميع المحاكم</p>

        <p>⚖️ نظام التفقدية - إدارة مركزية</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1220",
    color: "white",
  },

  card: {
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.06)",
    textAlign: "center",
    width: "420px",
  },
};
