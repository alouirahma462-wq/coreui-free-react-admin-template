import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const USERS = [
    { username: "procureur", password: "1111", role: "procureur" },
    { username: "assistant1", password: "2222", role: "assistant" },
    { username: "greffe1", password: "3333", role: "greffe" },
    { username: "juge1", password: "4444", role: "juge" },
    { username: "inspection", password: "9999", role: "inspection" },
  ];

  const handleLogin = () => {
    if (!username || !password) {
      alert("الرجاء إدخال جميع البيانات");
      return;
    }

    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("بيانات الدخول غير صحيحة ❌");
      return;
    }

    const session = {
      username: user.username,
      role: user.role,
      time: new Date().toISOString(),
    };

    localStorage.setItem("session", JSON.stringify(session));

    alert("تم الدخول بنجاح ✔");

    onLogin(session);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 🇹🇳 HEADER */}
        <div style={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
            style={styles.flag}
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
            style={styles.logo}
          />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lady_Justice_%28sculpture%29.jpg"
            style={styles.justice}
          />
        </div>

        {/* 🏛️ TITLE */}
        <h2 style={styles.title}>الجمهورية التونسية</h2>
        <h3 style={styles.subtitle}>وزارة العدل – النيابة العمومية</h3>

        <p style={styles.sysName}>
          نظام إدارة وتتبع القضايا القضائية
        </p>

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
          دخول المنظومة
        </button>

        <p style={styles.footer}>🔒 نظام حكومي تجريبي آمن</p>

      </div>
    </div>
  );
}

/* 🎨 STYLE */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom,rgb(179, 17, 17), #f5f5f5)",
    fontFamily: "Arial",
  },

  card: {
    width: "380px",
    padding: "25px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  flag: {
    width: "60px",
  },

  logo: {
    width: "55px",
  },

  justice: {
    width: "60px",
    borderRadius: "10px",
  },

  title: {
    margin: "10px 0 0",
    fontSize: "18px",
    color: "#b30000",
    fontWeight: "bold",
  },

  subtitle: {
    margin: "5px 0",
    fontSize: "14px",
  },

  sysName: {
    fontSize: "12px",
    color: "gray",
    marginBottom: "15px",
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
    padding: "10px",
    background: "#b30000",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  footer: {
    marginTop: "10px",
    fontSize: "11px",
    color: "gray",
  },
};


