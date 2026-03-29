import React, { useState, useEffect } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setAnimate(true);
    }, 1200);
  }, []);

  const playSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
    );
    audio.play();
  };

  const handleLogin = async () => {
    playSound();

    console.log("sending request...");

    try {
      const res = await fetch("https://justice-system-1x8q.onrender.com/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ خطأ في الدخول");
        return;
      }

      localStorage.setItem("token", data.token);
      setMessage("✅ تم الدخول إلى المنظومة القضائية");

      console.log("USER:", data.user);
      console.log("TOKEN:", data.token);

    } catch (err) {
      console.log(err);
      setMessage("❌ لا يوجد اتصال بالسيرفر");
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

      <div style={styles.light}></div>

      <div style={{ ...styles.card, transform: animate ? "scale(1)" : "scale(0.85)", opacity: animate ? 1 : 0 }}>

        <div style={styles.header}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg" style={styles.flag} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg" style={styles.logo} />
        </div>

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

        <p style={styles.footer}>🔒 نظام محمي ومراقب</p>
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
    fontFamily: "Arial",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at center, rgba(0,0,0,0.25), rgba(0,0,0,0.6))",
  },
  watermark: {
    position: "absolute",
    width: "350px",
    opacity: 0.12,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  light: {
    position: "absolute",
    width: "450px",
    height: "450px",
    background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent)",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    filter: "blur(50px)",
  },
  card: {
    width: "420px",
    padding: "22px",
    borderRadius: "18px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(18px)",
    color: "white",
    position: "relative",
    transition: "all 0.6s ease",
  },
  header: { display: "flex", justifyContent: "space-between" },
  flag: { width: 55 },
  logo: { width: 60 },
  subtitle: { fontSize: "13px", color: "rgba(255,255,255,0.8)" },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "linear-gradient(135deg, #1e3a8a, #0b1f3a)",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  message: { marginTop: 10 },
  footer: { marginTop: 12, fontSize: 12 },
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1f3a",
  },
  spinner: {
    width: 50,
    height: 50,
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  }
};







