import React, { useState } from "react";
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
      // 🧨 validation
      if (!username || !password) {
        setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
        setLoading(false);
        return;
      }

      // 🔍 fetch user from TABLE users ONLY
      const { data: user, error } = await supabase
        .from("users")
        .select(`
          id,
          username,
          fullName,
          password,
          isActive,
          must_change_password,
          court_id
        `)
        .eq("username", username.trim())
        .maybeSingle();

      if (error || !user) {
        setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      // 🚫 inactive user
      if (!user.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      // 🔐 password check (plain for now)
      if (user.password !== password.trim()) {
        setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      // 💾 session
      localStorage.setItem("user_id", user.id);

      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remember_me");
      }

      // 👋 welcome message
      setMessage(`👋 مرحباً ${user.fullName}`);

      // ⏳ short delay so user sees welcome
      setTimeout(() => {
        // 🔁 FIRST LOGIN → change password
        if (user.must_change_password) {
          navigate("/change-password", { replace: true });
          return;
        }

        // 🟡 inspection user (court_id = null)
        if (user.court_id === null) {
          navigate("/inspection-dashboard", { replace: true });
          return;
        }

        // 🏛️ normal court user
        navigate(`/court/${user.court_id}`, { replace: true });
      }, 700);

    } catch (err) {
      console.error(err);
      setMessage("❌ خطأ في النظام");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
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

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          تذكرني
        </label>

        <button onClick={handleLogin} style={styles.button} disabled={loading}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <div style={styles.links}>
          <span onClick={() => navigate("/forgot-password")}>
            نسيت كلمة المرور؟
          </span>
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

/* 🎨 STYLE */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    direction: "rtl",
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

  checkbox: {
    display: "block",
    marginTop: "8px",
    fontSize: "14px",
  },

  links: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#93c5fd",
    cursor: "pointer",
  },

  message: {
    marginTop: "10px",
    color: "#fca5a5",
  },
};










































