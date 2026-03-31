import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient.js";
import bcrypt from "bcryptjs";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    try {
      setMessage("⏳ جاري تسجيل الدخول...");

      // 🟢 جلب المستخدم
      const { data, error } = await supabase
        .from("users")
        .select("*, courts(*)")
        .eq("username", username)
        .single();

      if (error || !data) {
        setMessage("❌ المستخدم غير موجود");
        return;
      }

      // 🔐 مقارنة الباسورد مع الهاش
      const valid = await bcrypt.compare(password, data.password_hash);

      if (!valid) {
        setMessage("❌ كلمة المرور غير صحيحة");
        return;
      }

      // 💾 حفظ المستخدم
      localStorage.setItem("user", JSON.stringify(data));

      setMessage(
        `✅ مرحباً ${data.fullName} - ${
          data.courts?.court_name || "التفقدية العامة"
        }`
      );

      console.log("USER:", data);

      // 🔥 إجبار تغيير كلمة المرور
      if (data.must_change_password) {
        setTimeout(() => {
          window.location.href = "/change-password";
        }, 800);
        return;
      }

      // 🚀 دخول عادي
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    } catch (err) {
      console.log(err);
      setMessage("❌ خطأ في الاتصال بالسيرفر");
    }
  };

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

      <div style={styles.card}>
        <h2>النيابة العمومية</h2>
        <h3>الجمهورية التونسية - وزارة العدل</h3>

        <p style={styles.subtitle}>
          تسجيل الدخول إلى المنظومة القضائية
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
    fontFamily: "Tahoma",
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
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(15px)",
    color: "white"
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


