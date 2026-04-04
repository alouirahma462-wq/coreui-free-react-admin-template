import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  useEffect(() => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
    );
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!username) {
      setError("يرجى إدخال اسم المستخدم");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (userError || !user) {
        setError("❌ المستخدم غير موجود");
        setLoading(false);
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      const { error: updateError } = await supabase
        .from("users")
        .update({
          reset_token: otp,
          reset_token_expiry: expiry.toISOString(),
          reset_attempts: 0,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("❌ فشل حفظ الكود");
        setLoading(false);
        return;
      }

      setDebugOtp(otp);

      // 🚀 FIXED: بدل state → localStorage
      localStorage.setItem("reset_user", user.username);

      setLoading(false);

      // 🚀 direct navigation (NO timeout)
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
        <div style={styles.header}>
          <h2 style={styles.title}>
            الجمهورية التونسية - وزارة العدل
          </h2>
          <p style={styles.motto}>العدل أساس العمران</p>
        </div>

        <h3 style={styles.h3}>نسيت كلمة المرور</h3>

        <p style={styles.desc}>
          أدخل اسم المستخدم لإرسال رمز إعادة التعيين
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
          {loading ? "جاري إرسال الكود..." : "إرسال الكود"}
        </button>

        {debugOtp && (
          <div style={styles.otpBox}>
            🔐 كود التحقق (تجريبي فقط): {debugOtp}
          </div>
        )}

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES (UNCHANGED) */
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
    filter: "brightness(0.6) contrast(1.3) saturate(1.1)",
    transform: "scale(1.05)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(30,58,138,0.45))",
  },

  card: {
    position: "relative",
    width: "430px",
    padding: "32px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    textAlign: "center",
    zIndex: 2,
  },

  header: {
    marginBottom: "15px",
  },

  title: {
    fontSize: "18px",
    color: "#b91c1c",
    fontWeight: "bold",
    margin: 0,
  },

  motto: {
    fontSize: "13px",
    color: "#1e3a8a",
    fontStyle: "italic",
    marginTop: "5px",
  },

  h3: {
    color: "#1e3a8a",
    marginBottom: "6px",
  },

  desc: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "15px",
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
    border: "none",
    color: "white",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    fontWeight: "bold",
    cursor: "pointer",
  },

  back: {
    marginTop: "12px",
    background: "none",
    border: "none",
    color: "#b91c1c",
    cursor: "pointer",
    textDecoration: "underline",
  },

  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "13px",
  },

  otpBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#e0f2fe",
    border: "1px solid #38bdf8",
    borderRadius: "10px",
    color: "#075985",
    fontWeight: "bold",
  },
};


