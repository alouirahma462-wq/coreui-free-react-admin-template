import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [welcome, setWelcome] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // 🔥 Session check (Auto redirect)
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        if (user?.must_change_password) {
          window.location.replace("/change-password");
        } else {
          window.location.replace("/dashboard");
        }
      } catch (e) {
        console.log("Session error", e);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }

    setCheckingSession(false);
  }, []);

  // 🔐 LOGIN
  const handleLogin = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
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
      setMessage("❌ الحساب معطل");
      return;
    }

    // 🕒 تحديث آخر دخول
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    // 💾 حفظ الجلسة
    const userData = JSON.stringify(data);

    if (remember) {
      localStorage.setItem("user", userData);
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("user", userData);
      localStorage.removeItem("user");
    }

    // 🏛️ اسم المحكمة
    let courtName = "";

    if (data.role === "inspection_generale") {
      courtName = "إشراف مركزي";
    } else if (data.court_id) {
      const { data: court } = await supabase
        .from("courts")
        .select("name")
        .eq("id", data.court_id)
        .single();

      courtName = court?.name || "";
    }

    setWelcome(
      data.role === "inspection_generale"
        ? "مرحبا التفقدية العامة - إشراف مركزي"
        : `مرحبا ${data.fullName || data.username} - ${courtName}`
    );

    setMessage("✅ تم تسجيل الدخول بنجاح");

    // 🚀 Redirect system
    setTimeout(() => {
      if (data.must_change_password) {
        window.location.replace("/change-password");
      } else {
        window.location.replace("/dashboard");
      }
    }, 800);
  };

  // ⛔ Loading session check
  if (checkingSession) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={{ color: "white" }}>جاري التحقق من الجلسة...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
        style={styles.watermark}
        alt="logo"
      />

      <div style={styles.card}>
        <h2>🏛️ منظومة النيابة العمومية</h2>
        <h3>وزارة العدل - الجمهورية التونسية</h3>

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

        <label style={{ color: "white", display: "flex", gap: "8px" }}>
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

        {/* 🔥 Forgot password */}
        <div style={{ marginTop: "10px" }}>
          <a href="/forgot-password" style={{ color: "#fbbf24" }}>
            نسيت كلمة المرور؟
          </a>
        </div>

        {welcome && <p style={styles.welcome}>{welcome}</p>}

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("✅") ? "#22c55e" : "#ef4444",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/pg.png')",
    backgroundSize: "cover",
    position: "relative",
    direction: "rtl",
    fontFamily: "Tahoma",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  },
  watermark: {
    position: "absolute",
    width: "300px",
    opacity: 0.1,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  card: {
    width: "380px",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    color: "white",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  },
  welcome: {
    marginTop: "12px",
    color: "#22c55e",
    fontWeight: "bold",
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1f3a",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};














