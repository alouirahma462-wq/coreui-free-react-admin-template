import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 🎧 MUSIC
  const musicRef = useRef(null);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = 0.5;
      musicRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("reset_user");
    const flow = localStorage.getItem("reset_flow");
    const expiry = localStorage.getItem("reset_expiry");

    if (!user || flow !== "active" || !expiry) {
      localStorage.removeItem("reset_user");
      localStorage.removeItem("reset_otp");
      localStorage.removeItem("reset_flow");
      localStorage.removeItem("reset_expiry");

      navigate("/login", { replace: true });
      return;
    }

    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem("reset_user");
      localStorage.removeItem("reset_otp");
      localStorage.removeItem("reset_flow");
      localStorage.removeItem("reset_expiry");

      navigate("/forgot-password", { replace: true });
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

      {/* 🎬 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src="/justice-bg.mp4" type="video/mp4" />
      </video>

      {/* 🎧 MUSIC */}
      <audio ref={musicRef} loop>
        <source src="/gov-music.mp3" type="audio/mpeg" />
      </audio>

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

/* نفس الستايل بدون تغيير */
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
    position: "fixed",
    inset: 0,
    overflow: "hidden",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    background: "rgba(185, 28, 28, 0.9)",
    backdropFilter: "blur(12px)",
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
    zIndex: 1000,
  },

  card: {
    width: "90%",
    maxWidth: "420px",
    padding: "30px",
    backgroundColor: "rgba(2, 6, 23, 0.75)",
    backdropFilter: "blur(30px)",
    borderRadius: "22px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.75)",
  },

  title: {
    color: "#fbbf24",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "white",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "10px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    background: "rgba(2, 6, 23, 0.85)",
    backdropFilter: "blur(25px)",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  check: {
    fontSize: "42px",
    color: "#22c55e",
  },
};











