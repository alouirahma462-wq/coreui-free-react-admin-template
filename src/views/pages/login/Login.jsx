
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient.js";
import bcrypt from "bcryptjs";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    try {
      setMessage("⏳ جاري تسجيل الدخول...");

      // 🔥 جلب المستخدم فقط (بدون test query)
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        console.log("SUPABASE ERROR:", error);
        setMessage("❌ خطأ في قاعدة البيانات أو المستخدم غير موجود");
        return;
      }

      if (!data) {
        setMessage("❌ المستخدم غير موجود");
        return;
      }

      // 🔐 التحقق من كلمة المرور
      const valid = await bcrypt.compare(password, data.password_hash);

      if (!valid) {
        setMessage("❌ كلمة المرور غير صحيحة");
        return;
      }

      // 💾 حفظ المستخدم
      localStorage.setItem("user", JSON.stringify(data));

      setMessage(`✅ مرحباً ${data.fullName || data.username}`);

      // 🔒 تغيير كلمة المرور الإجباري
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
      console.log("CATCH ERROR:", err);
      setMessage("❌ خطأ في الاتصال بالسيرفر");
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



