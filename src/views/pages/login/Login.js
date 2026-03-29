import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    setMessage("⚠️ النظام تحت التحديث - سيتم تفعيل الدخول الحقيقي قريباً");
  };

  return (
    <div style={styles.page}>

      {/* OVERLAY */}
      <div style={styles.overlay}></div>

      <div style={styles.card}>

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

        <button onClick={handleLogin} style={styles.button}>
          دخول النظام
        </button>

        {/* MESSAGE */}
        {message && <p style={styles.message}>{message}</p>}

        {/* FOOTER */}
        <p style={styles.footer}>
          🔒 نظام محمي ومراقب – الدخول للموظفين المخولين فقط
        </p>

        <p style={styles.slogan}>
          العدل أساس العمران
        </p>

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
    backgroundImage: "url('/pgpng.png')", // 🔥 صورتك
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    fontFamily: "Arial",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,20,50,0.85))",
  },

  card: {
    width: "430px",
    background: "rgba(255,255,255,0.95)",
    padding: "22px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    position: "relative",
    zIndex: 2,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  flag: { width: "60px" },
  logo: { width: "60px" },
  judge: { width: "110px", margin: "10px auto" },

  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#0b1f3a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  subtitle: {
    fontSize: "13px",
    color: "#555",
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
};





