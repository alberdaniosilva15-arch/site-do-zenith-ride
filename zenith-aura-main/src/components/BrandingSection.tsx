import { useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";

const LOGO_VIDEO = "/assets/zenith-emblem-loop.mp4";

export default function BrandingSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.src = LOGO_VIDEO;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Video Background com mix-blend-mode */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        style={{
          filter: "brightness(0.15) saturate(1.2) contrast(1.1)",
          opacity: 0.6,
          mixBlendMode: "screen",
          zIndex: 0,
        }}
      />
      
      {/* Overlay gradients */}
      <div 
        className="absolute inset-0 z-[1]" 
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsl(0 0% 3%) 70%)"
        }}
      />
      
      {/* Logo central */}
      <div className="relative z-[2] text-center">
        <BrandLogo size="lg" className="mx-auto mb-8" />
        
        <h2 className="font-display text-4xl sm:text-6xl font-bold text-gold-gradient mb-4">
          ZENITH RIDE
        </h2>
        
        <p className="font-mono text-sm tracking-[0.5em] uppercase text-gold-royal">
          Mobilidade Cinemática
        </p>
        
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-gradient-to-b from-gold-royal to-transparent" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Deslize para começar
          </span>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="absolute bottom-8 left-0 right-0 z-[2] flex items-center justify-center">
        <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
          <span>◆ Luanda</span>
          <span>◆ +244 997 608 404</span>
          <span>◆ 24/7</span>
        </div>
      </div>
    </section>
  );
}