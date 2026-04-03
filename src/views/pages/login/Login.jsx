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
      if (!username || !password) {
        setMessage("❌ الرجاء إدخال البيانات");
        setLoading(false);
        return;
      }

      // ✅ FIX 406 ERROR → remove .single()
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password);

      if (error || !data || data.length === 0) {
        setMessage("❌ بيانات الدخول غير صحيحة");
        setLoading(false);
        return;
      }

      const user = data[0]; // ✅ important

      if (!user.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      // ✅ تحديث آخر دخول
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", user.id);

      // ✅ تخزين كل البيانات المهمة
      const userData = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        court_id: user.court_id,
        must_change_password: user.must_change_password,
      };

      if (remember) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      setMessage("✅ تم تسجيل الدخول");
      setLoading(false);

      // ✅ FIX REDIRECT
      setTimeout(() => {
        if (user.must_change_password === true) {
          navigate("/change-password", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

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

        <label style={{ fontSize: "14px" }}>
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

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: "linear-gradient(135deg, #061a33, #0b2e4a)",
    color: "white",
    direction: "rtl",
    fontFamily: "Tahoma",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
  },

  card: {
    width: "90%",
    maxWidth: "400px",
    padding: "25px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
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
    borderRadius: "8px",
    background: "#1e3a8a",
    color: "white",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
};























