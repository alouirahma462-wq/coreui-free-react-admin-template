import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // 🔥 Session Check (FIXED)
  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        // 🚨 لا نثق بالـ localStorage وحده
        supabase
          .from("users")
          .select("must_change_password, role, id")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
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
          });

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
      setMessage("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
      return;
    }

    if (!data.isActive) {
      setMessage("❌ الحساب معطل");
      return;
    }

    // 🕒 update last login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    // 💾 session storage
    const userData = JSON.stringify(data);

    if (remember) {
      localStorage.setItem("user", userData);
    } else {
      sessionStorage.setItem("user", userData);
    }

    setMessage("✅ تم تسجيل الدخول");

    // 🚀 REDIRECT FIXED (القرار من Supabase مباشرة)
    setTimeout(() => {
      if (data.must_change_password === true) {
        window.location.replace("/change-password");
      } else {
        window.location.replace("/dashboard");
      }
    }, 500);
  };

  // ⛔ Loading
  if (checkingSession) {
    return (
      <div style={styles.loading}>
        <p style={{ color: "white" }}>جاري التحقق...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
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

        <label style={{ color: "white" }}>
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

        <a href="/forgot-password" style={{ color: "#fbbf24" }}>
          نسيت كلمة المرور؟
        </a>

        {message && <p style={{ color: "white" }}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1f3a",
    direction: "rtl",
  },
  card: {
    width: "380px",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    color: "white",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "white",
    borderRadius: "10px",
    marginTop: "10px",
    fontWeight: "bold",
  },
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};














