import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 🔐 LOAD USER SAFE
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));

    if (!stored) {
      navigate("/login");
      return;
    }

    setUser(stored);
  }, [navigate]);

  // 🔐 PASSWORD STRENGTH
  const getStrength = (p) => {
    if (p.length < 6) return "ضعيفة";
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && p.length >= 8) return "قوية";
    return "متوسطة";
  };

  // 🚀 DASHBOARD ROUTER
  const goToDashboard = (u) => {
    if (u.access_level === "court") {
      navigate(`/court/${u.court_id}`);
      return;
    }

    if (u.access_level === "global") {
      navigate("/inspection-dashboard");
      return;
    }

    navigate("/login");
  };

  // 🚀 UPDATE PASSWORD (FINAL FIX)
  const handleUpdate = async () => {
    setError("");

    if (!user?.id) return setError("❌ لا يوجد مستخدم");
    if (newPass.length < 6) return setError("❌ كلمة المرور قصيرة");
    if (newPass !== confirmPass)
      return setError("❌ كلمة المرور غير متطابقة");

    setLoading(true);

    // 🔥 1. UPDATE PASSWORD + REMOVE FIRST LOGIN FLAG
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: false,
      })
      .eq("id", user.id);

    if (updateError) {
      setLoading(false);
      return setError("❌ فشل تحديث كلمة المرور");
    }

    // 🔥 2. BUILD UPDATED SESSION (IMPORTANT FIX)
    const updatedUser = {
      ...user,
      password: newPass,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setLoading(false);
    setSuccess(true);

    // 🎯 SHORT DELAY THEN REDIRECT
    setTimeout(() => {
      goToDashboard(updatedUser);
    }, 1000);
  };

  if (!user) {
    return (
      <div style={styles.loading}>
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🔐 تغيير كلمة المرور</h2>

        <p>مرحباً {user.fullName}</p>

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
          <p>قوة كلمة المرور: {getStrength(newPass)}</p>
        )}

        <button onClick={handleUpdate} disabled={loading} style={styles.btn}>
          {loading ? "جاري التحديث..." : "تحديث"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {success && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>✔ تم التحديث بنجاح</h3>
            <p>سيتم تحويلك الآن...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* SIMPLE STYLES */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    direction: "rtl",
  },

  card: {
    width: "400px",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
  },

  btn: {
    width: "100%",
    padding: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    padding: "20px",
    background: "white",
    color: "black",
    borderRadius: "10px",
  },

  loading: {
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};


















