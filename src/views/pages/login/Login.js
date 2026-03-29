import React, { useState, useEffect } from "react";

const API = "https://justice-system-1x8q.onrender.com";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setAnimate(true);
    }, 1200);
  }, []);

  const handleLogin = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("⏳ جاري تسجيل الدخول...");

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.error || "❌ خطأ في الدخول");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setMessage("✅ تم الدخول إلى المنظومة القضائية");

    } catch (err) {
      console.log("FETCH ERROR:", err);
      setMessage("❌ لا يوجد اتصال بالسيرفر");
    }

    setIsSubmitting(false);
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

      <div style={styles.card}>
        <h2>النيابة العمومية</h2>
        <p>تسجيل الدخول</p>

        <input
          id="email"
          name="email"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          id="password"
          name="password"
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleLogin}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.6 : 1
          }}
          disabled={isSubmitting}
        >
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
    background: "#0b1f3a"
  },
  overlay: {
    position: "absolute",
    inset: 0
  },
  card: {
    width: "420px",
    padding: "22px",
    borderRadius: "12px",
    background: "white",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0"
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  message: {
    marginTop: 10
  },
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1f3a"
  },
  spinner: {
    width: 50,
    height: 50,
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};








