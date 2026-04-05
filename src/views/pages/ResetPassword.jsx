import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [ready, setReady] = useState(false);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ⏱ TIMER
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  // 🔥 INIT
  useEffect(() => {
    const user = localStorage.getItem("reset_user");
    const flow = localStorage.getItem("reset_flow");
    const expiry = localStorage.getItem("reset_expiry");

    if (!user || flow !== "active" || !expiry) {
      navigate("/login");
      return;
    }

    setUsername(user);
    setReady(true);

    const expiryTime = Number(expiry);

    const updateTimer = () => {
      const diff = Math.floor((expiryTime - Date.now()) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        setExpired(true);
        setErrorMsg("⛔ انتهت صلاحية رمز التحقق");
        localStorage.removeItem("reset_otp");
        return;
      }

      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 🔁 resend
  const resendOtp = () => {
    navigate("/forgot-password");
  };

  // 🚨 RESET
  const handleReset = async () => {
    if (expired) {
      setErrorMsg("⛔ انتهت صلاحية الرمز");
      return;
    }

    if (!otp || !newPassword) {
      setErrorMsg("يرجى إدخال جميع الحقول");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error || !data) {
        setErrorMsg("المستخدم غير موجود");
        setLoading(false);
        return;
      }

      const storedOtp = localStorage.getItem("reset_otp");

      if (!storedOtp || otp !== storedOtp) {
        setErrorMsg("❌ رمز التحقق غير صحيح");
        setLoading(false);
        return;
      }

      // ⛔ FINAL EXPIRY CHECK (MASTER)
      if (Date.now() > Number(data.reset_token_expiry)) {
        setErrorMsg("⛔ انتهت صلاحية الرمز");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          password: newPassword,
          reset_token: null,
          reset_token_expiry: null,
        })
        .eq("id", data.id);

      if (updateError) {
        setErrorMsg("فشل تحديث كلمة المرور");
        setLoading(false);
        return;
      }

      setSuccessMsg("✔ تم تغيير كلمة المرور بنجاح");

      localStorage.removeItem("reset_user");
      localStorage.removeItem("reset_otp");
      localStorage.removeItem("reset_flow");
      localStorage.removeItem("reset_expiry");

      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      setErrorMsg("حدث خطأ غير متوقع");
    }

    setLoading(false);
  };

  if (!ready) {
    return <div style={{ textAlign: "center", marginTop: 50 }}>جاري التحقق...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2>إعادة تعيين كلمة المرور</h2>
        <p>الحساب: {username}</p>

        {/* ⏱ TIMER */}
        <div style={{ marginBottom: 10, fontWeight: "bold" }}>
          ⏱ الوقت المتبقي: {timeLeft} ثانية
        </div>

        {errorMsg && <div style={styles.error}>{errorMsg}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        <input
          disabled={expired}
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        <input
          disabled={expired}
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />

        <button
          disabled={loading || expired}
          onClick={handleReset}
          style={styles.button}
        >
          {loading ? "جاري..." : "تغيير كلمة المرور"}
        </button>

        <button onClick={resendOtp} style={styles.resend}>
          إعادة إرسال OTP
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
    background: "#0f172a",
    fontFamily: "Tahoma",
  },

  card: {
    width: "420px",
    padding: "25px",
    borderRadius: "15px",
    background: "white",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  resend: {
    width: "100%",
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },

  error: { color: "red" },
  success: { color: "green" },
};





