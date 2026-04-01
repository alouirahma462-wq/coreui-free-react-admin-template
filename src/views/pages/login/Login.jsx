import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [welcome, setWelcome] = useState("");

  // 🛡️ حماية Supabase
  useEffect(() => {
    const ping = async () => {
      try {
        await supabase.from("users").select("id").limit(1);
      } catch {}
    };

    ping();
    const interval = setInterval(ping, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
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
      setMessage("❌ الحساب معطل من الإدارة");
      return;
    }

    // 🕒 تحديث آخر دخول
    await supabase
      .from("users")
      .update({ last_login: new Date() })
      .eq("id", data.id);

    // 💾 حفظ الجلسة
    if (remember) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      sessionStorage.setItem("user", JSON.stringify(data));
    }

    // 🔐 أول دخول
    if (data.must_change_password) {
      window.location.href = "/change-password";
      return;
    }

    // 🏛️ جلب اسم المحكمة
    let courtName = "";

    if (data.role === "inspection_generale") {
      courtName = "إشراف مركزي - جميع المحاكم";
    } else {
      const { data: court } = await supabase
        .from("courts")
        .select("name")
        .eq("id", data.court_id)
        .single();

      courtName = court?.name || "محكمة غير محددة";
    }

    // 🎯 الرسالة النهائية (كما طلبت حرفياً)
    const welcomeText = `مرحبا ${data.fullName} - ${courtName}`;

    setWelcome(welcomeText);
    setMessage("✅ تم تسجيل الدخول بنجاح");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  };

  // 🔁 نسيان كلمة المرور
  const handleResetPassword = async () => {
    if (!username) {
      setMessage("❌ أدخل اسم المستخدم أولاً");
      return;
    }

    const newPass = prompt("أدخل كلمة مرور جديدة:");
    if (!newPass) return;

    const { error } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: true
      })
      .eq("username", username);

    if (error) {
      setMessage("❌ حدث خطأ");
    } else {
      setMessage("✅ تم تعيين كلمة مرور جديدة");
    }
  };

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

        <label style={{ color: "white" }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          تذكرني
        </label>

        <button onClick={handleLogin} style={styles.button}>
          دخول النظام
        </button>

        <button onClick={handleResetPassword} style={styles.link}>
          نسيت كلمة المرور؟
        </button>

        {/* 🟢 رسالة الترحيب */}
        {welcome && <p style={styles.welcome}>{welcome}</p>}

        {/* 🔴 / 🟢 الحالة */}
        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("✅") ? "#22c55e" : "#ef4444"
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








