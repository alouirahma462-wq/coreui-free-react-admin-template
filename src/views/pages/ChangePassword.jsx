import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ChangePasswordFirstLogin() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 منع الرجوع
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);

  // 🛡️ حماية الصفحة
  useEffect(() => {
    if (!user || !user.id) {
      window.location.replace("/login");
      return;
    }

    if (!user.must_change_password) {
      window.location.replace("/dashboard");
    }
  }, [user]);

  // 🔐 Change password
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

    const updatedUser = {
      ...user,
      must_change_password: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    setMsg("✅ تم تغيير كلمة المرور بنجاح");

    setTimeout(() => {
      window.location.replace("/dashboard");
    }, 1000);
  };

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

        <h2>⚖️ العدل أساس العمران</h2>

        <div style={styles.notice}>
          مرحباً <b>{user?.fullName}</b><br />
          يرجى تغيير كلمة المرور للدخول إلى النظام
        </div>

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleChange} style={styles.button}>
          {loading ? "جاري الحفظ..." : "اعتماد كلمة المرور"}
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}
