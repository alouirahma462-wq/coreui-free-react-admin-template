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

  // 🔥 FIX: جلب user من localStorage بشكل آمن
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      setFinalUser(user || stored);
    } catch {
      setFinalUser(null);
    }
  }, [user]);

  const fullName = finalUser?.fullName;

  const welcomeText = fullName
    ? `مرحباً ${fullName}`
    : "مرحباً التفقدية العامة - إشراف مركزي";

  // 🔐 قوة كلمة المرور
  const getStrength = (p) => {
    if (p.length < 6) return "ضعيفة";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && p.length >= 8) return "قوية";
    return "متوسطة";
  };

  // 🚀 UPDATE PASSWORD (FIXED FROM ROOT)
  const handleUpdate = async () => {
    setError("");

    if (!finalUser?.id) return setError("❌ لا يوجد مستخدم");
    if (newPass.length < 6) return setError("❌ كلمة المرور قصيرة");
    if (newPass !== confirmPass) return setError("❌ غير متطابقة");
    if (getStrength(newPass) === "ضعيفة")
      return setError("❌ كلمة المرور ضعيفة جداً");

    setLoading(true);

    // 🔥 1. update password in DB
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: false,
      })
      .eq("id", finalUser.id);

    if (updateError) {
      setLoading(false);
      return setError("❌ فشل تحديث كلمة المرور");
    }

    // 🔥 2. IMPORTANT FIX: reload FULL USER from DB (roles included)
    const { data: freshUser, error: fetchError } = await supabase
      .from("users")
      .select(`
        id,
        username,
        fullName,
        court_id,
        courts (id, name),
        roles (id, role_key, role_name, access_level),
        must_change_password
      `)
      .eq("id", finalUser.id)
      .single();

    setLoading(false);

    if (fetchError || !freshUser) {
      return setError("❌ فشل إعادة تحميل البيانات");
    }

    // 🔥 3. Build CLEAN SESSION (IMPORTANT FIX)
    const cleanSession = {
      id: freshUser.id,
      username: freshUser.username,
      fullName: freshUser.fullName,
      court_id: freshUser.court_id,
      court_name: freshUser.courts?.name || null,

      role_key: freshUser.roles?.role_key || null,
      role_name: freshUser.roles?.role_name || null,
      access_level: freshUser.roles?.access_level || null,

      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(cleanSession));

    setSuccess(true);

    // 🚀 Redirect FIXED
    setTimeout(() => {
      const accessLevel = cleanSession.access_level;

      if (accessLevel === "court") {
        navigate(`/court/${cleanSession.court_id}`);
        return;
      }

      if (accessLevel === "global") {
        navigate("/inspection-dashboard");
        return;
      }

      navigate("/login");
    }, 1200);
  };

  if (!finalUser) {
    return <div style={styles.loading}>جاري تحميل البيانات...</div>;
  }

  return (
    <div style={styles.page}>
      {/* BACKGROUND */}
      <div style={styles.bg}></div>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - تغيير كلمة المرور
        </div>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 تغيير كلمة المرور</h2>

        <p style={styles.welcome}>{welcomeText}</p>

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

      <style>
        {`
          @keyframes move {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
}

/* 🎨 FULL STYLES */
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
    width: "430px",
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

  forgot: {
    width: "100%",
    marginTop: "8px",
    background: "transparent",
    border: "none",
    color: "#fbbf24",
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "underline",
  },

  remember: {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
    marginTop: "6px",
    justifyContent: "flex-start",
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


















