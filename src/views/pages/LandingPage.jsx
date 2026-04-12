import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showUI, setShowUI] = useState(false);
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const clickRef = useRef(null);

  useEffect(() => {
    const start = async () => {
      try {
        // 🎬 تشغيل الفيديو (بدون صوت)
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
        }

        // 🔊 تشغيل الصوت (نفس صوت الفيديو)
        if (voiceRef.current) {
          voiceRef.current.currentTime = 0;
          await voiceRef.current.play();
        }

      } catch (err) {
        console.log("Autoplay blocked");
      }
    };

    start();
  }, []);

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

      {/* 🔊 VOICE (نفس صوت الفيديو) */}
      <audio ref={voiceRef}>
        <source src="/voice.mp3" type="audio/mpeg" />
      </audio>

      {/* 🔊 CLICK SOUND */}
      <audio ref={clickRef}>
        <source src="/click.mp3" type="audio/mpeg" />
      </audio>

      {/* 🌫 UI */}
      {showUI && (
        <div style={styles.overlay}>

          <div style={styles.card}>
            <p style={styles.text}>
              نظام محمي ومراقب. الدخول مصرح للموظفين المخولين فقط
            </p>

            <div style={styles.pointer}>👉</div>

            <button style={styles.button} onClick={handleClick}>
              تسجيل الدخول
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

/* 🎨 STYLES */
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
    top: 0,
    left: 0,
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
  },

  text: {
    color: "white",
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
};

