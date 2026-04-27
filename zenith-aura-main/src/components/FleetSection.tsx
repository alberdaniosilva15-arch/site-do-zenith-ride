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
    image: "/assets/fleet_mercedes.png"
  },
  {
    name: "BMW 530D M Sport",
    tier: "Presidencial",
    seats: 4,
    year: 2024,
    gradient: "from-gold-royal/20 via-card/60 to-card",
    image: "/assets/fleet_bmw.png"
  },
  {
    name: "Range Rover Evoque",
    tier: "Soberano",
    seats: 5,
    year: 2024,
    gradient: "from-gold-bright/15 via-card/60 to-card",
    image: "/assets/fleet_rangerover.png"
  },
];

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // We need a pin for horizontal scroll
    const ctx = gsap.context(() => {
      const container = document.querySelector('.horizontal-container');
      if (!container) return;
      
      gsap.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + container.scrollWidth
        }
      });
      
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
    <section ref={sectionRef} className="relative z-[3] bg-background pt-32 h-screen flex flex-col justify-center overflow-hidden">
      <div className="px-6 mb-12">
        <p className="font-mono text-xs tracking-[0.5em] uppercase text-gold-royal mb-4">
          A Coleção
        </p>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient mb-8">
          A Frota
        </h2>
        <div className="luxury-line w-32" />
      </div>

      <div className="horizontal-container flex gap-8 px-6 pb-20 w-max items-center">
        {fleet.map((car, i) => (
          <div
            key={car.name}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="group relative border border-border/30 rounded-sm overflow-hidden
                       bg-card/30 backdrop-blur-md opacity-0 transition-all duration-300
                       hover:border-gold-royal/40 preserve-3d cursor-pointer w-[85vw] md:w-[600px] shrink-0"
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const xc = rect.width / 2;
              const yc = rect.height / 2;
              const dx = x - xc;
              const dy = y - yc;
              const rotateY = (dx / xc) * 5;
              const rotateX = -(dy / yc) * 5;
              el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
              el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transition = "none";
            }}
          >
            {/* Image area */}
            <div className={`h-64 sm:h-80 relative flex items-center justify-center transform-style-3d overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-b ${car.gradient} opacity-50 z-10 pointer-events-none`} />
              <img src={car.image} alt={car.name} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110" />
              <span className="font-display text-xl text-gold-bright/80 tracking-widest uppercase translate-z-10 z-20 shadow-black drop-shadow-lg pointer-events-none">
                {car.tier}
              </span>
            </div>

            <div className="p-8 transform-style-3d">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4 translate-z-10">
                {car.name}
              </h3>

              <div className="flex gap-6 mb-8 translate-z-10">
                <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  {car.seats} Lugares
                </span>
                <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  {car.year}
                </span>
                <span className="font-mono text-xs tracking-wider text-gold-royal uppercase">
                  {car.tier}
                </span>
              </div>

              <a
                href="https://wa.me/244997608404"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 border border-gold-royal/30 font-mono text-xs
                           tracking-[0.3em] uppercase text-gold-bright
                           hover:bg-gold-royal/10 hover:border-gold-royal/60 transition-all duration-500 magnetic"
              >
                Reservar
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
