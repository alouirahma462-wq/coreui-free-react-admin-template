import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  // 🎵 optional sound (safe)
  useEffect(() => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
    );
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("يرجى إدخال اسم المستخدم");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔥 FIX 1: use maybeSingle instead of single (IMPORTANT)
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

      // 🔐 OTP generation
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      // 🔥 FIX 2: update safely
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

      // 🔥 FIX 3: persist flow (NO STATE LOSS)
      localStorage.setItem("reset_user", user.username);
      localStorage.setItem("reset_flow", "active");

      setDebugOtp(otp);

      setLoading(false);

      // 🚀 SAFE NAVIGATION
      navigate("/reset-password");

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
            🔐 OTP (DEV): {debugOtp}
          </div>
        )}

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}

/* 🎨 SAME UI (kept clean) */
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
    background: "rgba(0,0,0,0.45)",
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



