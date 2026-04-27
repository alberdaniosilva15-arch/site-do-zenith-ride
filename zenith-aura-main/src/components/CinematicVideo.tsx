import { useEffect, useRef } from "react";

export default function CinematicVideo() {
  const FALLBACK = "/assets/zenith-emblem-loop.mp4";
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Apenas reproduzir o vídeo quando visível para poupar GPU/CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <video
        ref={videoRef}
        src={FALLBACK}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1, willChange: 'transform', transform: 'translateZ(0)' }}
      />
    </div>
  );
}