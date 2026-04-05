import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("reset_user");
    const flow = localStorage.getItem("reset_flow");

    if (!user || flow !== "active") {
      navigate("/login");
      return;
    }

    setUsername(user);
  }, [navigate]);

  const handleReset = async () => {
    setError("");

    const storedOtp = localStorage.getItem("reset_otp");
    const expiry = parseInt(localStorage.getItem("reset_expiry"));

    if (Date.now() > expiry) {
      setError("⛔ انتهت صلاحية الرمز");
      return;
    }

    if (otp.trim() !== String(storedOtp).trim()) {
      setError("❌ رمز غير صحيح");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error || !data) {
      setError("المستخدم غير موجود");
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
      setError("فشل التحديث");
      return;
    }

    localStorage.clear();

    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>🔐 تغيير كلمة المرور</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          placeholder="OTP"
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

        <button onClick={handleReset} style={styles.button}>
          تغيير كلمة المرور
        </button>
      </div>

      {/* 🎉 SUCCESS MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.check}>✔</div>
            <h3>تم التغيير بنجاح</h3>
            <p>سيتم تحويلك لتسجيل الدخول</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   🎨 UNIFIED SYSTEM STYLE
========================= */

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    fontFamily: "Tahoma",
    color: "white",

    /* 🔥 unified background */
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
  },

  card: {
    width: "420px",
    padding: "30px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  title: {
    color: "#fbbf24",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "10px",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    color: "white",
  },

  check: {
    fontSize: "40px",
    color: "#22c55e",
  },
};








