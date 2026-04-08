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

    await supabase
      .from("users")
      .update({
        reset_token: newOtp,
        reset_token_expiry: new Date(expiryTime).toISOString(),
        reset_attempts: 0,
      })
      .eq("id", user.id);

    localStorage.setItem("reset_user", user.username);
    localStorage.setItem("reset_otp", newOtp);
    localStorage.setItem("reset_flow", "active");
    localStorage.setItem("reset_expiry", String(expiryTime));

    setOtp(newOtp);
    startTimer(expiryTime);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>🔐 نسيت كلمة المرور</h2>

        <p style={styles.subtitle}>
          أدخل اسم المستخدم لإرسال رمز التحقق
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button style={styles.btn} onClick={handleSubmit}>
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
          <button
            style={styles.btnSecondary}
            onClick={() => navigate("/reset-password")}
          >
            الانتقال لإدخال الرمز
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================
   🔥 UI FIX ONLY (NO LOGIC CHANGE)
========================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    direction: "rtl",
    color: "white",

    /* 🔥 FIX: REMOVE WHITE SCREEN COMPLETELY */
    backgroundColor: "#0f172a",
    backgroundImage:
      "radial-gradient(circle at top, rgba(185,28,28,0.25), transparent 60%), linear-gradient(135deg, #0f172a, #1e293b)",

    position: "fixed",
    inset: 0,
    overflow: "hidden",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "rgba(185, 28, 28, 0.85)",
    backdropFilter: "blur(10px)",
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
    zIndex: 20,
  },

  /* 🔥 FIX GLASS CARD (NO WHITE + CLEAR TEXT) */
  card: {
    width: "90%",
    maxWidth: "420px",

    backgroundColor: "rgba(2, 6, 23, 0.75)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",

    borderRadius: "20px",
    padding: "28px",
    textAlign: "center",

    border: "1px solid rgba(255,255,255,0.12)",

    boxShadow: "0 30px 80px rgba(0,0,0,0.75)",

    color: "#ffffff",
    position: "relative",
    zIndex: 10,
  },

  title: {
    color: "#fbbf24",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "12px",
    opacity: 0.85,
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "10px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",

    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.25)",

    outline: "none",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",

    position: "relative",
    zIndex: 9999,
    pointerEvents: "auto",
  },

  btn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },

  btnSecondary: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    fontWeight: "bold",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
  },

  otpBox: {
    marginTop: "15px",
    padding: "15px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  otp: {
    fontSize: "26px",
    letterSpacing: "4px",
    fontWeight: "bold",
    color: "#22c55e",
  },

  timer: {
    color: "#fbbf24",
    marginTop: "5px",
  },

  expired: {
    color: "#ff6b6b",
    marginTop: "5px",
  },
};



















