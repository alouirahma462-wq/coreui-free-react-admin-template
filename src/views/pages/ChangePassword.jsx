import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({ user, onSuccess }) {
  const navigate = useNavigate();

  const [finalUser, setFinalUser] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setFinalUser(user || stored);
  }, [user]);

  const fullName = finalUser?.fullName || "المستخدم";

  /* 🔐 PASSWORD STRENGTH */
  const getStrength = (p) => {
    if (p.length < 6) return "ضعيفة";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && p.length >= 8) return "قوية";
    return "متوسطة";
  };

  /* 🚀 UPDATE PASSWORD */
  const handleUpdate = async () => {
    setError("");

    if (!finalUser?.id) {
      setError("❌ لا يوجد مستخدم");
      return;
    }

    if (newPass.length < 6) {
      setError("❌ كلمة المرور قصيرة");
      return;
    }

    if (newPass !== confirmPass) {
      setError("❌ كلمة المرور غير متطابقة");
      return;
    }

    if (getStrength(newPass) === "ضعيفة") {
      setError("❌ كلمة المرور ضعيفة جداً");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: false,
      })
      .eq("id", finalUser.id);

    setLoading(false);

    if (error) {
      setError("❌ فشل التحديث");
      return;
    }

    /* update localStorage */
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...finalUser,
        must_change_password: false,
      })
    );

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onSuccess?.();

      const role = finalUser.role;

      if (role === "inspector" || role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/court-dashboard");
      }
    }, 1600);
  };

  if (!finalUser) {
    return <div style={styles.loading}>جاري تحميل بيانات المستخدم...</div>;
  }

  return (
    <div style={styles.page}>

      {/* 🇹🇳 BACKGROUND (COURT + FLAG WATERMARK) */}
      <div style={styles.bg}></div>

      {/* 🔴 TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - نظام تغيير كلمة المرور - المحكمة الابتدائية 🇹🇳
        </div>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 تغيير كلمة المرور</h2>

        <p style={styles.welcome}>مرحباً {fullName}</p>

        <div style={styles.info}>
          يجب تغيير كلمة المرور قبل الدخول للنظام
        </div>

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          style={styles.input}
        />

        {newPass && (
          <p style={styles.strength}>
            قوة كلمة المرور: <b>{getStrength(newPass)}</b>
          </p>
        )}

        <button onClick={handleUpdate} disabled={loading} style={styles.btn}>
          {loading ? "جاري الحفظ..." : "تحديث كلمة المرور"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* SUCCESS MODAL */}
      {success && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h2 style={{ color: "#22c55e" }}>✔ تم التحديث بنجاح</h2>
            <p>سيتم تحويلك تلقائياً...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   🎨 STYLES (GOV STYLE)
========================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    color: "white",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },

  /* 🇹🇳 COURT + FLAG WATERMARK */
  bg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/ce/Coat_of_arms_of_Tunisia.svg'), url('https://upload.wikimedia.org/wikipedia/commons/5/53/Tunis_Courthouse.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "300px, cover",
    opacity: 0.08,
    filter: "grayscale(100%)",
    zIndex: 0,
  },

  /* 🔴 TOP BAR */
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    overflow: "hidden",
    padding: "10px 0",
    zIndex: 2,
  },

  marquee: {
    display: "inline-block",
    whiteSpace: "nowrap",
    paddingLeft: "100%",
    animation: "move 12s linear infinite",
    fontWeight: "bold",
  },

  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.15)",
    textAlign: "center",
    zIndex: 2,
  },

  title: {
    color: "#fbbf24",
    marginBottom: "10px",
  },

  welcome: {
    marginBottom: "10px",
    fontSize: "14px",
  },

  info: {
    background: "rgba(255,255,255,0.12)",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "6px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  btn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  strength: {
    fontSize: "13px",
    color: "#fbbf24",
  },

  error: {
    color: "#f87171",
    marginTop: "10px",
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalBox: {
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center",
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
};

/* 🟡 ANIMATION */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes move {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}
`, styleSheet.cssRules.length);
















