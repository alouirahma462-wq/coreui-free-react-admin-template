import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showUI, setShowUI] = useState(false);
  const [startGate, setStartGate] = useState(false);

  const navigate = useNavigate();

  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const clickRef = useRef(null);

  const startMedia = async () => {
    try {
      if (videoRef.current) {
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      if (voiceRef.current) {
        voiceRef.current.currentTime = 0;
        await voiceRef.current.play();
      }
    } catch (err) {
      console.log("Autoplay blocked:", err);
    }
  };

  useEffect(() => {
    const unlockAudio = () => {
      startMedia();
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  // 🚪 فتح البوابة
  const openGate = () => {
    setStartGate(true);

    setTimeout(() => {
      setShowUI(true);
    }, 1200);
  };

  const handleClick = () => {
    if (clickRef.current) {
      clickRef.current.play();
    }

    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  return (
    <div style={styles.container}>

      {/* 🎬 VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={styles.video}
        onEnded={() => setShowUI(true)}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* 🔊 VOICE */}
      <audio ref={voiceRef}>
        <source src="/voice.mp3" type="audio/mpeg" />
      </audio>

      {/* 🔊 CLICK */}
      <audio ref={clickRef}>
        <source src="/click.mp3" type="audio/mpeg" />
      </audio>

      {/* 🏛️ GATE SCREEN */}
      {!startGate && (
        <div style={styles.gate}>
          <div style={styles.gateCard}>

            <h1 style={styles.title}>
              🏛️ منظومة النيابة العمومية
            </h1>

            <p style={styles.sub}>👋 مرحبا بك</p>

            <p style={styles.click}>👉 اضغط هنا للدخول</p>

            {/* ✨ finger */}
            <div style={styles.finger}>👇</div>

            <button onClick={openGate} style={styles.gateBtn}>
              دخول المحكمة
            </button>

          </div>
        </div>
      )}

      {/* 🌫 MAIN UI */}
      {showUI && startGate && (
        <div style={styles.overlay}>

          <div style={styles.card}>
            <p style={styles.text}>
              نظام محمي ومراقب. الدخول مصرح للموظفين المخولين فقط
            </p>

            <div style={styles.pointer}>👉</div>

            <button onClick={handleClick} style={styles.button}>
              تسجيل الدخول
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

const styles = {

  container: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    background: "black",
  },

  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.55)",
  },

  card: {
    textAlign: "center",
    padding: "30px",
    color: "white",
  },

  text: {
    fontSize: "18px",
    marginBottom: "20px",
  },

  pointer: {
    fontSize: "40px",
    marginBottom: "10px",
    animation: "movePointer 1.2s infinite",
  },

  button: {
    padding: "16px 55px",
    fontSize: "20px",
    color: "white",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: "12px",
    cursor: "pointer",
  },

  // 🏛️ Gate
  gate: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  gateCard: {
    textAlign: "center",
    color: "white",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  sub: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  click: {
    fontSize: "16px",
    marginBottom: "10px",
    opacity: 0.8,
  },

  finger: {
    fontSize: "50px",
    color: "#facc15",
    animation: "fingerMove 1s infinite",
    marginBottom: "10px",
  },

  gateBtn: {
    padding: "14px 40px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "1px solid gold",
    background: "rgba(255,215,0,0.12)",
    color: "gold",
    cursor: "pointer",
  },
};


