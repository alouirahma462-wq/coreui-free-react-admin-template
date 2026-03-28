import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("الرجاء إدخال البيانات");
      return;
    }

    // محاكاة تسجيل الدخول
    localStorage.setItem("token", "true");
    localStorage.setItem("user", username);

    if (onLogin) onLogin(username, password);

    // تحويل إلى الداشبورد
    window.location.href = "/#/dashboard";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
            style={styles.flag}
          />

          <div>
            <h2 style={{ margin: 0 }}>النيابة العمومية</h2>
            <p style={{ margin: 0, fontSize: 13 }}>
              وزارة العدل - الجمهورية التونسية
            </p>
          </div>
        </div>

        {/* TITLE */}
        <h3 style={styles.title}>تسجيل الدخول</h3>

        <input
          placeholder="اسم المستخدم"
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleLogin}>
          دخول النظام
        </button>

        <p style={styles.secure}>
          🔒 نظام محمي ومراقب – الدخول للموظفين المخولين فقط
        </p>

        <div style={styles.slogan}>العدل أساس العمران</div>

        <p style={styles.desc}>
          منظومة رقمية متكاملة لإدارة وتتبع مسار القضايا العدلية
          وفق أعلى معايير الحوكمة والأمان.
        </p>
      </div>
    </div>
  );
}

/* 🎨 تصميم رسمي حكومي */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0b1d3a, #1e3a8a)",
    fontFamily: "Arial",
  },

  card: {
    width: "420px",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },

  flag: {
    width: "55px",
    borderRadius: "5px",
  },

  title: {
    color: "#0b1d3a",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#0b1d3a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },

  secure: {
    fontSize: "12px",
    color: "#555",
    marginTop: "10px",
  },

  slogan: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  desc: {
    fontSize: "11px",
    marginTop: "10px",
    color: "#444",
    lineHeight: "1.5",
  },
};

