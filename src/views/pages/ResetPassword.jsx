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

  // 🔥 SAFE LOAD
  useEffect(() => {
    const user = localStorage.getItem("reset_user");

    if (!user) {
      navigate("/login");
      return;
    }

    setUsername(user);
    setReady(true);
  }, [navigate]);

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setErrorMsg("يرجى إدخال جميع الحقول");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 🔥 SAFE QUERY
      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (supabaseError || !data) {
        setErrorMsg("المستخدم غير موجود");
        setLoading(false);
        return;
      }

      // ⛔ OTP CHECK
      if (data.reset_token !== otp) {
        setErrorMsg("رمز التحقق غير صحيح");
        setLoading(false);
        return;
      }

      // ⏰ EXPIRY CHECK
      if (new Date(data.reset_token_expiry) < new Date()) {
        setErrorMsg("انتهت صلاحية الرمز");
        setLoading(false);
        return;
      }

      // 🔐 UPDATE PASSWORD
      const { error: updateError } = await supabase
        .from("users")
        .update({
          password: newPassword,
          reset_token: null,
          reset_token_expiry: null,
          reset_attempts: 0,
        })
        .eq("id", data.id);

      if (updateError) {
        setErrorMsg("فشل تحديث كلمة المرور");
        setLoading(false);
        return;
      }

      setSuccessMsg("تم تغيير كلمة المرور بنجاح ✔");

      // 🧹 CLEAN FLOW
      localStorage.removeItem("reset_user");
      localStorage.removeItem("reset_otp");
      localStorage.removeItem("reset_flow");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setErrorMsg("حدث خطأ غير متوقع");
    }

    setLoading(false);
  };

  if (!ready) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        جاري التحقق...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.bg}></div>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.title}>إعادة تعيين كلمة المرور</h2>

        <p style={styles.subtitle}>حساب: {username}</p>

        {errorMsg && <div style={styles.error}>{errorMsg}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        <input
          placeholder="رمز التحقق OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleReset} disabled={loading} style={styles.button}>
          {loading ? "جاري التحديث..." : "تغيير كلمة المرور"}
        </button>

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}

/* 🎨 UI */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Tahoma",
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
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(30,58,138,0.45))",
  },

  card: {
    position: "relative",
    width: "420px",
    padding: "30px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    textAlign: "center",
    zIndex: 2,
  },

  title: { color: "#1e3a8a" },
  subtitle: { fontSize: "13px", marginBottom: "10px" },

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
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    border: "none",
    fontWeight: "bold",
  },

  back: {
    marginTop: "10px",
    background: "none",
    border: "none",
    color: "#b91c1c",
  },

  error: { color: "red" },
  success: { color: "green" },
};



