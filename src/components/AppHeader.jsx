import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AppHeader = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [time, setTime] = useState("");

  const fullName = user?.fullName || "المستخدم";
  const courtName = user?.court_name || "المحكمة";

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const day = now.toLocaleDateString("ar-TN", {
        weekday: "long",
        timeZone: "Africa/Tunis",
      });

      const clock = now.toLocaleString("ar-TN", {
        timeZone: "Africa/Tunis",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setTime(`${day} • ${clock}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    navigate("/", { replace: true });
  };

  return (
    <header style={styles.header}>

      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.court}>{courtName}</div>
        <div style={styles.sub}>الجمهورية التونسية</div>
      </div>

      {/* CENTER (TIME) */}
      <div style={styles.center}>
        📅 {time}
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.user}>👤 {fullName}</div>

        <button style={styles.logout} onClick={handleLogout}>
          🚪 خروج
        </button>
      </div>

    </header>
  );
};

export default AppHeader;

/* =========================
   FIXED WORKING HEADER
========================= */

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: "260px",   // sidebar
    right: 0,

    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "0 15px",
    boxSizing: "border-box",

    background: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",

    zIndex: 9999,
    overflow: "hidden", // 🔥 يمنع اختفاء العناصر
  },

  left: {
    display: "flex",
    flexDirection: "column",
    color: "#60a5fa",
    minWidth: "150px",
  },

  court: {
    fontWeight: "bold",
    fontSize: "13px",
  },

  sub: {
    fontSize: "11px",
    opacity: 0.7,
    color: "white",
  },

  center: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "13px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  user: {
    background: "rgba(59,130,246,0.15)",
    padding: "5px 10px",
    borderRadius: "15px",
    color: "white",
    fontSize: "12px",
    whiteSpace: "nowrap",
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











