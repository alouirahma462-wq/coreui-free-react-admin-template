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

  // 🔐 Load user
  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("id, fullName, must_change_password, court_id")
        .eq("id", userId)
        .single();

      if (!data) {
        navigate("/login");
        return;
      }

      // ❗ فقط أول مرة مسموح
      if (!data.must_change_password) {
        navigate("/");
        return;
      }

      setUser(data);
    };

    loadUser();
  }, [navigate]);

  // 🎯 redirect logic بعد التحديث
  const redirectToLogin = () => {
    localStorage.removeItem("user_id");
    navigate("/login", { replace: true });
  };

  // 🔐 update password
  const handleUpdate = async () => {
    setError("");

    if (!newPass || !confirmPass) {
      setError("❌ الرجاء إدخال كلمة المرور");
      return;
    }

    if (newPass !== confirmPass) {
      setError("❌ كلمة المرور غير متطابقة");
      return;
    }

    if (newPass.length < 6) {
      setError("❌ كلمة المرور قصيرة جداً");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: false,
      })
      .eq("id", user.id);

    if (error) {
      setError("❌ فشل تحديث كلمة المرور");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);

    // ⏳ بعد نجاح → رجوع للـ login
    setTimeout(() => {
      redirectToLogin();
    }, 1500);
  };

  if (!user) {
    return <div style={styles.loading}>جاري التحميل...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 🔥 Welcome message */}
        <h2>🔐 مرحباً {user.fullName}</h2>
        <p>يرجى تغيير كلمة المرور للدخول إلى النظام</p>

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

        <button onClick={handleUpdate} disabled={loading} style={styles.btn}>
          {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {success && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>✔ تم تحديث كلمة المرور</h3>
            <p>سيتم تحويلك لتسجيل الدخول...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
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



















