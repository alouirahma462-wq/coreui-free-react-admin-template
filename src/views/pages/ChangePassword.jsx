import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [user, setUser] = useState(null);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const navigate = useNavigate();

  // =========================
  // LOAD USER (SAFE + NO LOOP)
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

        // 🔥 إذا ما يحتاج تغيير كلمة مرور → اخرج
        if (!data.must_change_password) {
          navigate("/dashboard", { replace: true });
          return;
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    loadUser();
  }, [navigate]);

  // =========================
  // BLOCK BACK BUTTON
  // =========================
  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);

    return () => window.removeEventListener("popstate", blockBack);
  }, []);

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
      setMsg("❌ خطأ في التحديث");
      return;
    }

    // 🔥 تحديث التخزين المحلي
    const updatedUser = {
      ...user,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    setMsg("✅ تم تغيير كلمة المرور");

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1000);
  };

  // =========================
  // LOADING SAFE SCREEN
  // =========================
  if (checking) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        ⏳ جاري التحقق من المستخدم...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.container}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
          style={styles.logo}
          alt="logo"
        />

        <h2 style={styles.title}>⚖️ العدل أساس العمران</h2>

        <div style={styles.notice}>
          مرحباً <b>{user?.fullName}</b>
          <br />
          ({user?.role || "المحكمة"})
          <br />
          يرجى تغيير كلمة المرور للمتابعة
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
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "جاري الحفظ..." : "اعتماد كلمة المرور"}
        </button>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}


