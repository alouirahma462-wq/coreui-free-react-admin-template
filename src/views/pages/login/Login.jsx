import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (!username || !password) {
        setMessage("❌ أدخل البيانات");
        setLoading(false);
        return;
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username.trim())
        .maybeSingle();

      if (error || !user) {
        setMessage("❌ بيانات غير صحيحة");
        setLoading(false);
        return;
      }

      if (user.password !== password.trim()) {
        setMessage("❌ كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      if (!user.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      // 🔥 حفظ الجلسة
      localStorage.setItem("user_id", user.id);

      setTimeout(() => {
        if (user.must_change_password == true) {
          navigate("/change-password", { replace: true });
          return;
        }

        if (user.court_id === null) {
          navigate("/inspection-dashboard", { replace: true });
          return;
        }

        navigate(`/court/${user.court_id}`, { replace: true });
      }, 100);

    } catch (err) {
      console.log(err);
      setMessage("❌ خطأ في النظام");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🔐 تسجيل الدخول</h2>

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

        <button onClick={handleLogin} style={styles.btn}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={{ color: "red" }}>{message}</p>}
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
    background: "#0f172a",
    color: "white",
  },
  card: {
    width: "350px",
    padding: "20px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
};












































