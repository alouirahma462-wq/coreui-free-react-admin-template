import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  // 🔊 sound success
  const playSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-success-notification-2310.mp3"
    );
    audio.play();
  };

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    const stored =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }

    const parsed = JSON.parse(stored);

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, fullName, must_change_password, courts(name)")
        .eq("id", parsed.id)
        .single();

      if (error || !data) {
        navigate("/login", { replace: true });
        return;
      }

      if (!data.must_change_password) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setUser(data);
      setChecking(false);
    };

    fetchUser();
  }, [navigate]);

  // =========================
  // WELCOME MESSAGE
  // =========================
  const welcome = () => {
    if (!user) return "";

    if (user.fullName === "التفقدية العامة") {
      return "مرحبا التفقدية العامة - إشراف مركزي";
    }

    return `مرحبا ${user.fullName} - ${user.courts?.name || "محكمة غير محددة"}`;
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChange = async () => {
    setMsg("");

    if (!pass1 || !pass2)
      return setMsg("❌ الرجاء إدخال كلمة المرور");

    if (pass1 !== pass2)
      return setMsg("❌ كلمات المرور غير متطابقة");

    if (pass1.length < 6)
      return setMsg("❌ كلمة المرور ضعيفة");

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        password: pass1,
        must_change_password: false,
        last_login: new Date().toISOString(),
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setMsg("❌ خطأ أثناء الحفظ");
      return;
    }

    playSound();

    const updated = { ...user, must_change_password: false };

    localStorage.setItem("user", JSON.stringify(updated));
    sessionStorage.setItem("user", JSON.stringify(updated));

    setShowModal(true);
    setTimeout(() => setAnimate(true), 50);

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2500);
  };

  if (checking)
    return <div style={styles.loading}>⏳ جاري التحقق...</div>;

  if (!user) return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.card}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
          style={styles.logo}
        />

        <h2 style={styles.title}>⚖️ تغيير كلمة المرور</h2>

        <div style={styles.info}>
          👤 {user.username}
          <br />
          🏛️ {user.fullName}
          <br />
          📍 {user.courts?.name || "محكمة غير محددة"}
        </div>

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          onChange={(e) => setPass1(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          onChange={(e) => setPass2(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleChange}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "جاري الحفظ..." : "تأكيد وتفعيل"}
        </button>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div
            style={{
              ...styles.modal,
              transform: animate ? "scale(1)" : "scale(0.7)",
              opacity: animate ? 1 : 0,
            }}
          >
            <div style={{ fontSize: "60px" }}>🎉</div>

            <h2 style={{ color: "#22c55e" }}>
              تم تسجيل الدخول بنجاح
            </h2>

            <h3 style={{ color: "#fbbf24" }}>
              {user.fullName}
            </h3>

            <p style={{ marginTop: "15px" }}>{welcome()}</p>

            <p style={{ opacity: 0.8 }}>
              جاري تحويلك إلى لوحة التحكم...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   FULL STYLES INSIDE SAME FILE
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #061a33, #0b2e4a)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    direction: "rtl",
    fontFamily: "Tahoma",
  },

  header: {
    width: "100%",
    background: "#b91c1c",
    color: "white",
    textAlign: "center",
    padding: "14px",
    fontWeight: "bold",
  },

  card: {
    marginTop: "40px",
    width: "92%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },

  logo: { width: "80px", marginBottom: "10px" },

  title: { color: "#fbbf24", marginBottom: "15px" },

  info: {
    background: "rgba(255,255,255,0.15)",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    background: "#1e3a8a",
    color: "white",
    fontWeight: "bold",
    border: "none",
  },

  msg: {
    marginTop: "10px",
    color: "#22c55e",
  },

  loading: {
    color: "white",
    textAlign: "center",
    marginTop: "80px",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    color: "white",
    transition: "0.4s ease",
  },
};








