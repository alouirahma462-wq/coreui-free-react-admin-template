import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./ForgotPassword.module.css";

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
  };

  return (
  <div className={styles.forgotPage}>
    <div className={styles.crest}>🇹🇳 الجمهورية التونسية</div>

    <div className={styles.card}>
      <h2 className={styles.title}>🔐 نسيت كلمة المرور</h2>
      <p className={styles.subtitle}>أدخل اسم المستخدم لإرسال رمز التحقق</p>

      {error && <div className={styles.subtitle}>{error}</div>}

      <input
        className={styles.input}
        placeholder="اسم المستخدم"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button className={styles.btn} onClick={handleSubmit}>
        {loading ? "جاري الإرسال..." : "إرسال الكود"}
      </button>

      {otp && (
        <div className={styles.otpBox}>
          <div className={styles.otp}>{otp}</div>

          {active ? (
            <p className={styles.timer}>⏱ {timer} ثانية</p>
          ) : (
            <p className={styles.expired}>⛔ انتهت الصلاحية</p>
          )}
        </div>
      )}

      {otp && active && (
        <button
          className={styles.btn}
          onClick={() => navigate("/reset-password")}
        >
          الانتقال لإدخال الرمز
        </button>
      )}
    </div>
  </div>
);
}













