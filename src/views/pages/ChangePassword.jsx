import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ChangePasswordFirstLogin() {
  const [user, setUser] = useState(null);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 جلب المستخدم الحقيقي من قاعدة البيانات
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser) {
      window.location.replace("/login");
      return;
    }

    const fetchUser = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", localUser.id)
        .single();

      if (!data) {
        window.location.replace("/login");
        return;
      }

      setUser(data);

      if (!data.must_change_password) {
        window.location.replace("/dashboard");
      }
    };

    fetchUser();
  }, []);

  // 🔒 منع الرجوع
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);

  const handleChange = async () => {
    if (!pass1 || !pass2) {
      setMsg("❌ الرجاء إدخال كلمة المرور");
      return;
    }

    if (pass1 !== pass2) {
      setMsg("❌ كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    setMsg("⏳ جاري تحديث كلمة المرور...");

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

    // 🔥 تحديث localStorage
    const updatedUser = {
      ...user,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setMsg("✅ تم تغيير كلمة المرور بنجاح");

    setTimeout(() => {
      window.location.replace("/dashboard");
    }, 1200);
  };

  if (!user) return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        🇹🇳 الجمهورية التونسية - وزارة العدل
      </div>

      <div style={styles.container}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Emblem_of_Tunisia.svg"
          style={styles.logo}
        />

        <h2 style={styles.title}>⚖️ العدل أساس العمران</h2>

        <div style={styles.notice}>
          مرحباً <b>{user.fullName}</b><br />
          ({user.role || "المحكمة"})<br /><br />

          يرجى إعادة تعيين كلمة المرور للدخول للنظام.
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

        <button onClick={handleChange} style={styles.button} disabled={loading}>
          {loading ? "جاري الحفظ..." : "اعتماد كلمة المرور"}
        </button>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0b2e4a, #0f4c75)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Tahoma",
    direction: "rtl",
    padding: "10px",
  },
  header: {
    width: "100%",
    background: "#b91c1c",
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "0 0 12px 12px",
  },
  container: {
    marginTop: "40px",
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },
  logo: { width: "90px", marginBottom: "10px" },
  title: {
    color: "#fbbf24",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  notice: {
    background: "rgba(255,255,255,0.15)",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "15px",
    lineHeight: "1.6",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
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
  msg: {
    marginTop: "12px",
    fontWeight: "bold",
    color: "#22c55e",
  },
};
