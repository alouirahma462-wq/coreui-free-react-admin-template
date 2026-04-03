import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // 🔐 SESSION CHECK (حماية الدخول)
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        const checkUser = async () => {
          const { data } = await supabase
            .from("users")
            .select("id, must_change_password")
            .eq("id", user.id)
            .single();

          if (!data) {
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
            setCheckingSession(false);
            return;
          }

          if (data.must_change_password) {
            window.location.replace("/change-password");
          } else {
            window.location.replace("/dashboard");
          }
        };

        checkUser();
        return;
      } catch (e) {
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
      setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
      return;
    }

    if (!data.isActive) {
      setMessage("❌ الحساب غير مفعل، يرجى مراجعة الإدارة");
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
    } else {
      sessionStorage.setItem("user", userData);
    }

    setMessage("✅ تم تسجيل الدخول بنجاح");

    // 🚀 Redirect مباشر (بدون مشاكل)
    if (data.must_change_password === true) {
      window.location.replace("/change-password");
    } else {
      window.location.replace("/dashboard");
    }
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
      <div style={styles.overlay}></div>

      {/* 🇹🇳 Header رسمي */}
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

        <p style={styles.notice}>
          الدخول إلى النظام القضائي يتطلب مصادقة رسمية من الإدارة المركزية.
          جميع العمليات مسجلة وتخضع للمراقبة الأمنية.
        </p>

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
          دخول إلى المنظومة
        </button>

        <a href="/forgot-password" style={styles.link}>
          نسيت كلمة المرور؟
        </a>

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

/* 🎨 STYLE FINAL (رسمي + وزاري) */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #061a33, #0b3a66)",
    direction: "rtl",
    fontFamily: "Tahoma",
    position: "relative",
    overflow: "hidden",
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
    fontSize: "14px",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
  },

  watermark: {
    position: "absolute",
    width: "280px",
    opacity: 0.08,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(18px)",
    color: "white",
    zIndex: 2,
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  },

  title: {
    color: "#fbbf24",
    marginBottom: "5px",
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "10px",
    opacity: 0.9,
  },

  notice: {
    fontSize: "13px",
    background: "rgba(255,255,255,0.12)",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "15px",
    lineHeight: "1.6",
  },

  input: {
    width: "100%",
    padding: "11px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  checkbox: {
    color: "white",
    display: "flex",
    gap: "8px",
    marginTop: "5px",
    fontSize: "13px",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "10px",
    background: "#1e3a8a",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },

  link: {
    display: "block",
    marginTop: "10px",
    color: "#fbbf24",
    fontSize: "13px",
  },

  message: {
    marginTop: "12px",
    fontWeight: "bold",
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#061a33",
  },
};














