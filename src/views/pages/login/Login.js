import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimate(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const playSound = () => {
    try {
      const audio = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
      );
      audio.play();
    } catch (e) {
      console.log("sound blocked");
    }
  };

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    playSound();

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال البيانات");
      return;
    }

    try {
      setMessage("⏳ جاري تسجيل الدخول...");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .limit(1);

      if (error || !data || data.length === 0) {
        setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      const user = data[0];

      // 🧠 تخزين البيانات
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("courtCode", user.courtCode);

      setMessage("✅ مرحباً " + user.fullName);

      console.log("USER:", user);

      // 🚀 (نضيفها لاحقاً)
      // window.location.href = "/dashboard";

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setMessage("❌ خطأ في الاتصال بقاعدة البيانات");
    }
  };

  // 🟡 Loading Screen
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={{ color: "white", marginTop: 10 }}>
          جاري تحميل المنظومة القضائية...
        </p>
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

      <div style={styles.light}></div>

      <div
        style={{
          ...styles.card,
          transform: animate ? "scale(1)" : "scale(0.9)",
          opacity: animate ? 1 : 0
        }}
      >
        <h2>النيابة العمومية</h2>
        <h3>وزارة العدل - الجمهورية التونسية</h3>

        <p style={styles.subtitle}>تسجيل الدخول إلى المنظومة القضائية</p>

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

        <button onClick={handleLogin} style={styles.button}>
          دخول النظام
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.footer}>🔒 نظام قضائي محمي</p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/pg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Arial"
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)"
  },
  watermark: {
    position: "absolute",
    width: "300px",
    opacity: 0.1,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  light: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent)",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    filter: "blur(40px)"
  },
  card: {
    width: "380px",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(15px)",
    color: "white",
    transition: "all 0.5s ease"
  },
  subtitle: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  message: {
    marginTop: "10px",
    fontSize: "14px"
  },
  footer: {
    marginTop: "10px",
    fontSize: "12px"
  },
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1f3a"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};









