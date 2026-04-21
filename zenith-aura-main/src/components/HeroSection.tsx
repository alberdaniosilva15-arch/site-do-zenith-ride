import { useEffect, useRef, useState, useCallback } from "react";
import { getCachedImagesFor, startPreloading } from "@/lib/framePreloader";
import BrandLogo from "./BrandLogo";

const FRAME_COUNT = 128;
const LERP = 0.18;

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  return { dpr, width, height };
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const stateRef = useRef({ current: 0, target: 0 });
  const rafRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (canvasRef.current) {
        setupCanvas(canvasRef.current);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    startPreloading().then(() => {
      const loaded = getCachedImagesFor("hero", FRAME_COUNT, "jpg", 3);
      setFrames(loaded);
    });
  }, []);

  const draw = useCallback(() => {
    if (frames.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { dpr, width, height } = setupCanvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stateRef.current.current += (stateRef.current.target - stateRef.current.current) * LERP;
    const idx = Math.round(stateRef.current.current);
    const img = frames[idx];

    if (img && img.naturalWidth > 0) {
      const ratio = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * ratio;
      const h = img.naturalHeight * ratio;
      const x = (width - w) / 2;
      const y = (height - h) / 2;
      ctx.drawImage(img, x * dpr, y * dpr, w * dpr, h * dpr);
    }
    
    rafRef.current = requestAnimationFrame(draw);
  }, [frames]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        requestAnimationFrame(draw);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    rafRef.current = requestAnimationFrame(draw);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const section = document.querySelector("[data-hero]");
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      stateRef.current.target = progress * (frames.length - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [frames]);

  const titleSize = isMobile ? "text-3xl sm:text-5xl lg:text-8xl" : "text-6xl sm:text-8xl lg:text-[10rem]";
  const rideSize = isMobile ? "text-2xl sm:text-4xl lg:text-8xl" : "text-5xl sm:text-7xl lg:text-8xl";
  const logoSize = isMobile ? "sm" : "sm";

  return (
    <div data-hero className="relative min-h-[300vh]">
      <div className="sticky top-0 h-screen">
        <canvas ref={canvasRef} className="w-full h-full" style={{ zIndex: 10 }} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none" style={{ zIndex: 20 }} />
        
        <div className={`absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-3 ${isMobile ? "scale-90" : ""}`}>
          <BrandLogo size={logoSize} />
          <div className="w-4 sm:w-8 h-px bg-gold-royal" />
          <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.45em] uppercase text-gold-royal">
            Zenith / 001
          </span>
        </div>
        
        <div className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 ${isMobile ? "scale-90" : ""}`}>
          <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.45em] uppercase text-gold-royal">
            Luanda · AO
          </span>
          <div className="w-4 sm:w-8 h-px bg-gold-royal" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 30 }}>
          <h1 className={`font-display ${titleSize} font-bold tracking-tight text-gold-gradient text-center leading-[0.9]`}>
            ZENITH
            <br />
            <span className={`font-cinzel-decorative italic ${rideSize}`}>
              Ride
            </span>
          </h1>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 border-t border-gold-royal/15 bg-background/40 backdrop-blur-md" style={{ zIndex: 40 }}>
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 font-mono text-[8px] sm:text-[10px] tracking-[0.3em] uppercase">
            <span className="text-gold-royal">◆ Sistema</span>
            <span className="text-muted-foreground hidden sm:inline">Reserve · Embarque · Eleve-se</span>
            <span className="text-gold-bright">+244 997 608 404</span>
          </div>
        </div>
        
        <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-gold-royal to-transparent" />
          <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
}