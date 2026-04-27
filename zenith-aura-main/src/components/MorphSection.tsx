import { useEffect, useRef, useState, useCallback } from "react";
import { getCachedImagesFor, startPreloading } from "@/lib/framePreloader";

const FRAME_COUNT = 136;
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

export default function MorphSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const stateRef = useRef({ current: 0, target: 0 });
  const rafRef = useRef<number | null>(null);
  const canvasSizeRef = useRef({ dpr: 1, width: 0, height: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      canvasSizeRef.current = setupCanvas(canvasRef.current);
    }
    
    const handleResize = () => {
      if (canvasRef.current) {
        canvasSizeRef.current = setupCanvas(canvasRef.current);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    startPreloading().then(() => {
      const loaded = getCachedImagesFor("morph", FRAME_COUNT, "jpg", 3);
      setFrames(loaded);
    });
  }, []);

  const draw = useCallback(() => {
    if (frames.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { dpr, width, height } = canvasSizeRef.current;
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
    const section = document.querySelector("[data-morph]");
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

  return (
    <div data-morph className="relative min-h-[300vh]">
      <div className="sticky top-0 h-screen">
        <canvas ref={canvasRef} className="w-full h-full" style={{ zIndex: 10 }} />
        <div className="absolute bottom-8 left-0 right-0 z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal">
            <span>◆</span>
            <span>Forma em Movimento</span>
            <span>◆</span>
          </div>
        </div>
      </div>
    </div>
  );
}