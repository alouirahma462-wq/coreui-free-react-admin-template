import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.removeItem("reset_user");
    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_flow");
    localStorage.removeItem("reset_expiry");
  }, []);

  const startTimer = (expiryTime) => {
    clearInterval(intervalRef.current);

    const update = () => {
      const diff = Math.floor((expiryTime - Date.now()) / 1000);

      if (diff <= 0) {
        clearInterval(intervalRef.current);
        setTimer(0);
        setActive(false);
        setError("⛔ انتهت صلاحية رمز التحقق");
        return;
      }

      setTimer(diff);
      setActive(true);
    };

    update();
    intervalRef.current = setInterval(update, 1000);
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("يرجى إدخال اسم المستخدم");
      return;
    }

    setLoading(true);
    setError("");

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("username", username.trim())
      .maybeSingle();

    if (!user) {
      setError("❌ المستخدم غير موجود");
      setLoading(false);
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = Date.now() + 60 * 1000;

    await supabase.from("users").update({
      reset_token: newOtp,
      reset_token_expiry: new Date(expiryTime).toISOString(),
      reset_attempts: 0,
    }).eq("id", user.id);

    localStorage.setItem("reset_user", user.username);
    localStorage.setItem("reset_otp", newOtp);
    localStorage.setItem("reset_flow", "active");
    localStorage.setItem("reset_expiry", String(expiryTime));

    setOtp(newOtp);
    startTimer(expiryTime);
    setLoading(false);
  };

  return (
    <>
      {/* 💎 STYLE SYSTEM */}
      <style>{`
        body {
          margin: 0;
          font-family: "Tahoma", sans-serif;
        }

        .court-page {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          direction: rtl;
          overflow: hidden;
        }

        /* 🏛️ Tunisian Court Background */
        .court-page::before {
          content: "";
          position: absolute;
          inset: 0;

          background-image:
            linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.92)),
            url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=80");

          background-size: cover;
          background-position: center;
          filter: saturate(1.1) contrast(1.05);
          transform: scale(1.05);
        }

        /* soft golden light */
        .court-page::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(212,175,55,0.25), transparent 60%);
        }

        .court-card {
          position: relative;
          width: 460px;
          padding: 35px;
          border-radius: 20px;

          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(18px);

          box-shadow: 0 40px 120px rgba(0,0,0,0.25);
          border: 1px solid rgba(212,175,55,0.4);

          text-align: center;
          animation: fadeIn 0.7s ease;
        }

        .court-title {
          font-size: 22px;
          font-weight: bold;
          color: #1e3a8a;
        }

        .court-sub {
          font-size: 13px;
          color: #555;
          margin-bottom: 15px;
        }

        .court-input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          margin-bottom: 12px;
          outline: none;
        }

        .court-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;

          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: white;
          font-weight: bold;
        }

        .court-error {
          color: #dc2626;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .otp-box {
          margin-top: 15px;
          padding: 15px;
          border-radius: 12px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
        }

        .otp {
          font-size: 30px;
          letter-spacing: 6px;
          font-weight: bold;
          color: #1e3a8a;
        }

        .timer {
          color: #1e3a8a;
          font-weight: bold;
        }

        .expired {
          color: red;
          font-weight: bold;
        }

        .success-btn {
          margin-top: 10px;
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: #10b981;
          color: white;
          font-weight: bold;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="court-page">
        <div className="court-card">

          <div className="court-title">⚖️ الجمهورية التونسية</div>
          <div className="court-sub">المحكمة / نظام استرجاع كلمة المرور</div>

          <h3>🔐 نسيت كلمة المرور</h3>

          {error && <div className="court-error">{error}</div>}

          <input
            className="court-input"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className="court-btn" onClick={handleSubmit}>
            {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>

          {otp && (
            <div className="otp-box">
              <div className="otp">{otp}</div>

              {active ? (
                <p className="timer">⏱ {timer} ثانية</p>
              ) : (
                <p className="expired">⛔ انتهت الصلاحية</p>
              )}
            </div>
          )}

          {otp && active && (
            <button className="success-btn" onClick={() => navigate("/reset-password")}>
              الانتقال لإدخال الرمز
            </button>
          )}

        </div>
      </div>
    </>
  );
}









