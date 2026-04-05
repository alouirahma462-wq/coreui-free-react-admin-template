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
      {/* ================= CSS INSIDE FILE ================= */}
      <style>{`
        .forgot-page {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          direction: rtl;
          font-family: Tahoma, Arial;
          position: relative;
          overflow: hidden;

          background: linear-gradient(
              rgba(255,255,255,0.75),
              rgba(240,240,240,0.85)
            ),
            url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1800&q=80");

          background-size: cover;
          background-position: center;
        }

        .crest {
          position: absolute;
          top: 20px;
          color: #1e3a8a;
          font-weight: bold;
          font-size: 18px;
        }

        .forgot-card {
          width: 460px;
          padding: 35px;
          border-radius: 18px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px);
          text-align: center;
          border: 1px solid rgba(30,58,138,0.2);
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
          animation: fadeSlide 0.7s ease;
        }

        .title {
          color: #1e3a8a;
          font-size: 22px;
          font-weight: bold;
        }

        .desc {
          font-size: 13px;
          color: #444;
          margin-bottom: 15px;
        }

        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          margin-bottom: 12px;
          outline: none;
        }

        .input:focus {
          border-color: #1e3a8a;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: linear-gradient(135deg,#1e3a8a,#2563eb);
          color: white;
          border: none;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-success {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          background: #10b981;
          color: white;
          border: none;
          font-weight: bold;
        }

        .otp-box {
          margin-top: 15px;
          padding: 15px;
          border-radius: 12px;
          background: #e0f2fe;
          border: 1px solid #93c5fd;
        }

        .otp {
          font-size: 28px;
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

        .error {
          color: red;
          margin-bottom: 10px;
          font-weight: bold;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ================= UI ================= */}
      <div className="forgot-page">
        <div className="crest">🇹🇳 الجمهورية التونسية</div>

        <div className="forgot-card">

          <h2 className="title">🔐 نسيت كلمة المرور</h2>
          <p className="desc">أدخل اسم المستخدم لإرسال رمز التحقق</p>

          {error && <div className="error">{error}</div>}

          <input
            className="input"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className="btn" onClick={handleSubmit}>
            {loading ? "جاري الإرسال..." : "إرسال الكود"}
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
            <button
              className="btn-success"
              onClick={() => navigate("/reset-password")}
            >
              الانتقال لإدخال الرمز
            </button>
          )}

        </div>
      </div>
    </>
  );
}










