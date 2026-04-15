import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("remember_user");

    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (!username || !password) {
        setMessage("❌ أدخل البيانات");
        setLoading(false);
        return;
      }

      // 1️⃣ جلب المستخدم فقط (بدون join)
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username.trim())
        .single();

      if (error) {
        console.log(error);
        setMessage("❌ خطأ في النظام");
        setLoading(false);
        return;
      }

      if (!user) {
        setMessage("❌ بيانات غير صحيحة");
        setLoading(false);
        return;
      }

      if (user.password !== password.trim()) {
        setMessage("❌ كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      if (!user.isActive) {
        setMessage("❌ الحساب غير مفعل");
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("remember_user", username);
      } else {
        localStorage.removeItem("remember_user");
      }

      // 2️⃣ جلب المحكمة بشكل آمن (منفصل)
      let courtName = "غير محدد";

      if (user.court_id) {
        const { data: court } = await supabase
          .from("courts")
          .select("name")
          .eq("id", user.court_id)
          .maybeSingle();

        courtName = court?.name || "غير محدد";
      }

      // 3️⃣ التخزين الصحيح
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          court_name: courtName
        })
      );

      localStorage.setItem("user_id", String(user.id));

      window.dispatchEvent(new Event("storage"));

      setLoading(false);

      const mustChange =
        user?.must_change_password === true ||
        user?.must_change_password === "true" ||
        String(user?.must_change_password) === "true" ||
        user?.must_change_password === 1 ||
        String(user?.must_change_password) === "1";

      if (mustChange) {
        navigate("/change-password", { replace: true });
        return;
      }

      if (user.court_id === null) {
        navigate("/inspection-dashboard", { replace: true });
        return;
      }

      navigate(`/court/${user.court_id}`, { replace: true });

    } catch (err) {
      console.log(err);
      setMessage("❌ خطأ في النظام");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <video autoPlay loop muted playsInline style={styles.video}>
        <source src="/justice-bg.mp4" type="video/mp4" />
      </video>

      <div style={styles.overlay}></div>

      <div style={styles.topBar}>
        <div style={styles.marqueeTrack}>
          <div style={styles.marqueeText}>
            🇹🇳 وزارة العدل - الجمهورية التونسية - منظومة النيابة العمومية
          </div>
          <div style={styles.marqueeText}>
            🇹🇳 وزارة العدل - الجمهورية التونسية - منظومة النيابة العمومية
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>🏛️ منظومة النيابة العمومية</h2>
        <p style={styles.subTitle}>تسجيل الدخول إلى النظام القضائي</p>

        <input
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <div style={styles.row}>
          <label style={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            تذكرني
          </label>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={styles.forgotBtn}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <button onClick={handleLogin} style={styles.btn}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={styles.error}>{message}</p>}
      </div>

      <style>{`
        @keyframes move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}

/* 🎨 STYLES (UNCHANGED) */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    direction: "rtl",
    position: "relative",
    overflow: "hidden",
  },

  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -3,
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.55)",
    zIndex: -2,
  },

  topBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: "#b91c1c",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    zIndex: 99999,
  },

  marqueeTrack: {
    display: "flex",
    width: "max-content",
    animation: "move 15s linear infinite",
  },

  marqueeText: {
    whiteSpace: "nowrap",
    flexShrink: 0,
    paddingRight: "120px",
    fontWeight: "bold",
    color: "#fff",
    fontSize: "14px",
  },

  card: {
    width: "480px",
    padding: "35px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
    textAlign: "center",
    zIndex: 2,
  },

  title: { fontSize: "22px", fontWeight: "bold" },
  subTitle: { fontSize: "13px", opacity: 0.8, marginBottom: "20px" },

  input: {
    width: "100%",
    padding: "14px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "13px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  forgotBtn: {
    background: "transparent",
    border: "none",
    color: "#93c5fd",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "13px",
  },

  btn: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    marginTop: "10px",
    color: "#fca5a5",
    fontSize: "13px",
  },
};




























































