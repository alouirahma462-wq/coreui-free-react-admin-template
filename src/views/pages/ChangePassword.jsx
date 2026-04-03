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

  // =========================
  // تحميل المستخدم + حماية
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

    if (!parsed.must_change_password) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setUser(parsed);
    setChecking(false);
  }, [navigate]);

  // =========================
  // رسالة الترحيب حسب fullName
  // =========================
  const getWelcomeMessage = () => {
    if (user?.fullName === "التفقدية العامة") {
      return "مرحبا التفقدية العامة - إشراف مركزي";
    }

    return "مرحبا وكيل الجمهورية - تونس المحكمة الابتدائية تونس";
  };

  // =========================
  // تغيير كلمة المرور
  // =========================
  const handleChange = async () => {
    setMsg("");

    if (!pass1 || !pass2) return setMsg("❌ الرجاء إدخال كلمة المرور");
    if (pass1 !== pass2) return setMsg("❌ كلمات المرور غير متطابقة");
    if (pass1.length < 6) return setMsg("❌ كلمة المرور ضعيفة");

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

    if (error) return setMsg("❌ حدث خطأ أثناء الحفظ");

    // =========================
    // تحديث المستخدم
    // =========================
    const updatedUser = {
      ...user,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    // =========================
    // تشغيل المودال بدل msg
    // =========================
    setShowModal(true);

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);
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

        <h2 style={styles.title}>⚖️ العدل أساس العمران</h2>

        <div style={styles.infoBox}>
          👤 {user.username}
          <br />
          🏛️ {user.fullName}
          <br />
          🔐 يجب تغيير كلمة المرور لتفعيل الحساب
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

      {/* =========================
          MODAL FANCY SUCCESS
      ========================= */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>

            <div style={{ fontSize: "55px" }}>🎉</div>

            <h2 style={{ color: "#22c55e" }}>
              تم تسجيل الدخول بنجاح
            </h2>

            <h3 style={{ color: "#fbbf24", marginTop: "10px" }}>
              {user.fullName}
            </h3>

            <p style={{ marginTop: "15px", fontSize: "16px" }}>
              {getWelcomeMessage()}
            </p>

            <p style={{ marginTop: "10px", opacity: 0.8 }}>
              جاري تحويلك إلى لوحة التحكم...
            </p>

          </div>
        </div>
      )}
    </div>
  );
}




