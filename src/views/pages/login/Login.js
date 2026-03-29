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

  try {
    const res = await fetch("https://justice-system-1x8q.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: username,   // مهم: أنت تستخدم username
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage("❌ خطأ في الدخول");
      return;
    }

    // حفظ التوكن
    localStorage.setItem("token", data.token);

    setMessage("✅ تم الدخول إلى المنظومة القضائية");

    console.log("USER:", data.user);
    console.log("TOKEN:", data.token);

  } catch (err) {
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

      {/* GLOW LOGO BACKGROUND */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
        style={styles.watermark}
        alt="logo"
      />

      {/* LIGHT EFFECT */}
      <div style={styles.light}></div>

      <div
        style={{
          ...styles.card,
          transform: animate ? "scale(1)" : "scale(0.85)",
          opacity: animate ? 1 : 0,
        }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
            style={styles.flag}
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
            style={styles.logo}
          />
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
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.25), rgba(0,0,0,0.6))",
  },

  watermark: {
    position: "absolute",
    width: "350px",
    opacity: 0.12,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))",
  },

  light: {
    position: "absolute",
    width: "450px",
    height: "450px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.18), transparent)",
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
    WebkitBackdropFilter: "blur(18px)",

    color: "white",
    zIndex: 2,
    position: "relative",

    transition: "all 0.6s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
  },

  flag: { width: 55 },
  logo: { width: 60, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" },

  subtitle: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",

    background: "linear-gradient(135deg, #1e3a8a, #0b1f3a)",
    color: "white",

    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",

    cursor: "pointer",
    fontWeight: "bold",

    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",

    position: "relative",
    overflow: "hidden",
  },

  message: {
    marginTop: 10,
    color: "#fff",
  },

  footer: {
    marginTop: 12,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },

  loading: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
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
  },
};







