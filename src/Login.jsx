import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    localStorage.setItem("token", "true");
    localStorage.setItem("user", username);

    if (onLogin) onLogin(username, password);

    window.location.href = "/#/dashboard";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 🇹🇳 الهيدر الرسمي */}
        <div style={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
            style={styles.flag}
          />

          <div>
            <h2 style={{ margin: 0, color: "#0b1d3a" }}>
              الجمهورية التونسية
            </h2>
            <p style={{ margin: 0, fontSize: 13 }}>
              وزارة العدل – النيابة العمومية
            </p>
          </div>
        </div>

        {/* العنوان */}
        <h3 style={styles.title}>تسجيل الدخول إلى النظام</h3>

        {/* الإدخال */}
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

        {/* زر الدخول */}
        <button style={styles.button} onClick={handleLogin}>
          دخول النظام
        </button>

        {/* تنبيه أمني */}
        <p style={styles.secure}>
          🔒 هذا النظام مخصص للموظفين المخولين فقط وتحت المراقبة الأمنية
        </p>

        {/* شعار */}
        <div style={styles.slogan}>
          العدل أساس العمران
        </div>

        {/* وصف */}
        <p style={styles.desc}>
          منصة رقمية تابعة لوزارة العدل التونسية لإدارة ومتابعة القضايا
          وفق معايير الحوكمة والأمن المعلوماتي.
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
    width: "430px",
    background: "rgba(255,255,255,0.97)",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    justifyContent: "center",
  },

  flag: {
    width: "60px",
    borderRadius: "6px",
  },

  title: {
    color: "#0b1d3a",
    marginBottom: "15px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
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
    fontWeight: "bold",
  },

  secure: {
    fontSize: "12px",
    color: "#555",
    marginTop: "12px",
  },

  slogan: {
    marginTop: "12px",
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
