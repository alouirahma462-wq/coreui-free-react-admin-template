import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("❌ الرجاء إدخال اسم المستخدم وكلمة المرور");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        username,
        fullName,
        isActive,
        must_change_password,
        court_id,
        courts (id, name),
        roles (id, role_key, role_name, access_level)
      `)
      .eq("username", username.trim())
      .eq("password", password.trim())
      .maybeSingle();

    setLoading(false);

    // ❌ login failed
    if (error || !data) {
      setMessage("❌ بيانات غير صحيحة");
      return;
    }

    // ❌ inactive user
    if (!data.isActive) {
      setMessage("❌ الحساب غير مفعل");
      return;
    }

    // ================================
    // 🔥 ROOT FIX: roles normalization
    // ================================
    const role =
      Array.isArray(data.roles) ? data.roles[0] : data.roles || null;

    if (!role?.role_key || !role?.access_level) {
      setMessage("❌ الحساب بدون صلاحيات أو roles غير مرتبطة");
      return;
    }

    // ================================
    // 🧠 SESSION BUILD (SAFE)
    // ================================
    const userSession = {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      court_id: data.court_id,
      court_name: data.courts?.name || null,

      role_key: role.role_key,
      role_name: role.role_name,
      access_level: role.access_level,

      must_change_password: data.must_change_password,
    };

    localStorage.setItem("user", JSON.stringify(userSession));

    setMessage(
      `👋 مرحبا ${data.fullName} - ${
        data.courts?.name || "التفقدية العامة"
      }`
    );

    setTimeout(() => {
      // 🔐 FIRST LOGIN
      if (data.must_change_password) {
        navigate("/change-password");
        return;
      }

      // 🏛️ COURT USERS
      if (role.access_level === "court") {
        navigate(`/court/${data.court_id}`);
        return;
      }

      // 🔎 GLOBAL INSPECTION
      if (role.access_level === "global") {
        navigate("/inspection-dashboard");
        return;
      }

      setMessage("❌ لا توجد صلاحيات لهذا الحساب");
    }, 500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.marquee}>
          🇹🇳 وزارة العدل الجمهورية التونسية - منظومة النيابة العمومية - 🇹🇳
        </div>
      </div>

      <div style={styles.bgOverlay}></div>

      <div style={styles.card}>
        <h2>🏛️ منظومة النيابة العمومية</h2>

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

        <button onClick={handleLogin} style={styles.button}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    direction: "rtl",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    position: "relative",
    overflow: "hidden",
    color: "white",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#b91c1c",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    zIndex: 2,
  },

  marquee: {
    display: "inline-block",
    paddingLeft: "100%",
    animation: "marquee 12s linear infinite",
    fontWeight: "bold",
  },

  bgOverlay: {
    position: "absolute",
    width: "450px",
    height: "450px",
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/ce/Coat_of_arms_of_Tunisia.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    opacity: 0.08,
    zIndex: 0,
  },

  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.15)",
    textAlign: "center",
    zIndex: 2,
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  message: {
    marginTop: "10px",
    color: "#fca5a5",
    fontWeight: "bold",
  },
};






































