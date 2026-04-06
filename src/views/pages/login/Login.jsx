import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
      setLoading(false);
      return;
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 🔥 FIX: safe query (no .single)
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, username, fullName, court_id, must_change_password, isActive"
      )
      .eq("username", cleanUsername)
      .eq("password", cleanPassword);

    if (error) {
      console.log("LOGIN ERROR:", error);
      setMessage("❌ خطأ في النظام");
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setMessage("❌ بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    const user = data[0];

    if (user.isActive === false) {
      setMessage("❌ الحساب غير مفعل");
      setLoading(false);
      return;
    }

    const userData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      court_id: user.court_id,
      must_change_password: user.must_change_password,
      role: user.role || "user",
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setLoading(false);

    setTimeout(() => {
      if (user.must_change_password) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    }, 100);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.card}>
        <h2 style={{ marginBottom: "15px" }}>
          🏛️ منظومة النيابة العمومية
        </h2>

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

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

/* =========================
   🎨 SAME STYLE (UNCHANGED)
========================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "white",
    direction: "rtl",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
  },

  card: {
    width: "380px",
    padding: "25px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
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
    color: "#ffcccb",
  },
};





























