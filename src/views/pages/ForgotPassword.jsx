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

  // 🧹 clean old session
  useEffect(() => {
    localStorage.removeItem("reset_user");
    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_flow");
  }, []);

  // ⏱ start timer
  const startTimer = () => {
    let time = 30;
    setTimer(time);
    setActive(true);

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      time--;
      setTimer(time);

      if (time <= 0) {
        clearInterval(intervalRef.current);
        setActive(false);
        setOtp("");

        setError("⛔ انتهت صلاحية رمز التحقق. اضغط إعادة إرسال");
      }
    }, 1000);
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

      const expiry = new Date(Date.now() + 30 * 1000);

      const { error: updateError } = await supabase
        .from("users")
        .update({
          reset_token: newOtp,
          reset_token_expiry: expiry.toISOString(),
          reset_attempts: 0,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("❌ خطأ في إنشاء الكود");
        setLoading(false);
        return;
      }

      // 💾 save local flow
      localStorage.setItem("reset_user", user.username);
      localStorage.setItem("reset_otp", newOtp);
      localStorage.setItem("reset_flow", "active");

      setOtp(newOtp);

      startTimer();

      setLoading(false);

      // 🚀 auto go to reset page
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);

    } catch (err) {
      setError("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  // 🔁 resend
  const resendOtp = () => {
    handleSubmit();
  };

  return (
    <div style={styles.page}>
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

        {/* 🔐 OTP BOX */}
        {otp && (
          <div style={styles.otpBox}>
            <h3>رمز التحقق</h3>

            <h1 style={styles.otpText}>{otp}</h1>

            {active ? (
              <p style={styles.timer}>
                ⏱ ينتهي خلال: {timer} ثانية
              </p>
            ) : (
              <p style={styles.expired}>⛔ انتهت الصلاحية</p>
            )}
          </div>
        )}

        {/* 🔁 resend button */}
        {!active && otp && (
          <button onClick={resendOtp} style={styles.resend}>
            🔁 إعادة إرسال الكود
          </button>
        )}

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
        </button>
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
    background:
      "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
  },

  card: {
    width: "430px",
    padding: "30px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  title: {
    color: "#1e3a8a",
    marginBottom: "5px",
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
    outline: "none",
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

  otpBox: {
    marginTop: "15px",
    padding: "15px",
    borderRadius: "12px",
    background: "#e0f2fe",
    border: "1px solid #38bdf8",
  },

  otpText: {
    letterSpacing: "6px",
    fontSize: "28px",
    margin: "10px 0",
  },

  timer: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },

  expired: {
    color: "red",
    fontWeight: "bold",
  },

  resend: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    width: "100%",
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
    fontWeight: "bold",
  },
};



