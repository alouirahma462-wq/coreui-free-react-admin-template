import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      if (!username || !password) {
        setMessage("❌ الرجاء إدخال البيانات");
        setLoading(false);
        return;
      }

      // =========================
      // GET USER FROM SUPABASE
      // =========================
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (error || !data) {
        setMessage("❌ بيانات الدخول غير صحيحة");
        setLoading(false);
        return;
      }

      if (!data.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      // =========================
      // UPDATE LAST LOGIN
      // =========================
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.id);

      // =========================
      // SAVE USER SAFE
      // =========================
      const userData = {
        id: data.id,
        username: data.username,
        role: data.role,
        must_change_password: data.must_change_password,
      };

      if (remember) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      setMessage("✅ تم تسجيل الدخول");

      setLoading(false);

      // =========================
      // SMART ROUTING (IMPORTANT FIX)
      // =========================
      setTimeout(() => {
        if (data.must_change_password) {
          navigate("/change-password", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 300);

    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ غير متوقع");
      setLoading(false);
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

        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          تذكرني
        </label>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}





















