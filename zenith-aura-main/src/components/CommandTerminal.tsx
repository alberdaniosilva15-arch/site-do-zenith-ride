import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CommandTerminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        }
      );

      if (visualRef.current) {
        gsap.to(visualRef.current, {
          y: -18,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[3] min-h-screen flex items-center py-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="font-mono text-xs tracking-[0.5em] uppercase text-gold-royal mb-4 text-center">
          Acesso Direto
        </p>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient mb-8 text-center">
          A sua Linha
        </h2>
        <div className="luxury-line mx-auto mb-16 w-32" />

        <div
          ref={contentRef}
          className="grid lg:grid-cols-2 gap-10 items-center opacity-0"
        >
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-sm overflow-hidden border border-border/20 bg-card/20 luxury-glass">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-card/80 to-background" />
            <div className="absolute inset-0 opacity-70">
              <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-royal/15" />
              <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-bright/20" />
              <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-royal/10 blur-3xl" />
            </div>

            <div
              ref={visualRef}
              className="absolute left-1/2 top-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-royal/25 bg-background/20 shadow-[0_0_80px_hsl(var(--gold-royal)/0.12)]"
            >
              <div className="absolute inset-5 rounded-full border border-gold-bright/20" />
              <div className="absolute inset-10 rounded-full border border-gold-royal/20" />
              <div className="text-center px-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-gold-royal/80 mb-3">
                  Assistente Zenith
                </p>
                <p className="font-display text-3xl text-gold-gradient">
                  Resposta imediata
                </p>
              </div>
            </div>

            <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              presença digital
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              luxo discreto
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
            <div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                Converse com o nosso assistente pelo WhatsApp e saiba mais sobre a Zenith Ride.
                Um contacto. Sem complicações. Sem espera. Resposta imediata para quem exige excelência.
              </p>
            </div>

            <div
              className="border border-gold-royal/30 rounded-sm p-8 sm:p-10 bg-card/30 backdrop-blur-md relative overflow-hidden w-full"
              style={{ perspective: "800px" }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-px bg-gold-royal" />
              <div className="absolute top-0 left-0 w-px h-8 bg-gold-royal" />
              <div className="absolute bottom-0 right-0 w-8 h-px bg-gold-royal" />
              <div className="absolute bottom-0 right-0 w-px h-8 bg-gold-royal" />

              <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">
                Linha Direta · Luanda
              </p>
              <a
                href="tel:+244997608404"
                className="font-display text-2xl sm:text-4xl text-gold-bright hover:text-gold-hot transition-colors duration-500"
              >
                +244 997 608 404
              </a>
              <p className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground uppercase mt-4">
                Disponível 24/7 · Acesso prioritário
              </p>
            </div>

            <a
              href="https://wa.me/244997608404"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 py-3 px-8 border border-gold-royal/30
                         font-mono text-xs tracking-[0.3em] uppercase text-gold-bright
                         hover:bg-gold-royal/10 hover:border-gold-royal/60 transition-all duration-500"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Fale Connosco no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
