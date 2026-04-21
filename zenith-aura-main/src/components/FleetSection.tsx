import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fleet = [
  {
    name: "Mercedes S-Class",
    tier: "Executivo",
    seats: 4,
    year: 2024,
    gradient: "from-gold-deep/30 via-card/60 to-card",
  },
  {
    name: "BMW 7 Series",
    tier: "Presidencial",
    seats: 4,
    year: 2024,
    gradient: "from-gold-royal/20 via-card/60 to-card",
  },
  {
    name: "Range Rover Autobiography",
    tier: "Soberano",
    seats: 5,
    year: 2024,
    gradient: "from-gold-bright/15 via-card/60 to-card",
  },
];

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[3] py-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="font-mono text-xs tracking-[0.5em] uppercase text-gold-royal mb-4 text-center">
          A Coleção
        </p>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient mb-8 text-center">
          A Frota
        </h2>
        <div className="luxury-line mx-auto mb-20 w-32" />

        <div className="grid md:grid-cols-3 gap-8">
          {fleet.map((car, i) => (
            <div
              key={car.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative border border-border/30 rounded-sm overflow-hidden
                         bg-card/30 backdrop-blur-sm opacity-0 transition-all duration-500
                         hover:border-gold-royal/40"
            >
              {/* Image placeholder area */}
              <div className={`h-52 bg-gradient-to-b ${car.gradient} flex items-center justify-center`}>
                <span className="font-display text-lg text-gold-bright/40 tracking-widest uppercase">
                  {car.tier}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {car.name}
                </h3>

                <div className="flex gap-4 mb-6">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    {car.seats} Lugares
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    {car.year}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-gold-royal uppercase">
                    {car.tier}
                  </span>
                </div>

                <a
                  href="https://wa.me/244997608404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 border border-gold-royal/30 font-mono text-xs
                             tracking-[0.3em] uppercase text-gold-bright
                             hover:bg-gold-royal/10 hover:border-gold-royal/60 transition-all duration-500"
                >
                  Reservar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
