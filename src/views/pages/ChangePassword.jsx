import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({ user, onSuccess }) {
  const navigate = useNavigate();

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [finalUser, setFinalUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 دمج user + localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setFinalUser(user || storedUser);
  }, [user]);

  const fullName = finalUser?.fullName || "المستخدم";

  // 🔥 قوة كلمة المرور
  const getStrength = (pass) => {
    if (pass.length < 6) return "ضعيفة";
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8)
      return "قوية";
    return "متوسطة";
  };

  const handleChange = async () => {
    setErrorMsg("");

    if (!finalUser?.id) {
      setErrorMsg("❌ لا يوجد مستخدم");
      return;
    }

    if (!newPass || newPass.length < 4) {
      setErrorMsg("❌ كلمة المرور قصيرة جداً");
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg("❌ كلمة المرور غير متطابقة");
      return;
    }

    if (getStrength(newPass) === "ضعيفة") {
      setErrorMsg("❌ كلمة المرور ضعيفة جداً");
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

    if (!error) {
      // حفظ localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...finalUser,
          must_change_password: false,
          rememberMe,
        })
      );

      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        onSuccess?.();
        navigate("/dashboard");
      }, 1500);
    } else {
      setErrorMsg("❌ خطأ في تغيير كلمة المرور");
      console.error(error);
    }
  };

  // 🔥 حماية قبل العرض
  if (!finalUser) {
    return (
      <div style={styles.loadingPage}>
        جاري تحميل بيانات المستخدم...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 المحكمة / النيابة العامة - نظام تغيير كلمة المرور
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>مرحباً {fullName}</h2>

        <div style={styles.infoBox}>
          يرجى تغيير كلمة المرور الخاصة بك أول مرة
        </div>

        {/* 🔐 كلمة المرور الجديدة */}
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          style={styles.input}
        />

        {/* 🔐 تأكيد كلمة المرور */}
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          style={styles.input}
        />

        {/* 🔥 قوة كلمة المرور */}
        {newPass && (
          <p style={{ color: "#fbbf24", fontSize: "14px" }}>
            قوة كلمة المرور: <b>{getStrength(newPass)}</b>
          </p>
        )}

        {/* 🔥 تذكرني */}
        <label style={{ color: "white", fontSize: "14px" }}>
          <input
            type="checkbox"
            onChange={(e) => setRememberMe(e.target.checked)}
          />{" "}
          تذكرني
        </label>

        {/* 🔥 زر الحفظ */}
        <button
          onClick={handleChange}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
        </button>

        {/* 🔥 نسيت كلمة المرور */}
        <p
          onClick={() => navigate("/forgot-password")}
          style={styles.forgot}
        >
          هل نسيت كلمة المرور؟
        </p>

        {/* ❌ رسالة خطأ */}
        {errorMsg && <p style={{ color: "#ff6b6b" }}>{errorMsg}</p>}
      </div>

      {/* 🔥 MODAL نجاح */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={{ color: "#22c55e" }}>تم بنجاح 🎉</h2>
            <p>
              مرحباً {fullName}
              <br />
              تم تحديث كلمة المرور بنجاح
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   🎨 STYLE (نفس ستايلك + إضافات)
========================= */
const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #061a33, #0b2e4a)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    direction: "rtl",
    fontFamily: "Tahoma",
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
    width: "90%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },

  title: {
    color: "#fbbf24",
    marginBottom: "15px",
  },

  infoBox: {
    background: "rgba(255,255,255,0.15)",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
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

  forgot: {
    marginTop: "10px",
    color: "#60a5fa",
    cursor: "pointer",
    textDecoration: "underline",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modalBox: {
    width: "90%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    color: "white",
  },

  loadingPage: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#061a33",
    color: "white",
    fontSize: "18px",
  },
};











