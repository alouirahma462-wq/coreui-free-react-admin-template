import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AppHeader = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const fullName = user?.fullName || "المستخدم";
  const courtName = user?.court_name || "المحكمة";

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const { data } = await supabase
        .from("users")
        .select("full_name, court_id")
        .eq("id", Number(userId))
        .single();

      if (!data) return;

      let court = "المحكمة";

      if (data.court_id) {
        const { data: c } = await supabase
          .from("courts")
          .select("name")
          .eq("id", data.court_id)
          .single();

        court = c?.name || "المحكمة";
      }

      const updated = {
        fullName: data.full_name,
        court_name: court,
      };

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/", { replace: true }); // 🔥 رجوع للاندنج
  };

  return (
    <header style={styles.header}>

      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.logo}>⚖️</div>
        <div>
          <div style={styles.court}>{courtName}</div>
          <div style={styles.sub}>الجمهورية التونسية</div>
        </div>
      </div>

      {/* CENTER */}
      <div style={styles.center}>
        <div style={styles.userGlow}>
          👤 {fullName}
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <button style={styles.logout} onClick={handleLogout}>
          🚪 خروج
        </button>
      </div>

    </header>
  );
};

export default AppHeader;

/* =========================
   FIXED HEADER STYLE
========================= */

const styles = {
  header: {
    width: "100%",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 15px",

    background: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",

    position: "fixed",
    top: 0,
    left: "260px",
    right: 0,

    zIndex: 9999,
    boxSizing: "border-box", // 🔥 مهم جداً
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
    flexShrink: 0,
  },

  logo: {
    fontSize: "22px",
  },

  court: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#60a5fa",
  },

  sub: {
    fontSize: "11px",
    opacity: 0.7,
  },

  center: {
    flex: 1,
    textAlign: "center",
  },

  userGlow: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(59,130,246,0.15)",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(59,130,246,0.4)",
  },

  right: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0, // 🔥 يمنع اختفاء الزر
  },

  logout: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
};










