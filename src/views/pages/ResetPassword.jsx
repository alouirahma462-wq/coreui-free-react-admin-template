import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("reset_user");
    const flow = localStorage.getItem("reset_flow");

    if (!user || flow !== "active") {
      navigate("/login");
      return;
    }

    setUsername(user);
  }, [navigate]);

  const handleReset = async () => {
    setError("");
    setSuccess("");

    const storedOtp = localStorage.getItem("reset_otp");
    const expiry = parseInt(localStorage.getItem("reset_expiry"));

    // ⛔ expiry check
    if (Date.now() > expiry) {
      setError("⛔ انتهت صلاحية الرمز");
      return;
    }

    // ⛔ otp check
    if (otp.trim() !== String(storedOtp).trim()) {
      setError("❌ رمز غير صحيح");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error || !data) {
      setError("المستخدم غير موجود");
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: newPassword,
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq("id", data.id);

    if (updateError) {
      setError("فشل التحديث");
      return;
    }

    setSuccess("✔ تم تغيير كلمة المرور بنجاح");

    localStorage.clear();

    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>تغيير كلمة المرور</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <input
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleReset} style={styles.button}>
          تغيير
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
    direction: "rtl",
    background: "#0f172a",
    fontFamily: "Tahoma",
  },

  card: {
    width: "400px",
    padding: "25px",
    background: "white",
    borderRadius: "15px",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
  },

  error: { color: "red" },
  success: { color: "green" },
};





