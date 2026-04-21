import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "./BrandLogo";

gsap.registerPlugin(ScrollTrigger);

export default function InfoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Background gradient - Vantablack style */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 2%) 50%, hsl(0 0% 3%) 100%)"
        }}
      />

      {/* Content */}
      <div className="relative z-[2] max-w-4xl mx-auto px-6 text-center">
        <BrandLogo size="lg" className="mx-auto mb-8" />
        
        <h2 className="font-display text-4xl sm:text-6xl font-bold text-gold-gradient mb-6">
          O Futuro da Mobilidade
        </h2>
        
        <div className="luxury-line mx-auto mb-8 w-32" />
        
        <p className="font-body text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Combinamos tecnologia de ponta com luxo refinado para criar uma experiência 
          de mobilidade sem igual em Angola. Cada perjalanan é um evento cinemático.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="font-display text-3xl text-gold-gradient mb-2">24/7</div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Operação
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-display text-3xl text-gold-gradient mb-2">♥</div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Premium
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-display text-3xl text-gold-gradient mb-2">5★</div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Conforto
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mt-16 pt-8 border-t border-gold-royal/20">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal mb-4">
            ◆ Base Principal ◆
          </div>
          <p className="font-display text-xl text-foreground mb-2">
            Luanda, Angola
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            +244 997 608 404
          </p>
        </div>

        {/* Objectives / Concepts */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <span className="px-4 py-2 border border-gold-royal/30 font-mono text-[10px] tracking-[0.3em] uppercase text-gold-royal">
            Mobilidade
          </span>
          <span className="px-4 py-2 border border-gold-royal/30 font-mono text-[10px] tracking-[0.3em] uppercase text-gold-royal">
            Luxo
          </span>
          <span className="px-4 py-2 border border-gold-royal/30 font-mono text-[10px] tracking-[0.3em] uppercase text-gold-royal">
            Tecnologia
          </span>
          <span className="px-4 py-2 border border-gold-royal/30 font-mono text-[10px] tracking-[0.3em] uppercase text-gold-royal">
            Experiência
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-gold-royal to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Deslize para transformar
          </span>
        </div>
      </div>
    </section>
  );
}