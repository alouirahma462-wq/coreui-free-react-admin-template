import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [courtName, setCourtName] = useState("");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const [strength, setStrength] = useState("");
  const [tips, setTips] = useState([]);

  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // 🔥 FIX ONLY HERE
  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      setUser(data);

      if (data?.court_id) {
        const { data: court } = await supabase
          .from("courts")
          .select("name")
          .eq("id", data.court_id)
          .maybeSingle();

        if (court) setCourtName(court.name);
      }
    };

    fetchUser();
  }, []);

  // 🔥 password strength
  useEffect(() => {
    let s = 0;
    let newTips = [];

    if (newPass.length >= 8) s++;
    else newTips.push("اجعل كلمة المرور 8 أحرف على الأقل");

    if (/[A-Z]/.test(newPass)) s++;
    else newTips.push("أضف حروف كبيرة");

    if (/[0-9]/.test(newPass)) s++;
    else newTips.push("أضف أرقام");

    if (/[^A-Za-z0-9]/.test(newPass)) s++;
    else newTips.push("أضف رموز مثل !@#");

    setScore(s);

    if (s <= 1) setStrength("ضعيفة");
    else if (s === 2 || s === 3) setStrength("متوسطة");
    else setStrength("قوية");

    setTips(newTips);
  }, [newPass]);

  const handleUpdate = async () => {
    if (newPass !== confirmPass) return;

    setLoading(true);

    const userId = localStorage.getItem("user_id");

    const { error } = await supabase
      .from("users")
      .update({
        password: newPass,
        must_change_password: false,
      })
      .eq("id", userId);

    setLoading(false);

    if (!error) {
      localStorage.removeItem("user_id");

      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/login", { replace: true });
      }, 2000);
    }
  };

  if (!user) return <div style={{ color: "white" }}>Loading...</div>;

  const welcomeMessage =
    user.court_id === null
      ? `مرحبا ${user.fullName} - التفقدية العامة - إشراف مركزي`
      : `مرحبا ${user.fullName} - ${courtName}`;

  const getBarColor = () => {
    if (score <= 1) return "#ef4444";
    if (score <= 3) return "#fbbf24";
    return "#22c55e";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h3 style={styles.welcome}>{welcomeMessage}</h3>

        <h2>🔐 تغيير كلمة المرور</h2>

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

        {newPass && (
          <div style={styles.barContainer}>
            <div
              style={{
                ...styles.bar,
                width: `${(score / 4) * 100}%`,
                background: getBarColor(),
              }}
            />
          </div>
        )}

        {newPass && (
          <div style={styles.strengthBox}>
            قوة كلمة المرور:{" "}
            <span style={{ color: getBarColor() }}>{strength}</span>
          </div>
        )}

        {tips.length > 0 && (
          <ul style={styles.tips}>
            {tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        )}

        <button onClick={handleUpdate} style={styles.btn}>
          {loading ? "جاري..." : "تحديث"}
        </button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.clap}>👏</div>
            <h3>تم التحديث بنجاح</h3>
            <p>سيتم تحويلك لتسجيل الدخول</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  card: {
    width: "380px",
    padding: "25px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  welcome: {
    marginBottom: "10px",
    color: "#38bdf8",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  barContainer: {
    width: "100%",
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    marginTop: "10px",
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    transition: "0.3s",
  },

  strengthBox: {
    marginTop: "10px",
    fontSize: "14px",
  },

  tips: {
    textAlign: "right",
    fontSize: "12px",
    marginTop: "5px",
    opacity: 0.8,
  },

  btn: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
  },

  clap: {
    fontSize: "40px",
    marginBottom: "10px",
  },
};






















