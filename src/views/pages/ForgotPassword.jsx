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

    try {
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

      await supabase
        .from("users")
        .update({
          reset_token: newOtp,
          reset_token_expiry: new Date(expiryTime).toISOString(),
          reset_attempts: 0,
        })
        .eq("id", user.id);

      localStorage.setItem("reset_user", user.username);
      localStorage.setItem("reset_otp", newOtp);
      localStorage.setItem("reset_flow", "active");
      localStorage.setItem("reset_expiry", String(expiryTime));

      setOtp(newOtp);
      startTimer(expiryTime);

      setLoading(false);
    } catch (err) {
      setError("❌ حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  const goToReset = () => navigate("/reset-password");
  const resendOtp = () => handleSubmit();

  return (
    <>
      {/* 💣 FORCE STYLE (يشتغل غصب عن CoreUI) */}
      <style>{`
        body {
          margin: 0 !important;
          overflow: hidden !important;
        }

        .forgot-force-page {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 999999 !important;

          display: flex;
          justify-content: center;
          align-items: center;
          direction: rtl;
          font-family: Tahoma;

          background-image:
            linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)),
            url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80");

          background-size: cover;
          background-position: center;
        }

        .forgot-light {
          position: absolute;
          width: 250%;
          height: 250%;
          background: radial-gradient(circle, rgba(59,130,246,0.25), transparent 60%);
          animation: moveLight 8s infinite linear;
        }

        .forgot-crest {
          position: absolute;
          top: 25px;
          color: white;
          font-size: 20px;
          font-weight: bold;
          text-shadow: 0 0 15px rgba(255,255,255,0.6);
        }

        .forgot-card {
          width: 460px;
          padding: 35px;
          border-radius: 22px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          text-align: center;
          box-shadow: 0 40px 120px rgba(0,0,0,0.85);
          animation: fadeSlide 0.8s ease;
          z-index: 2;
        }

        .forgot-input {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: 1px solid #ccc;
          margin-bottom: 12px;
        }

        .forgot-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(135deg,#1e3a8a,#2563eb);
          color: white;
          border: none;
          font-weight: bold;
          cursor: pointer;
        }

        .forgot-otp-box {
          margin-top: 18px;
          padding: 18px;
          border-radius: 14px;
          background: #e0f2fe;
        }

        .forgot-otp {
          font-size: 32px;
          letter-spacing: 8px;
          font-weight: bold;
        }

        .forgot-timer {
          color: #1e3a8a;
          font-weight: bold;
        }

        .forgot-expired {
          color: red;
          font-weight: bold;
        }

        .forgot-success-btn {
          margin-top: 12px;
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: #10b981;
          color: white;
          border: none;
          font-weight: bold;
        }

        .forgot-error {
          color: red;
          margin-bottom: 10px;
          font-weight: bold;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes moveLight {
          0% { transform: translate(-30%, -30%); }
          50% { transform: translate(30%, 30%); }
          100% { transform: translate(-30%, -30%); }
        }
      `}</style>

      <div className="forgot-force-page">
        <div className="forgot-light"></div>

        <div className="forgot-crest">🇹🇳 الجمهورية التونسية</div>

        <div className="forgot-card">
          <h2>🔐 نسيت كلمة المرور</h2>

          {error && <div className="forgot-error">{error}</div>}

          <input
            className="forgot-input"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className="forgot-btn" onClick={handleSubmit}>
            {loading ? "جاري الإرسال..." : "إرسال الكود"}
          </button>

          {otp && (
            <div className="forgot-otp-box">
              <div className="forgot-otp">{otp}</div>

              {active ? (
                <p className="forgot-timer">⏱ {timer} ثانية</p>
              ) : (
                <p className="forgot-expired">⛔ انتهت</p>
              )}
            </div>
          )}

          {otp && active && (
            <button className="forgot-success-btn" onClick={goToReset}>
              الانتقال لإدخال الرمز
            </button>
          )}

          {!active && otp && (
            <button className="forgot-btn" onClick={resendOtp}>
              🔁 إعادة إرسال
            </button>
          )}
        </div>
      </div>
    </>
  );
}








