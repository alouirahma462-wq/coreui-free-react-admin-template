import React, { useState } from "react";

const USERS = [
  { username: "procureur", password: "1111", role: "وكيل الجمهورية" },
  { username: "assistant1", password: "2222", role: "مساعد وكيل" },
  { username: "greffe1", password: "3333", role: "كاتب ضبط" },
  { username: "juge1", password: "4444", role: "قاض" },
  { username: "inspection", password: "9999", role: "تفقدية عامة" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setMessage("❌ بيانات الدخول غير صحيحة");
      return;
    }

    const session = {
      username: user.username,
      role: user.role,
      time: new Date().toISOString(),
    };

    localStorage.setItem("session", JSON.stringify(session));

    setMessage(`✔ مرحباً ${user.username} — صلاحيتك: ${user.role}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER الرسمي */}
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

        <p style={styles.subtitle}>
          تسجيل الدخول إلى المنظومة القضائية الرقمية
        </p>

        {/* رمز العدالة */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lady_Justice_%28sculpture%29.jpg"
          style={styles.judge}
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
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1220",
  },
  card: {
    width: "430px",
    background: "white",
    padding: "22px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
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
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold",
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



