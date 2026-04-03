import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ChangePassword({ user, onSuccess }) {
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fullName = user?.fullName || "المستخدم";

  const handleChange = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: false,
      })
      .eq("id", user.id);

    setLoading(false);

    if (!error) {
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        onSuccess(); // يوديك للداشبورد
      }, 2500);
    } else {
      alert("خطأ في تغيير كلمة المرور");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        المحكمة / النيابة العامة - نظام تغيير كلمة المرور
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>مرحباً {fullName}</h2>

        <div style={styles.infoBox}>
          يرجى تغيير كلمة المرور الخاصة بك أول مرة
        </div>

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          style={styles.input}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleChange}
          disabled={loading}
        >
          {loading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
        </button>
      </div>

      {/* MODAL */}
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
   STYLES (جاهز بدون نقص)
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
    cursor: "pointer",
    border: "none",
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
};








