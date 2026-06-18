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

  /* =========================
     TIME FIX (NEW VERSION)
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const day = now.toLocaleDateString("ar-TN", {
        weekday: "long",
        timeZone: "Africa/Tunis",
      });

      const date = now.toLocaleDateString("ar-TN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Africa/Tunis",
      });

      const timeOnly = now.toLocaleTimeString("ar-TN", {
        timeZone: "Africa/Tunis",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setTime(`${day} ${date} • ${timeOnly}`);
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

      {/* LEFT (COURT BADGE) */}
      <div style={styles.left}>
        <div style={styles.courtBadge}>🏛️ {courtName}</div>
        <div style={styles.sub}>الجمهورية التونسية</div>
      </div>

      {/* CENTER (TIME HUD) */}
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
   HUD + MODERN STYLE (SAFE)
========================= */

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: "260px",
    right: 0,

    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "0 15px",
    boxSizing: "border-box",

    background:
      "linear-gradient(90deg, rgba(15,23,42,0.98), rgba(30,58,138,0.85))",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",

    zIndex: 9999,
    overflow: "hidden",

    animation: "headerGlow 6s ease-in-out infinite",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
  },

  courtBadge: {
    fontWeight: "bold",
    fontSize: "13px",
    color: "#ffffff",
    background: "rgba(59,130,246,0.25)",
    padding: "4px 10px",
    borderRadius: "12px",
    display: "inline-block",
    boxShadow: "0 0 10px rgba(59,130,246,0.3)",
  },

  sub: {
    fontSize: "11px",
    opacity: 0.7,
    color: "white",
    marginTop: "2px",
  },

  center: {
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "0.5px",
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
    boxShadow: "0 0 8px rgba(59,130,246,0.2)",
  },

  logout: {
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    boxShadow: "0 0 10px rgba(239,68,68,0.4)",
  },
};











