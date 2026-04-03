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
      setMessage("❌ الرجاء إدخال البيانات");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, username, fullName, court_id, must_change_password")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      setMessage("❌ بيانات الدخول غير صحيحة");
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

    // 🔥 أهم سطر
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
        <h2>🏛️ منظومة النيابة العمومية</h2>

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
          {loading ? "..." : "دخول"}
        </button>

        {message && <p>{message}</p>}
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
    flexDirection: "column",
    background: "#061a33",
    color: "white",
    direction: "rtl",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    textAlign: "center",
    padding: "10px",
  },
  card: {
    width: "400px",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
  },
};
























