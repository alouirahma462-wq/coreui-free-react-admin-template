import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [ended, setEnded] = useState(false);
  const navigate = useNavigate();
  const clickSound = useRef(null);

  const handleClick = () => {
    clickSound.current.play();
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  return (
    <div style={styles.container}>

      {/* 🎬 الفيديو */}
      <video
        autoPlay
        muted
        onEnded={() => setEnded(true)}
        style={styles.video}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* 🔊 الصوت */}
      <audio ref={clickSound} src="/click.mp3" />

      {/* 🌫️ Overlay */}
      {ended && (
        <div style={styles.overlay}>

          <p style={styles.text}>
            نظام محمي ومراقب. الدخول مصرح للموظفين المخولين فقط
          </p>

          {/* 👆 الإصبع */}
          <div style={styles.pointer}>👉</div>

          <button style={styles.button} onClick={handleClick}>
            تسجيل الدخول
          </button>

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
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(6px)",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    animation: "fadeIn 1.5s ease forwards",
  },

  text: {
    color: "white",
    fontSize: "18px",
    marginBottom: "20px",
  },

  pointer: {
    fontSize: "30px",
    marginBottom: "10px",
    animation: "movePointer 1.2s infinite",
  },

  button: {
    padding: "16px 50px",
    fontSize: "20px",
    color: "white",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: "12px",
    cursor: "pointer",
  },
};
