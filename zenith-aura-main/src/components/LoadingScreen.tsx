import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { onProgress, startPreloading } from "@/lib/framePreloader";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const displayedRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const finishedRef = useRef(false);

  // Kick off the real preloader and subscribe to progress.
  useEffect(() => {
    const unsub = onProgress((p) => {
      targetRef.current = p;
    });
    startPreloading().then(() => {
      targetRef.current = 1;
    });
    
    // Safety fallback: Force complete after 10 seconds if frames are missing
    const fallbackTimer = setTimeout(() => {
      if (!finishedRef.current) {
        targetRef.current = 1;
      }
    }, 10000);
    
    return () => {
      unsub();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Smoothly interpolate displayed % toward target so the counter feels analogue.
  useEffect(() => {
    const tick = () => {
      const t = targetRef.current;
      const cur = displayedRef.current;
      // ease toward target
      const next = cur + (t - cur) * 0.08;
      displayedRef.current = next;
      const rounded = Math.min(100, Math.floor(next * 100));
      setPct(rounded);

      if (!finishedRef.current && t >= 1 && next >= 0.999) {
        finishedRef.current = true;
        setPct(100);
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete,
        });
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background"
    >
      <div className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.5em] uppercase text-gold-royal">
        ◆ Zenith / Boot
      </div>
      <div className="absolute top-6 right-6 font-mono text-[10px] tracking-[0.5em] uppercase text-gold-royal">
        Luanda · AO
      </div>

      <p className="font-mono text-[10px] tracking-[0.6em] uppercase text-muted-foreground mb-8">
        A preparar a experiência
      </p>

      <div className="font-display text-7xl sm:text-9xl font-bold text-gold-gradient tabular-nums leading-none gold-shimmer">
        {String(pct).padStart(3, "0")}
        <span className="font-mono text-2xl text-gold-royal align-top ml-2">%</span>
      </div>

      <div className="mt-10 w-64 sm:w-96 h-px bg-border/40 overflow-hidden">
        <div
          className="h-full origin-left transition-transform duration-100"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--gold-deep)), hsl(var(--gold-royal)), hsl(var(--gold-bright)))",
            transform: `scaleX(${pct / 100})`,
            transformOrigin: "left",
          }}
        />
      </div>

      <p className="font-mono text-[9px] tracking-[0.5em] uppercase text-muted-foreground/70 mt-6 text-center">
        264 quadros · pré-carregamento
      </p>
      <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-gold-royal/80 mt-3 text-center max-w-[280px]">
        O site deve carregar para a melhor experiência possível
      </p>

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60">
        <span>◆ Sistema</span>
        <span>Zenith Ride · 2026</span>
      </div>
    </div>
  );
}
