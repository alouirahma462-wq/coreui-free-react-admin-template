import { useEffect, useRef } from "react";

export default function GlobalMusic() {
  const musicRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const startMusic = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (musicRef.current) {
        musicRef.current.volume = 0.35;
        musicRef.current.loop = true;
        musicRef.current.currentTime = 0;

        musicRef.current.play().catch((err) => {
          console.log("Audio blocked:", err);
        });
      }

      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);

    return () => {
      window.removeEventListener("click", startMusic);
    };
  }, []);

  return (
    <audio ref={musicRef} preload="auto">
      <source src="/gov-music.mp3" type="audio/mpeg" />
    </audio>
  );
}


