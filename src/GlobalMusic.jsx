import { useEffect, useRef } from "react";

let isPlaying = false; // 🔥 يمنع التكرار عالميًا

export default function GlobalMusic() {
  const musicRef = useRef(null);

  useEffect(() => {
    const startMusic = () => {
      if (isPlaying) return; // ❌ يمنع تشغيل مرتين
      isPlaying = true;

      if (musicRef.current) {
        musicRef.current.volume = 0.35;
        musicRef.current.loop = true;
        musicRef.current.play().catch(() => {});
      }

      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);

    return () => window.removeEventListener("click", startMusic);
  }, []);

  return (
    <audio ref={musicRef}>
      <source src="/gov-music.mp3" type="audio/mpeg" />
    </audio>
  );
}

