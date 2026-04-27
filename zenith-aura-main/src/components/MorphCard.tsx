import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "./BrandLogo";

gsap.registerPlugin(ScrollTrigger);

const LOGO_VIDEO = "/assets/zenith-emblem-loop.mp4";

export default function MorphCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="relative min-h-[80vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        style={{
          filter: "brightness(0.1) saturate(1.3) contrast(1.2)",
          opacity: 0.5,
          mixBlendMode: "screen",
          zIndex: 0,
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 5%) 50%, hsl(0 0% 3%) 100%)"
        }}
      />
      
      {/* Card central */}
      <div className="relative z-[2] max-w-2xl mx-auto px-6">
        <div className="luxury-glass border border-gold-royal/30 p-8 sm:p-12 text-center">
          <BrandLogo size="lg" className="mx-auto mb-6" />
          
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-gold-gradient mb-4">
            Eleve a Sua Experiência
          </h2>
          
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            Uma fleet premium de veículos de luxo aguarda por si. 
            Reserve a sua experiência cinemática de mobilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#reserva"
              className="px-8 py-3 bg-gold-gradient text-background font-mono text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            >
              Reservar Agora
            </a>
            <a 
              href="#frota"
              className="px-8 py-3 border border-gold-royal/40 text-gold-royal font-mono text-sm tracking-[0.2em] uppercase hover:bg-gold-royal/10 transition-colors"
            >
              Ver Frota
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gold-royal/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              <span>+244 997 608 404</span>
              <span className="hidden sm:inline">◆</span>
              <span>hello@zenith.ao</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}