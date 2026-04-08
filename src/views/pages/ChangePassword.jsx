import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

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
    };

    fetchUser();
  }, []);

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
      navigate("/login", { replace: true });
    }
  };

  if (!user) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
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

        <button onClick={handleUpdate} style={styles.btn}>
          {loading ? "جاري..." : "تحديث"}
        </button>
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
    background: "#0f172a",
    color: "white",
  },
  card: {
    width: "350px",
    padding: "20px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
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
};





















