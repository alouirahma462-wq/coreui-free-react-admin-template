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

  useEffect(() => {
    localStorage.removeItem("reset_user");
    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_flow");
    localStorage.removeItem("reset_expiry");
  }, []);

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

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = Date.now() + 60 * 1000;

      await supabase.from("users").update({
        reset_token: newOtp,
        reset_token_expiry: new Date(expiryTime).toISOString(),
        reset_attempts: 0,
      }).eq("id", user.id);

      localStorage.setItem("reset_user", user.username);
      localStorage.setItem("reset_otp", newOtp);
      localStorage.setItem("reset_flow", "active");
      localStorage.setItem("reset_expiry", String(expiryTime));

      setOtp(newOtp);
      startTimer(expiryTime);

      setLoading(false);

    } catch (err) {
      setError("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  const goToReset = () => navigate("/reset-password");
  const resendOtp = () => handleSubmit();

  return (
    <>
      {/* 🎬 ANIMATION STYLE INSIDE SAME FILE */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes moveLight {
          0% { transform: translate(-20%, -20%); }
          50% { transform: translate(20%, 20%); }
          100% { transform: translate(-20%, -20%); }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.light}></div>

        <div style={styles.crest}>🇹🇳 الجمهورية التونسية</div>

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
              <div style={styles.otp}>{otp}</div>

              {active ? (
                <p style={styles.timer}>⏱ {timer} ثانية</p>
              ) : (
                <p style={styles.expired}>⛔ انتهت الصلاحية</p>
              )}
            </div>
          )}

          {otp && active && (
            <button onClick={goToReset} style={styles.goBtn}>
              الانتقال لإدخال الرمز
            </button>
          )}

          {!active && otp && (
            <button onClick={resendOtp} style={styles.resend}>
              🔁 إعادة إرسال
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* 🎨 FULL COURT DESIGN */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Tahoma",
    direction: "rtl",
    overflow: "hidden",

    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.9)),
      url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  light: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.25), transparent 60%)",
    animation: "moveLight 6s infinite linear",
  },

  crest: {
    position: "absolute",
    top: "20px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "1px",
    textShadow: "0 0 10px rgba(255,255,255,0.4)",
  },

  card: {
    width: "450px",
    padding: "32px",
    borderRadius: "18px",

    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(18px)",

    textAlign: "center",

    border: "1px solid rgba(30,58,138,0.3)",

    boxShadow: "0 30px 80px rgba(0,0,0,0.75)",

    animation: "fadeSlide 0.8s ease",
    zIndex: 2,
  },

  title: {
    color: "#1e3a8a",
    fontSize: "22px",
    fontWeight: "bold",
  },

  desc: { fontSize: "13px", marginBottom: "10px", color: "#444" },

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

  goBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "#10b981",
    color: "white",
    border: "none",
    fontWeight: "bold",
  },

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
  }







