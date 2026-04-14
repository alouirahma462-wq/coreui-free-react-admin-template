import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [showUI, setShowUI] = useState(false);
  const [startGate, setStartGate] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);

  const navigate = useNavigate();

  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const clickRef = useRef(null);

  // 🔥 HARD AUDIO LOCK (FINAL FIX)
  const hasStartedRef = useRef(false);

  const startMedia = async () => {
    try {
      // ❌ يمنع أي تشغيل نهائي (StrictMode safe)
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      // 🎬 VIDEO FIX
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        await videoRef.current.play();
      }

      // 🔊 VOICE FIX (NO ECHO)
      if (voiceRef.current) {
        voiceRef.current.pause();              // 🔥 stop any previous
        voiceRef.current.currentTime = 0;     // 🔥 reset
        voiceRef.current.volume = 1;          // 🔥 force clean volume
        voiceRef.current.loop = false;        // ❌ prevent loop echo
        voiceRef.current.muted = false;

        // 🔥 مهم جداً: small delay يمنع double trigger
        setTimeout(() => {
          voiceRef.current.play().catch(() => {});
        }, 50);
      }

    } catch (err) {
      console.log("Autoplay blocked:", err);
    }
  };

  // 🚪 فتح الباب
  const openGate = () => {
    setOpenDoor(true);

    setTimeout(() => {
      setStartGate(true);
      startMedia(); // ✅ مرة واحدة فقط
    }, 1200);
  };

  const handleClick = () => {
    if (clickRef.current) {
      clickRef.current.pause();
      clickRef.current.currentTime = 0;
      clickRef.current.play();
    }

    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  return (
    <div style={styles.container}>

      {/* 🎬 VIDEO */}
      {startGate && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
          onEnded={() => setShowUI(true)}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      )}

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

          <div style={styles.doorContainer}>
            <div
              style={{
                ...styles.doorLeft,
                transform: openDoor ? "rotateY(-90deg)" : "rotateY(0deg)",
              }}
            />
            <div
              style={{
                ...styles.doorRight,
                transform: openDoor ? "rotateY(90deg)" : "rotateY(0deg)",
              }}
            />
          </div>

          {!openDoor && (
            <div style={styles.gateCard}>

              <h1 style={styles.title}>
                🏛️ منظومة النيابة العمومية
              </h1>

              <p style={styles.sub}>👋 مرحبا بك</p>

              <p style={styles.click}>اضغط هنا للدخول</p>

              <div style={styles.finger}>👇</div>

              <button onClick={openGate} style={styles.gateBtn}>
                الدخول
              </button>

            </div>
          )}

        </div>
      )}

      {/* 🔒 FINAL UI */}
      {showUI && (
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

/* ================= STYLES ================= */

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

  gate: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  gateCard: {
    textAlign: "center",
    color: "white",
    zIndex: 5,
    padding: "25px 35px",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
  },

  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  sub: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  click: {
    fontSize: "16px",
    opacity: 0.85,
  },

  finger: {
    fontSize: "50px",
    color: "#facc15",
    animation: "fingerMove 1s infinite",
    margin: "10px 0",
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

  doorContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    perspective: "1200px",
  },

  doorLeft: {
    width: "50%",
    height: "100%",
    backgroundImage: "url('/court-door.png')",
    backgroundSize: "200% 100%",
    backgroundPosition: "left",
    transformOrigin: "left",
    transition: "1.2s ease-in-out",
  },

  doorRight: {
    width: "50%",
    height: "100%",
    backgroundImage: "url('/court-door.png')",
    backgroundSize: "200% 100%",
    backgroundPosition: "right",
    transformOrigin: "right",
    transition: "1.2s ease-in-out",
  },
};







