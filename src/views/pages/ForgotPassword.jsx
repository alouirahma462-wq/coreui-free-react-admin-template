import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
    );
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, []);

  const handleSubmit = () => {
    if (!email) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div style={styles.page}>
      {/* 🇹🇳 العلم */}
      <div style={styles.flag}></div>

      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <div style={styles.govHeader}>
          <h2 style={styles.govTitle}>
            الجمهورية التونسية - وزارة العدل
          </h2>
          <p style={styles.govMotto}>
            "العدل أساس العمران"
          </p>
        </div>

        <h3 style={styles.mainTitle}>نسيت كلمة المرور</h3>

        <p style={styles.desc}>
          أدخل بريدك الإلكتروني لاستعادة كلمة المرور
        </p>

        {success ? (
          <div style={styles.success}>
            ✔ تم إرسال رابط إعادة التعيين إلى بريدك
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال الرابط"}
            </button>
          </>
        )}

        <button onClick={() => navigate("/login")} style={styles.back}>
          العودة لتسجيل الدخول
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
    fontFamily: "Tahoma",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(rgba(255,255,255,0.92), rgba(220,235,255,0.92))",
  },

  /* 🇹🇳 علم تونس واقعي */
  flag: {
    position: "absolute",
    top: 20,
    right: 20,
    width: "90px",
    height: "55px",
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg')",
    backgroundSize: "cover",
    borderRadius: "6px",
    zIndex: 2,
    animation: "wave 2s infinite ease-in-out",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },

  card: {
    position: "relative",
    width: "400px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(25px)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
    textAlign: "center",
    zIndex: 3,
    animation: "dropFancy 1s ease",
  },

  govHeader: {
    marginBottom: "15px",
  },

  govTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#b91c1c",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(212,175,55,0.5)",
  },

  govMotto: {
    margin: 0,
    fontSize: "13px",
    color: "#1e3a8a",
    fontStyle: "italic",
    marginTop: "4px",
    textShadow: "0 0 6px rgba(212,175,55,0.4)",
  },

  mainTitle: {
    color: "#1e3a8a",
    marginTop: "10px",
  },

  desc: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
  },

  back: {
    marginTop: "12px",
    background: "none",
    border: "none",
    color: "#b91c1c",
    cursor: "pointer",
    textDecoration: "underline",
  },

  success: {
    padding: "15px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

/* 🔥 Animations آمنة */
if (typeof document !== "undefined") {
  const style = document.createElement("style");

  style.innerHTML = `
    @keyframes wave {
      0% { transform: rotate(0deg) translateY(0px); }
      50% { transform: rotate(2deg) translateY(-2px); }
      100% { transform: rotate(0deg) translateY(0px); }
    }

    @keyframes dropFancy {
      0% {
        transform: translateY(-60px);
        opacity: 0;
        filter: blur(10px);
      }
      100% {
        transform: translateY(0);
        opacity: 1;
        filter: blur(0);
      }
    }
  `;

  document.head.appendChild(style);
}
