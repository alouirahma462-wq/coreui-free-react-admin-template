import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      // =========================
      // VALIDATION
      // =========================
      if (!username || !password) {
        setMessage("❌ الرجاء إدخال البيانات");
        setLoading(false);
        return;
      }

      // =========================
      // FETCH USER
      // =========================
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (error || !data) {
        setMessage("❌ بيانات الدخول غير صحيحة");
        setLoading(false);
        return;
      }

      if (!data.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      // =========================
      // UPDATE LAST LOGIN
      // =========================
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.id);

      // =========================
      // SAVE SESSION
      // =========================
      const userData = {
        id: data.id,
        username: data.username,
        role: data.role,
        must_change_password: data.must_change_password,
      };

      if (remember) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      setMessage("✅ تم تسجيل الدخول");
      setLoading(false);

      // =========================
      // REDIRECT LOGIC (FIXED)
      // =========================
      setTimeout(() => {
        if (data.must_change_password) {
          navigate("/change-password", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 300);

    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
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

        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          تذكرني
        </label>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

// =========================
// STYLES (IMPORTANT FIX)
// =========================
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: "#061a33",
    color: "white",
    direction: "rtl",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    color: "white",
    textAlign: "center",
    padding: "10px",
  },

  card: {
    width: "400px",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "6px",
    border: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};






















