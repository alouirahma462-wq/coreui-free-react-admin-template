import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     🎨 PAGE THEME CONTROL
  ========================= */
  useEffect(() => {
    document.body.classList.add("login-page");

    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

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

    const { data, error } = await supabase
      .from("users")
      .select(
        "id, username, fullName, court_id, must_change_password, isActive"
      )
      .eq("username", cleanUsername)
      .eq("password", cleanPassword)
      .single();

    if (error || !data) {
      console.log("LOGIN ERROR:", error);
      setMessage("❌ بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    if (data.isActive === false) {
      setMessage("❌ الحساب غير مفعل");
      setLoading(false);
      return;
    }

    const userData = {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      court_id: data.court_id,
      must_change_password: data.must_change_password,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setLoading(false);

    if (data.must_change_password) {
      navigate("/change-password");
    } else {
      navigate("/dashboard");
    }
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
   🎨 UI STYLES (NO BACKGROUND HERE)
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
    backdropFilter: "blur(10px)",
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


























