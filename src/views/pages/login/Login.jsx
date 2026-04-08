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
      // 🔹 1. check input
      if (!username || !password) {
        setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
        setLoading(false);
        return;
      }

      // 🔹 2. check user (ONLY users table)
      const { data: user, error } = await supabase
        .from("users")
        .select(`
          id,
          username,
          fullName,
          password,
          must_change_password,
          court_id,
          isActive
        `)
        .eq("username", username.trim())
        .maybeSingle();

      // 🔹 3. user not found
      if (error || !user) {
        setMessage("❌ بيانات غير صحيحة");
        setLoading(false);
        return;
      }

      // 🔹 4. active check
      if (!user.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      // 🔹 5. password correct?
      if (user.password !== password.trim()) {
        setMessage("❌ بيانات غير صحيحة");
        setLoading(false);
        return;
      }

      // 🔹 6. session
      localStorage.setItem("user_id", user.id);

      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remember_me");
      }

      // 🔥 ROUTING ACCORDING TO WORKFLOW

      // ┌──────────────┐
      // ↓              ↓

      if (user.must_change_password === true) {
        // 🔴 CHANGE PASSWORD FIRST LOGIN
        navigate("/change-password", {
          state: { userId: user.id },
          replace: true,
        });
        return;
      }

      // 🟡 inspection user
      if (user.court_id === null) {
        navigate("/inspection-dashboard", { replace: true });
        return;
      }

      // 🟢 court user
      navigate(`/court/${user.court_id}`, { replace: true });

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

        {/* 🔵 Remember me */}
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











































