import React from "react";

export default function CourtDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>🏛️ المحكمة الابتدائية</h1>

        <h2>👋 مرحبا {user?.fullName}</h2>

        <p>📍 {user?.court_name || "غير محدد"}</p>
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
    
    // 🔥 FIX: خليه شفاف بالكامل
    background: "transparent",
    color: "white",
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

