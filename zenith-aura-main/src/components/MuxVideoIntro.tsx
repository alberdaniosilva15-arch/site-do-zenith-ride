import { useEffect, useRef } from "react";

const MUX_PLAYBACK_ID = "UlFZ3j8Qko012KzMTsY013Y902EioY1mgzIZk2gU438tVU";

export default function MuxVideoIntro({ onComplete }: { onComplete?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`;
    video.muted = false;
    video.loop = false;
    video.playsInline = true;
    video.autoPlay = true;

    video.play().catch(() => {});
    
    video.onended = () => {
      onComplete?.();
    };
    
    // Timeout após 8 segundos
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 8000);
    
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover"
      autoPlay
      playsInline
      style={{
        filter: "brightness(0.3) saturate(1) contrast(1.1)",
        zIndex: 9999,
      }}
    />
  );
}