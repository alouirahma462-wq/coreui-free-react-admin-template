import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال البيانات");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        username,
        "fullName",
        isActive,
        must_change_password,
        court_id,
        role_id,
        courts ( id, name ),
        roles ( id, role_key, role_name )
      `)
      .eq("username", username.trim())
      .eq("password", password.trim())
      .single();

    if (error || !data) {
      setMessage("❌ بيانات غير صحيحة");
      setLoading(false);
      return;
    }

    const user = data;

    if (!user.isActive) {
      setMessage("❌ الحساب غير مفعل");
      setLoading(false);
      return;
    }

    const userData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      court_id: user.court_id,
      court_name: user.courts?.name || null,
      role_id: user.role_id,
      role: user.roles?.role_key,
      role_name: user.roles?.role_name,
      must_change_password: user.must_change_password,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setLoading(false);

    setMessage(
      `مرحبا ${user.fullName} - ${
        user.courts?.name || "التفقدية العامة - إشراف مركزي"
      }`
    );

    setTimeout(() => {
      if (user.must_change_password) {
        navigate("/change-password");
        return;
      }

      const role = user.roles?.role_key;

      if (role === "inspector" || role === "admin") {
        window.location.href = "/admin-dashboard";
        return;
      }

      window.location.href = "/court-dashboard";
    }, 600);
  };

  return (
    <div style={styles.page}>

      {/* 🇹🇳 BACKGROUND FLAG EFFECT */}
      <div style={styles.bgOverlay}></div>

      {/* 🔴 TOP MARQUEE BAR */}
      <div style={styles.header}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - منظومة النيابة العمومية - 🇹🇳
        </div>
      </div>

      {/* LOGIN CARD */}
      <div style={styles.card}>
        <h2>🏛️ منظومة النيابة العمومية</h2>

        <input
          placeholder="اسم المستخدم"
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "white",
    direction: "rtl",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },

  /* 🇹🇳 background watermark */
  bgOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "400px",
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/ce/Coat_of_arms_of_Tunisia.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    opacity: 0.08,
    zIndex: 0,
  },

  /* 🔴 top bar */
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    zIndex: 2,
  },

  /* 🟡 moving text */
  marquee: {
    display: "inline-block",
    paddingLeft: "100%",
    animation: "marquee 12s linear infinite",
    fontWeight: "bold",
  },

  card: {
    width: "380px",
    padding: "25px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.15)",
    textAlign: "center",
    zIndex: 2,
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  message: {
    marginTop: "10px",
    color: "#fca5a5",
    fontWeight: "bold",
  },
};

/* 🟡 MARQUEE ANIMATION (important) */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}
`, styleSheet.cssRules.length);
































