import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      if (!username || !password) {
        setMessage("❌ الرجاء إدخال البيانات");
        return;
      }

      const { data: user, error } = await supabase
        .from("users")
        .select(`
          id,
          username,
          fullName,
          isActive,
          must_change_password,
          court_id,
          password
        `)
        .eq("username", username.trim())
        .maybeSingle();

      if (error || !user) {
        setMessage("❌ بيانات غير صحيحة");
        return;
      }

      if (!user.isActive) {
        setMessage("❌ الحساب غير مفعل");
        return;
      }

      // 🔐 check password
      if (user.password !== password.trim()) {
        setMessage("❌ بيانات غير صحيحة");
        return;
      }

      // 💾 session
      localStorage.setItem("user_id", user.id);

      // 🧠 remember me (اختياري)
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      }

      // 🔥 routing decision (App will handle actually, but safe fallback)
      setMessage(`👋 مرحبا ${user.fullName}`);

      if (user.must_change_password) {
        navigate("/change-password", { replace: true });
        return;
      }

      if (user.court_id === null) {
        navigate("/inspection-dashboard", { replace: true });
        return;
      }

      navigate(`/court/${user.court_id}`, { replace: true });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - منظومة النيابة العمومية - 🇹🇳
        </div>
      </div>

      <div style={styles.card}>
        <h2>🏛️ منظومة النيابة العمومية</h2>

        <input
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* 🟡 Remember me */}
        <label style={{ fontSize: "14px", display: "block", marginTop: "8px" }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />{" "}
          تذكرني
        </label>

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {/* 🔵 Forgot password */}
        <p style={styles.links}>
          <span onClick={() => navigate("/forgot-password")}>
            نسيت كلمة المرور؟
          </span>
        </p>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

/* 🎨 STYLE (نفس ستايلك + تحسين بسيط) */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    direction: "rtl",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  marquee: {
    display: "inline-block",
    paddingLeft: "100%",
    animation: "marquee 12s linear infinite",
    fontWeight: "bold",
  },

  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
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
    fontWeight: "bold",
  },

  message: {
    marginTop: "10px",
    color: "#fca5a5",
  },

  links: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#93c5fd",
    cursor: "pointer",
  },
};










































