import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
      setLoading(false);
      return;
    }

    // 🔥 1. GET USER
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        id,
        username,
        fullName,
        isActive,
        must_change_password,
        court_id,
        role_id,
        courts (id, name)
      `)
      .eq("username", username.trim())
      .eq("password", password.trim())
      .maybeSingle();

    if (error || !user) {
      setMessage("❌ بيانات غير صحيحة");
      setLoading(false);
      return;
    }

    if (!user.isActive) {
      setMessage("❌ الحساب غير مفعل");
      setLoading(false);
      return;
    }

    // 🔥 2. GET ROLE
    const { data: role } = await supabase
      .from("roles")
      .select("access_level")
      .eq("id", user.role_id)
      .maybeSingle();

    const access_level = role?.access_level || null;

    // 🔥 3. SAVE ONLY ID (المفتاح الحقيقي للحل)
    localStorage.setItem("user_id", user.id);

    // 👋 MESSAGE
    setMessage(`👋 مرحبا ${user.fullName}`);

    // 🚨 4. NO setTimeout — تنفيذ مباشر
    // 🔴 FIRST LOGIN
    if (user.must_change_password === true) {
      navigate("/change-password", { replace: true });
      setLoading(false);
      return;
    }

    // 🟢 NORMAL LOGIN
    if (access_level === "court") {
      navigate(`/court/${user.court_id}`, { replace: true });
      setLoading(false);
      return;
    }

    if (access_level === "global") {
      navigate("/inspection-dashboard", { replace: true });
      setLoading(false);
      return;
    }

    // 🔥 fallback آمن
    navigate("/login", { replace: true });
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - منظومة النيابة العمومية - 🇹🇳
        </div>
      </div>

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

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

/* 🎨 SAME STYLE (بدون تغيير) */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    direction: "rtl",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  marquee: {
    display: "inline-block",
    paddingLeft: "100%",
    animation: "marquee 12s linear infinite",
    fontWeight: "bold",
  },

  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  message: {
    marginTop: "10px",
    color: "#fca5a5",
  },
};










































