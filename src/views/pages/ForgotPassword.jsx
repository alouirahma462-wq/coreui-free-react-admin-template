import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  // 🧹 تنظيف أي session قديم (IMPORTANT FIX)
  useEffect(() => {
    localStorage.removeItem("reset_user");
    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_flow");
  }, []);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("يرجى إدخال اسم المستخدم");
      return;
    }

    setLoading(true);
    setError("");
    setDebugOtp("");

    try {
      // 🔥 SAFE QUERY (no crash)
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username.trim())
        .maybeSingle();

      if (userError || !user) {
        setError("❌ المستخدم غير موجود");
        setLoading(false);
        return;
      }

      // 🔐 OTP generation (secure flow)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      // 💾 store OTP in DB
      const { error: updateError } = await supabase
        .from("users")
        .update({
          reset_token: otp,
          reset_token_expiry: expiry.toISOString(),
          reset_attempts: 0,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("❌ فشل إنشاء رمز التحقق");
        setLoading(false);
        return;
      }

      // 💾 persist flow (CRITICAL FIX)
      localStorage.setItem("reset_user", user.username);
      localStorage.setItem("reset_otp", otp);
      localStorage.setItem("reset_flow", "active");

      setDebugOtp(otp);

      setLoading(false);

      // 🚀 IMPORTANT: small delay prevents router race bug
      setTimeout(() => {
        navigate("/reset-password");
      }, 150);

    } catch (err) {
      setError("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}></div>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.title}>نسيت كلمة المرور</h2>

        <p style={styles.desc}>
          أدخل اسم المستخدم لإرسال رمز التحقق
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} disabled={loading} style={styles.button}>
          {loading ? "جاري الإرسال..." : "إرسال الكود"}
        </button>

        {debugOtp && (
          <div style={styles.otpBox}>
            🔐 OTP (DEV ONLY): {debugOtp}
          </div>
        )}

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}

/* 🎨 UI CLEAN */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    fontFamily: "Tahoma",
    position: "relative",
    overflow: "hidden",
  },

  bg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2400&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.6) contrast(1.3)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
  },

  card: {
    position: "relative",
    width: "430px",
    padding: "32px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    textAlign: "center",
    zIndex: 2,
  },

  title: {
    color: "#1e3a8a",
    marginBottom: "10px",
  },

  desc: {
    fontSize: "13px",
    marginBottom: "15px",
    color: "#555",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  back: {
    marginTop: "10px",
    background: "none",
    border: "none",
    color: "#b91c1c",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },

  otpBox: {
    marginTop: "12px",
    padding: "10px",
    background: "#e0f2fe",
    borderRadius: "10px",
    border: "1px solid #38bdf8",
  },
};



