import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [welcome, setWelcome] = useState("");
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

      // 🔐 تحويل username → email
      const email = username + "@justice.tunisia";

      // 🔑 تسجيل الدخول عبر Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { persistSession: true }, // تذكرني
      });

      if (error) {
        setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      // 📥 جلب بيانات المستخدم
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError || !profile) {
        setMessage("❌ خطأ في تحميل بيانات المستخدم");
        return;
      }

      // 🚫 تحقق من التفعيل
      if (!profile.is_active) {
        setMessage("❌ الحساب معطل من الإدارة");
        return;
      }

      // 🏛️ تحديد المحكمة
      let courtName = "";

      if (profile.role === "inspection_generale") {
        courtName = "إشراف مركزي - جميع المحاكم";
      } else {
        const { data: court } = await supabase
          .from("courts")
          .select("name")
          .eq("id", profile.court_id)
          .single();

        courtName = court?.name || "محكمة غير محددة";
      }

      // 💾 حفظ المستخدم
      localStorage.setItem("user", JSON.stringify(profile));

      // 🎯 رسالة الترحيب الاحترافية
      const welcomeText = `مرحباً ${profile.full_name} - ${courtName}`;
      setWelcome(welcomeText);

      setMessage("✅ تم تسجيل الدخول بنجاح");

      // 🔒 أول دخول → تغيير كلمة المرور
      if (profile.must_change_password) {
        setTimeout(() => {
          window.location.href = "/change-password";
        }, 1200);
        return;
      }

      // 🚀 دخول عادي
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (err) {
      console.log(err);
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

        {/* 🟢 رسالة الترحيب */}
        {welcome && (
          <p style={styles.welcome}>
            {welcome}
          </p>
        )}

        {/* 🔴 / 🟢 الرسالة */}
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
    direction: "rtl",
    fontFamily: "Tahoma"
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)"
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
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    color: "white",
    zIndex: 1
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold"
  },
  welcome: {
    marginTop: "12px",
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "15px"
  },
  message: {
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: "bold"
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







