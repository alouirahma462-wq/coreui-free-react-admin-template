import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("remember_user");
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

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

      if (rememberMe) {
        localStorage.setItem("remember_user", username);
      } else {
        localStorage.removeItem("remember_user");
      }

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
      setMessage("❌ خطأ في النظام");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      {/* 🔴 TOP BAR (FIXED MARQUEE) */}
    <div className="top-bar">
  <div className="marquee-track">
    <span className="marquee-text">
      🇹🇳 وزارة العدل - الجمهورية التونسية - منظومة النيابة العمومية
    </span>

    <span className="marquee-text">
      🇹🇳 وزارة العدل - الجمهورية التونسية - منظومة النيابة العمومية
    </span>
  </div>
</div>

      {/* LOGIN CARD */}
      <div style={styles.card}>

        <h2 style={styles.title}>🏛️ منظومة النيابة العمومية</h2>

        <p style={styles.subTitle}>تسجيل الدخول إلى النظام القضائي</p>

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

        <div style={styles.row}>
          <label style={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            تذكرني
          </label>

          {/* 🔑 FIXED FORGOT PASSWORD */}
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={styles.forgotBtn}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <button onClick={handleLogin} style={styles.btn}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={styles.error}>{message}</p>}
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
    background: "linear-gradient(135deg, #0b1220, #0f172a, #111c33)",
    color: "white",
    direction: "rtl",
    position: "relative",
    overflow: "hidden",
  },

  // 🔴 TOP BAR FIXED
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "40px",
    background: "#b91c1c",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  },

  marqueeTrack: {
    display: "flex",
    width: "200%",
    animation: "move 10s linear infinite",
  },

  marqueeText: {
    width: "100%",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },

  card: {
    width: "480px",
    padding: "35px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
    textAlign: "center",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
  },

  subTitle: {
    fontSize: "13px",
    opacity: 0.8,
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "13px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "13px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  // 🔑 FIXED BUTTON
  forgotBtn: {
    background: "transparent",
    border: "none",
    color: "#93c5fd",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "13px",
  },

  btn: {
    width: "100%",
    padding: "13px",
    marginTop: "15px",
    background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    marginTop: "10px",
    color: "#fca5a5",
    fontSize: "13px",
  },
};















































