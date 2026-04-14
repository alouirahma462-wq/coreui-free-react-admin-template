import { useEffect, useRef } from "react";

export default function GlobalMusic() {
  const musicRef = useRef(null);

  useEffect(() => {
    const startMusic = () => {
      if (musicRef.current) {
        musicRef.current.volume = 0.5;
        musicRef.current.play().catch(() => {});
      }
      window.removeEventListener("click", startMusic);
    };

    window.addEventListener("click", startMusic);

    return () => window.removeEventListener("click", startMusic);
  }, []);

  return (
    <audio ref={musicRef} loop>
      <source src="/gov-music.mp3" type="audio/mpeg" />
    </audio>
  );
}
