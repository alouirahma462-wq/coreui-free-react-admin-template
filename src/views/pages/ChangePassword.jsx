import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // =========================
  // تحميل المستخدم + حماية
  // =========================
  useEffect(() => {
    const stored =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }

    const parsed = JSON.parse(stored);

    if (!parsed.must_change_password) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setUser(parsed);
    setChecking(false);
  }, [navigate]);

  // =========================
  // تغيير كلمة المرور
  // =========================
  const handleChange = async () => {
    setMsg("");

    if (!pass1 || !pass2) return setMsg("❌ الرجاء إدخال كلمة المرور");
    if (pass1 !== pass2) return setMsg("❌ كلمات المرور غير متطابقة");
    if (pass1.length < 6) return setMsg("❌ كلمة المرور ضعيفة");

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        password: pass1,
        must_change_password: false,
        last_login: new Date().toISOString(),
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) return setMsg("❌ حدث خطأ أثناء الحفظ");

    // =========================
    // تحديث المستخدم
    // =========================
    const updatedUser = {
      ...user,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    // =========================
    // رسالة النجاح المطلوبة منك
    // =========================
    setMsg(
      `✅ مرحباً ${updatedUser.jobTitle || "المسمى الوظيفي"} - المحكمة - النيابة العامة - إشراف مركزي`
    );

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);
  };

  if (checking)
    return (
      <div style={styles.loading}>⏳ جاري التحقق...</div>
    );

  if (!user) return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.card}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
          style={styles.logo}
        />

        <h2 style={styles.title}>⚖️ العدل أساس العمران</h2>

        <div style={styles.infoBox}>
          👤 {user.username}
          <br />
          🏛️ {user.role || "المحكمة"}
          <br />
          🔐 يجب تغيير كلمة المرور لتفعيل الحساب
        </div>

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          onChange={(e) => setPass1(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          onChange={(e) => setPass2(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleChange}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "جاري الحفظ..." : "تأكيد وتفعيل"}
        </button>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

// =========================
// تصميم وزاري احترافي
// =========================
const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #061a33, #0b2e4a)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    direction: "rtl",
    fontFamily: "Tahoma",
  },

  header: {
    width: "100%",
    background: "#b91c1c",
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
  },

  card: {
    marginTop: "40px",
    width: "420px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },

  logo: {
    width: "80px",
    marginBottom: "10px",
  },

  title: {
    color: "#fbbf24",
    marginBottom: "15px",
  },

  infoBox: {
    background: "rgba(255,255,255,0.15)",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    background: "#1e3a8a",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },

  msg: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#22c55e",
  },

  loading: {
    color: "white",
    textAlign: "center",
    marginTop: "50px",
  },
};



