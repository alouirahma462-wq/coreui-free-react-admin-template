import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [welcome, setWelcome] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const buildWelcomeMessage = (user) => {
    // التفقدية العامة (بدون محكمة)
    if (user.role === "inspection_generale") {
      return `مرحبا التفقدية العامة - إشراف مركزي`;
    }

    // باقي المستخدمين مع المحكمة
    return `مرحبا ${user.fullName || user.role} - ${user.court_name || ""}`;
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    try {
      setMessage("⏳ جاري تسجيل الدخول...");

      const { data, error } = await supabase.rpc("login_user", {
        input_username: username,
        input_password: password
      });

      if (error) {
        console.log(error);
        setMessage("❌ خطأ في الاتصال بالسيرفر");
        return;
      }

      if (!data || !data.success) {
        setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      const user = data.user;

      // حفظ المستخدم
      localStorage.setItem("user", JSON.stringify(user));

      // 👇 رسالة الترحيب الجديدة
      const welcomeMsg = buildWelcomeMessage(user);
      setWelcome(welcomeMsg);
      setMessage("✅ تم تسجيل الدخول بنجاح");

      // تغيير كلمة المرور
      if (user.must_change_password) {
        setTimeout(() => {
          window.location.href = "/change-password";
        }, 1000);
        return;
      }

      // دخول النظام
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (err) {
      console.log(err);
      setMessage("❌ خطأ غير متوقع");
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={{ color: "white" }}>جاري تحميل النظام...</p>
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
        <h2>النيابة العمومية</h2>
        <h3>الجمهورية التونسية - وزارة العدل</h3>

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

        {welcome && (
          <p style={{ marginTop: 10, color: "#00ffcc", fontWeight: "bold" }}>
            {welcome}
          </p>
        )}

        {message && <p style={styles.message}>{message}</p>}
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
    position: "relative",
    direction: "rtl"
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
  card: {
    width: "380px",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    color: "white"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "8px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer"
  },
  message: {
    marginTop: "10px"
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







