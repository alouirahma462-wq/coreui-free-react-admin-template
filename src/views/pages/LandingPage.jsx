import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showUI, setShowUI] = useState(false);
  const navigate = useNavigate();
  const clickSound = useRef(null);

  const handleClick = () => {
    if (clickSound.current) {
      clickSound.current.play();
    }

    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  return (
    <div style={styles.container}>

      {/* 🎬 VIDEO */}
      <video
        autoPlay
        muted
        playsInline
        style={styles.video}
        onEnded={() => {
          setTimeout(() => {
            setShowUI(true);
          }, 800);
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* 🔊 CLICK SOUND */}
      <audio ref={clickSound} src="/click.mp3" />

      {/* 🌫 UI AFTER VIDEO */}
      {showUI && (
        <div style={styles.overlay}>

          <div style={styles.card}>

            <p style={styles.text}>
              نظام محمي ومراقب. الدخول مصرح للموظفين المخولين فقط
            </p>

            {/* 👆 pointer animation */}
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
    animation: "fadeIn 1s ease",
  },

  card: {
    textAlign: "center",
    padding: "30px",
    borderRadius: "15px",
  },

  text: {
    color: "white",
    fontSize: "18px",
    marginBottom: "20px",
    opacity: 0.9,
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
    transition: "0.3s",
    boxShadow: "0 0 20px rgba(255,255,255,0.2)",
  },
};
