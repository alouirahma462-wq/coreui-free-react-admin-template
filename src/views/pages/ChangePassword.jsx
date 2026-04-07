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

  // 🔐 LOAD USER (FIXED ROOT)
  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          username,
          fullName,
          must_change_password,
          court_id,
          role_id,
          courts (id, name)
        `)
        .eq("id", userId)
        .single();

      if (error || !data) {
        navigate("/login");
        return;
      }

      setUser(data);

      // 🔥 إذا ما عاد يحتاج تغيير كلمة المرور
      if (!data.must_change_password) {
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  // 🚀 ROUTING (SAFE + CONSISTENT WITH LOGIN)
  const goToDashboard = (u, roleAccess) => {
    if (roleAccess === "court") {
      navigate(`/court/${u.court_id}`);
      return;
    }

    if (roleAccess === "global") {
      navigate("/inspection-dashboard");
      return;
    }

    navigate("/login");
  };

  // 🚀 UPDATE PASSWORD (FIXED)
  const handleUpdate = async () => {
    setError("");

    if (!user?.id) return setError("❌ لا يوجد مستخدم");
    if (newPass.length < 6) return setError("❌ كلمة المرور قصيرة");
    if (newPass !== confirmPass)
      return setError("❌ كلمة المرور غير متطابقة");

    setLoading(true);

    // 1️⃣ UPDATE PASSWORD
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

    // 2️⃣ GET ROLE FROM DB (IMPORTANT)
    const { data: role } = await supabase
      .from("roles")
      .select("access_level")
      .eq("id", user.role_id)
      .single();

    const access = role?.access_level;

    // 3️⃣ CLEAN SESSION (ONLY ID)
    localStorage.setItem("user_id", user.id);

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      goToDashboard(user, access);
    }, 1000);
  };

  if (!user) {
    return <div style={styles.loading}>جاري التحميل...</div>;
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

/* STYLES */
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



















