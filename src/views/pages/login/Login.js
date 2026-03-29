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
    }, 1500);
  }, []);

  const handleLogin = () => {
    setMessage("⚠️ النظام تحت التحديث - سيتم تفعيل الدخول الحقيقي قريباً");
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ color: "white", marginTop: "15px" }}>
          جاري تحميل النظام القضائي...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* OVERLAY */}
      <div style={styles.overlay}></div>

      {/* WATERMARK LOGO CENTER BACKGROUND */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
        style={styles.watermark}
        alt="watermark"
      />

      <div style={{ 
        ...styles.card, 
        transform: animate ? "translateY(0)" : "translateY(40px)",
        opacity: animate ? 1 : 0,
      }}>

        {/* HEADER */}
        <div style={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
            style={styles.flag}
            alt="flag"
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
            style={styles.logo}
            alt="logo"
          />
        </div>

        <h2>النيابة العمومية</h2>
        <h3>وزارة العدل - الجمهورية التونسية</h3>

        <p style={styles.subtitle}>
          تسجيل الدخول إلى المنظومة القضائية الرقمية
        </p>

        {/* IMAGE */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lady_Justice_%28sculpture%29.jpg"
          style={styles.judge}
          alt="justice"
        />

        {/* INPUTS */}
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

        {/* BUTTON */}
        <button onClick={handleLogin} style={styles.button}>
          دخول النظام
        </button>

        {/* MESSAGE */}
        {message && <p style={styles.message}>{message}</p>}

        {/* FOOTER */}
        <p style={styles.footer}>
          🔒 نظام محمي ومراقب – الدخول للموظفين المخولين فقط
        </p>

        <p style={styles.slogan}>العدل أساس العمران</p>

        <p style={styles.desc}>
          منظومة رقمية متكاملة لإدارة وتتبع مسار القضايا العدلية وفق أعلى معايير الحوكمة والأمان.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Arial",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,20,50,0.85))",
  },

  watermark: {
    position: "absolute",
    width: "320px",
    opacity: 0.08,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
  },

  card: {
    width: "430px",
    background: "rgba(255,255,255,0.92)",
    padding: "22px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.55)",
    position: "relative",
    zIndex: 2,
    backdropFilter: "blur(10px)",
    transition: "all 0.6s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  flag: {
    width: "55px",
    borderRadius: "6px",
  },

  logo: {
    width: "65px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
  },

  judge: {
    width: "110px",
    margin: "10px auto",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "11px",
    marginTop: "8px",
    background: "linear-gradient(90deg, #0b1f3a, #1e3a8a)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  footer: {
    marginTop: "12px",
    fontSize: "12px",
    color: "gray",
  },

  slogan: {
    marginTop: "5px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  desc: {
    fontSize: "11px",
    color: "#666",
    marginTop: "6px",
  },

  loadingScreen: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1f3a",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};






