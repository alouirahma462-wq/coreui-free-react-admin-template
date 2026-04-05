import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    localStorage.removeItem("reset_user");
    localStorage.removeItem("reset_otp");
  }, []);

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

    await supabase
      .from("users")
      .update({
        reset_token: newOtp,
      })
      .eq("id", user.id);

    localStorage.setItem("reset_user", user.username);
    localStorage.setItem("reset_otp", newOtp);

    setOtp(newOtp);
    setLoading(false);
  };

  const goNext = () => navigate("/reset-password");

  return (
    <>
      {/* ===== STYLE ===== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Tahoma, sans-serif;
        }

        .page {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          direction: rtl;
          overflow: hidden;
        }

        /* 🏛️ Court Background */
        .page::before {
          content: "";
          position: absolute;
          inset: 0;

          background:
            linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.95)),
            url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=80");

          background-size: cover;
          background-position: center;

          z-index: 0;
        }

        /* soft gold light */
        .page::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(212,175,55,0.25), transparent 60%);
          z-index: 1;
        }

        .card {
          position: relative;
          z-index: 10;

          width: 420px;
          padding: 30px;

          border-radius: 18px;
          background: rgba(255,255,255,0.97);

          box-shadow: 0 40px 120px rgba(0,0,0,0.15);
          border: 1px solid rgba(212,175,55,0.4);

          text-align: center;
        }

        h2 {
          margin-bottom: 5px;
          color: #1e3a8a;
        }

        p {
          margin-top: 0;
          font-size: 13px;
          color: #555;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-top: 15px;

          border-radius: 10px;
          border: 1px solid #ccc;

          outline: none;
          font-size: 14px;

          position: relative;
          z-index: 20; /* 🔥 مهم للكتابة */
        }

        button {
          width: 100%;
          padding: 12px;
          margin-top: 12px;

          border: none;
          border-radius: 10px;

          background: linear-gradient(135deg,#1e3a8a,#2563eb);
          color: white;

          cursor: pointer;
          font-weight: bold;

          position: relative;
          z-index: 20;
        }

        button:hover {
          opacity: 0.9;
        }

        .error {
          color: red;
          margin-top: 10px;
          font-weight: bold;
        }

        .otp {
          margin-top: 15px;
          padding: 10px;

          background: #e0f2fe;
          border-radius: 10px;

          font-size: 24px;
          letter-spacing: 5px;
          font-weight: bold;
          color: #1e3a8a;
        }

        .next-btn {
          background: #10b981;
        }
      `}</style>

      {/* ===== PAGE ===== */}
      <div className="page">
        <div className="card">

          <h2>⚖️ الجمهورية التونسية</h2>
          <p>نظام استرجاع كلمة المرور - المحكمة</p>

          {error && <div className="error">{error}</div>}

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
          />

          <button onClick={handleSubmit}>
            {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>

          {otp && (
            <>
              <div className="otp">{otp}</div>

              <button className="next-btn" onClick={goNext}>
                الانتقال لإدخال الرمز
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}










