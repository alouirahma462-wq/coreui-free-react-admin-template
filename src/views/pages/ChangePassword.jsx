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

  // 🔐 LOAD USER
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));

    if (!stored?.id) {
      navigate("/login");
      return;
    }

    setUser(stored);
  }, [navigate]);

  // 🚀 ROUTER
  const goToDashboard = (u) => {
    if (u?.access_level === "court") {
      navigate(`/court/${u.court_id}`);
    } else if (u?.access_level === "global") {
      navigate("/inspection-dashboard");
    } else {
      navigate("/login");
    }
  };

  // 🚀 FIXED UPDATE PASSWORD (FINAL VERSION)
  const handleUpdate = async () => {
    setError("");

    if (!user?.id) return setError("❌ لا يوجد مستخدم");
    if (newPass.length < 6) return setError("❌ كلمة المرور قصيرة");
    if (newPass !== confirmPass)
      return setError("❌ كلمة المرور غير متطابقة");

    setLoading(true);

    // 1️⃣ UPDATE DB
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

    // 2️⃣ 🔥 REFETCH USER FROM DB (IMPORTANT FIX)
    const { data: freshUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError || !freshUser) {
      setLoading(false);
      return setError("❌ فشل إعادة تحميل البيانات");
    }

    // 3️⃣ BUILD CLEAN SESSION FROM DB ONLY
    const sessionUser = {
      id: freshUser.id,
      username: freshUser.username,
      fullName: freshUser.fullName,
      court_id: freshUser.court_id,
      role_id: freshUser.role_id,
      access_level: freshUser.access_level,
      must_change_password: freshUser.must_change_password,
    };

    // 4️⃣ UPDATE LOCALSTORAGE CLEANLY
    localStorage.setItem("user", JSON.stringify(sessionUser));

    setLoading(false);
    setSuccess(true);

    // 5️⃣ REDIRECT
    setTimeout(() => {
      goToDashboard(sessionUser);
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



















