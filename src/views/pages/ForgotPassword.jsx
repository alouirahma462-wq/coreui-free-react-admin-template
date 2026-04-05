import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);

  const intervalRef = useRef(null);

  // 🧹 reset old session
  useEffect(() => {
    localStorage.removeItem("reset_user");
    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_flow");
    localStorage.removeItem("reset_expiry");
  }, []);

  // ⏱ timer based on real expiry
  const startTimer = (expiryTime) => {
    clearInterval(intervalRef.current);

    const update = () => {
      const diff = Math.floor((expiryTime - Date.now()) / 1000);

      if (diff <= 0) {
        clearInterval(intervalRef.current);
        setTimer(0);
        setActive(false);
        setError("⛔ انتهت صلاحية رمز التحقق");
        return;
      }

      setTimer(diff);
      setActive(true);
    };

    update();
    intervalRef.current = setInterval(update, 1000);
  };

  // 📩 send OTP
  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("يرجى إدخال اسم المستخدم");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("username", username.trim())
        .maybeSingle();

      if (!user) {
        setError("❌ المستخدم غير موجود");
        setLoading(false);
        return;
      }

      // 🔐 OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // ⏱ REAL expiry (60s stable)
      const expiryTime = Date.now() + 60 * 1000;

      const { error: updateError } = await supabase
        .from("users")
        .update({
          reset_token: newOtp,
          reset_token_expiry: new Date(expiryTime).toISOString(),
          reset_attempts: 0,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("❌ خطأ في إنشاء الكود");
        setLoading(false);
        return;
      }

      // 💾 local session
      localStorage.setItem("reset_user", user.username);
      localStorage.setItem("reset_otp", newOtp);
      localStorage.setItem("reset_flow", "active");
      localStorage.setItem("reset_expiry", expiryTime.toString());

      setOtp(newOtp);
      startTimer(expiryTime);

      setLoading(false);

      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);

    } catch (err) {
      setError("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  const resendOtp = () => handleSubmit();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 نسيت كلمة المرور</h2>

        <p style={styles.desc}>أدخل اسم المستخدم لإرسال رمز التحقق</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} disabled={loading} style={styles.button}>
          {loading ? "جاري الإرسال..." : "إرسال الكود"}
        </button>

        {otp && (
          <div style={styles.otpBox}>
            <h3>رمز التحقق</h3>

            <div style={styles.otp}>{otp}</div>

            {active ? (
              <p style={styles.timer}>⏱ {timer} ثانية متبقية</p>
            ) : (
              <p style={styles.expired}>⛔ انتهت الصلاحية</p>
            )}
          </div>
        )}

        {!active && otp && (
          <button onClick={resendOtp} style={styles.resend}>
            🔁 إعادة إرسال
          </button>
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLE */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    fontFamily: "Tahoma",
    background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
  },

  card: {
    width: "420px",
    padding: "30px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.95)",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },

  title: { color: "#1e3a8a" },

  desc: { fontSize: "13px", marginBottom: "10px", color: "#555" },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "white",
    border: "none",
    fontWeight: "bold",
  },

  otpBox: {
    marginTop: "15px",
    padding: "15px",
    borderRadius: "12px",
    background: "#e0f2fe",
  },

  otp: {
    fontSize: "28px",
    letterSpacing: "6px",
    fontWeight: "bold",
  },

  timer: { color: "#1e3a8a", fontWeight: "bold" },

  expired: { color: "red", fontWeight: "bold" },

  resend: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
  },

  error: {
    color: "red",
    marginBottom: "10px",
    fontWeight: "bold",
  },
};




