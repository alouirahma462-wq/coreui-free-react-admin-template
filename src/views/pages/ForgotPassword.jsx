import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // 🔊 صوت دخول
  useEffect(() => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
    );
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      {/* 🇹🇳 علم تونس */}
      <div style={styles.flag}></div>

      <div style={styles.overlay}></div>

      <div style={styles.card}>
        {/* 🔥 الهيدر الحكومي */}
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
          أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور
        </p>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          style={styles.button}
          onClick={() => alert("تم إرسال رابط إعادة التعيين")}
        >
          إرسال الرابط
        </button>

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
      "linear-gradient(rgba(255,255,255,0.9), rgba(230,240,255,0.9))",
  },

  /* 🇹🇳 علم متحرك */
  flag: {
    position: "absolute",
    top: 20,
    right: 20,
    width: "80px",
    height: "50px",
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg')",
    backgroundSize: "cover",
    borderRadius: "6px",
    animation: "wave 3s infinite ease-in-out",
    zIndex: 2,
  },

  card: {
    position: "relative",
    width: "380px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
    zIndex: 3,
  },

  /* 🔥 الهيدر مع animation */
  govHeader: {
    marginBottom: "15px",
    animation: "dropFancy 1.2s ease forwards",
  },

  govTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#b91c1c",
    fontWeight: "bold",
    textShadow: "0 0 8px rgba(212,175,55,0.6)",
  },

  govMotto: {
    margin: 0,
    fontSize: "13px",
    color: "#1e3a8a",
    marginTop: "5px",
    fontStyle: "italic",
    textShadow: "0 0 6px rgba(212,175,55,0.5)",
  },

  mainTitle: {
    marginTop: "15px",
    color: "#1e3a8a",
  },

  desc: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    marginTop: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  back: {
    marginTop: "12px",
    background: "none",
    border: "none",
    color: "#b91c1c",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

/* 🔥 Animations */
const styleSheet = document.styleSheets[0];

styleSheet.insertRule(`
@keyframes wave {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
  100% { transform: rotate(0deg); }
}
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes dropFancy {
  0% {
    transform: translateY(-80px);
    opacity: 0;
    filter: blur(8px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
    filter: blur(0);
  }
}
`, styleSheet.cssRules.length);
