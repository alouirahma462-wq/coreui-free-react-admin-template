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

  // =========================
  // LOAD USER SAFE (NO LOOP)
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (!stored) {
          navigate("/login", { replace: true });
          return;
        }

        const localUser = JSON.parse(stored);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", localUser.id)
          .single();

        if (error || !data) {
          navigate("/login", { replace: true });
          return;
        }

        // إذا ما يحتاج تغيير كلمة المرور → روح مباشرة
        if (!data.must_change_password) {
          navigate("/dashboard", { replace: true });
          return;
        }

        setUser(data);
      } catch (err) {
        console.log(err);
        navigate("/login", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    loadUser();
  }, [navigate]);

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChange = async () => {
    setMsg("");

    if (!pass1 || !pass2) {
      setMsg("❌ الرجاء إدخال كلمة المرور");
      return;
    }

    if (pass1 !== pass2) {
      setMsg("❌ كلمات المرور غير متطابقة");
      return;
    }

    if (pass1.length < 6) {
      setMsg("❌ كلمة المرور ضعيفة (6 أحرف على الأقل)");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        password: pass1,
        must_change_password: false,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setMsg("❌ حدث خطأ أثناء التحديث");
      return;
    }

    // =========================
    // UPDATE LOCAL STORAGE
    // =========================
    const updatedUser = {
      ...user,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    setMsg("✅ تم تغيير كلمة المرور");

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 800);
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (checking) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        ⏳ جاري التحقق...
      </div>
    );
  }

  if (!user) return null;

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🔐 تغيير كلمة المرور</h2>

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
          {loading ? "جاري الحفظ..." : "تأكيد"}
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#061a33",
  },

  card: {
    width: "400px",
    padding: "20px",
    borderRadius: "12px",
    background: "white",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};



