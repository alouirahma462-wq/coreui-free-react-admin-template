import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setError("يرجى إدخال جميع الحقول");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 🔍 جلب المستخدم
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !user) {
        setError("المستخدم غير موجود");
        setLoading(false);
        return;
      }

      // ⛔ تحقق من OTP
      if (user.reset_token !== otp) {
        setError("رمز التحقق غير صحيح");
        setLoading(false);
        return;
      }

      // ⏰ تحقق من انتهاء الصلاحية
      if (new Date(user.reset_token_expiry) < new Date()) {
        setError("انتهت صلاحية الرمز");
        setLoading(false);
        return;
      }

      // 🔐 تحديث كلمة المرور + تنظيف التوكن
      const { error: updateError } = await supabase
        .from("users")
        .update({
          password: newPassword,
          reset_token: null,
          reset_token_expiry: null,
          reset_attempts: 0,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("فشل تحديث كلمة المرور");
        setLoading(false);
        return;
      }

      setSuccess("تم تغيير كلمة المرور بنجاح ✔");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError("حدث خطأ غير متوقع");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* 🏛️ خلفية المحكمة */}
      <div style={styles.bg}></div>
      <div style={styles.overlay}></div>

      {/* 🧾 الكرت */}
      <div style={styles.card}>
        <h2 style={styles.title}>إعادة تعيين كلمة المرور</h2>

        <p style={styles.subtitle}>
          حساب: {username}
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

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

        <button onClick={handleReset} style={styles.button} disabled={loading}>
          {loading ? "جاري التحديث..." : "تغيير كلمة المرور"}
        </button>

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}

/* 🎨 نفس هوية المحكمة */
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
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    textAlign: "center",
    zIndex: 2,
  },

  title: {
    color: "#1e3a8a",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "13px",
    marginBottom: "15px",
  },

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

  success: {
    color: "green",
    marginBottom: "10px",
  },
};
