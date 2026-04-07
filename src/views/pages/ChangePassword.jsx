import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({ user }) {
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

  /* 🔐 password strength */
  const getStrength = (p) => {
    if (p.length < 6) return "ضعيفة";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && p.length >= 8) return "قوية";
    return "متوسطة";
  };

  /* 🚀 update password */
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
      setError("❌ فشل تحديث كلمة المرور");
      return;
    }

    /* تحديث localStorage */
    const updatedUser = {
      ...finalUser,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);

      const accessLevel = finalUser.access_level;

      // 🏛️ COURT USERS
      if (accessLevel === "court") {
        navigate(`/court-dashboard/${finalUser.court_id}`);
        return;
      }

      // 🕵️ INSPECTION USERS
      if (accessLevel === "global") {
        navigate("/inspection-dashboard");
        return;
      }

      navigate("/");
    }, 1500);
  };

  if (!finalUser) {
    return <div style={styles.loading}>جاري تحميل البيانات...</div>;
  }

  return (
    <div style={styles.page}>

      {/* 🇹🇳 BACKGROUND */}
      <div style={styles.bg}></div>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - تغيير كلمة المرور - منظومة النيابة العمومية 🇹🇳
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

      {/* SUCCESS */}
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
   🎨 FINAL STYLES
========================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },

  bg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/ce/Coat_of_arms_of_Tunisia.svg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "320px",
    opacity: 0.08,
  },

  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  marquee: {
    display: "inline-block",
    paddingLeft: "100%",
    animation: "move 12s linear infinite",
    fontWeight: "bold",
  },

  card: {
    width: "420px",
    padding: "25px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.15)",
    textAlign: "center",
  },

  title: {
    color: "#fbbf24",
    marginBottom: "10px",
  },

  welcome: {
    marginBottom: "10px",
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
    fontWeight: "bold",
    cursor: "pointer",
  },

  strength: {
    color: "#fbbf24",
    fontSize: "13px",
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

/* animation */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes move {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}
`, styleSheet.cssRules.length);

















