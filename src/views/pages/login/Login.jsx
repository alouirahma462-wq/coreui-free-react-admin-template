import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!savedUser) {
      setCheckingSession(false);
      return;
    }

    const user = JSON.parse(savedUser);

    (async () => {
      const { data } = await supabase
        .from("users")
        .select("id, must_change_password")
        .eq("id", user.id)
        .single();

      if (!data) {
        localStorage.clear();
        sessionStorage.clear();
        setCheckingSession(false);
        return;
      }

      const mustChange = data.must_change_password === true;

      navigate(mustChange ? "/change-password" : "/dashboard");
    })();

  }, [navigate]);

  const handleLogin = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال البيانات");
      return;
    }

    setMessage("⏳ جاري تسجيل الدخول...");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      setMessage("❌ بيانات الدخول غير صحيحة");
      return;
    }

    if (!data.isActive) {
      setMessage("❌ الحساب غير مفعل");
      return;
    }

    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    const userData = JSON.stringify(data);

    if (remember) {
      localStorage.setItem("user", userData);
    } else {
      sessionStorage.setItem("user", userData);
    }

    setMessage("✅ تم تسجيل الدخول");

    // 🔥 FIX NAVIGATION (بدون setTimeout)
    const mustChange = data.must_change_password === true;

    navigate(mustChange ? "/change-password" : "/dashboard");
  };

  if (checkingSession) {
    return (
      <div style={styles.loading}>
        <p style={{ color: "white" }}>جاري التحقق من الجلسة...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
        style={styles.watermark}
      />

      <div style={styles.card}>
        <h2 style={styles.title}>🏛️ منظومة النيابة العمومية</h2>
        <h3 style={styles.subtitle}>وزارة العدل - الجمهورية التونسية</h3>

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
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          تذكرني
        </label>

        <button onClick={handleLogin} style={styles.button}>
          دخول
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#061a33", direction: "rtl" },
  header: { position: "absolute", top: 0, width: "100%", background: "#b91c1c", color: "white", textAlign: "center", padding: "10px" },
  watermark: { position: "absolute", width: "280px", opacity: 0.08 },
  card: { width: "420px", padding: "25px", borderRadius: "18px", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(18px)", color: "white" },
  title: { color: "#fbbf24" },
  subtitle: { fontSize: "14px" },
  input: { width: "100%", padding: "10px", margin: "6px 0" },
  checkbox: { color: "white", display: "flex", gap: "8px" },
  button: { width: "100%", padding: "12px", marginTop: "10px", background: "#1e3a8a", color: "white" },
  message: { marginTop: "10px", fontWeight: "bold" },
  loading: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }
};

















