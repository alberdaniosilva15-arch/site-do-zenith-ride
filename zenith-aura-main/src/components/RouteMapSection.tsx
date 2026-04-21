import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROUTES = [
  { name: "Talatona → Ilha de Luanda", time: "18 min", distance: "12 km" },
  { name: "Viana → Cidade Alta", time: "25 min", distance: "19 km" },
  { name: "Kilamba → Miramar", time: "22 min", distance: "16 km" },
];

export default function RouteMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const routesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      const items = routesRef.current?.children;
      if (items) {
        gsap.fromTo(
          items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: routesRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[3] min-h-screen flex items-center py-32"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-[0.5em] uppercase text-gold-royal mb-4">
            Rede
          </p>
          <h2
            ref={titleRef}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient opacity-0"
          >
            Rotas de Luanda
          </h2>
          <div className="luxury-line mx-auto mt-8 w-32" />
        </div>

        <div ref={routesRef} className="space-y-6">
          {ROUTES.map((route, i) => (
            <div
              key={i}
              className="group relative border border-border/40 rounded-sm p-6 sm:p-8 
                         bg-card/30 backdrop-blur-sm hover:border-gold-royal/40 
                         transition-all duration-700 cursor-pointer"
            >
              {/* Glowing route line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-royal to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl text-foreground group-hover:text-gold-bright transition-colors duration-500">
                    {route.name}
                  </h3>
                  <div className="flex gap-6 mt-2">
                    <span className="font-mono text-xs text-muted-foreground tracking-wider">
                      {route.distance}
                    </span>
                    <span className="font-mono text-xs text-gold-royal tracking-wider">
                      {route.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 rounded-full bg-gold-royal animate-pulse" />
                  <span className="font-mono text-xs text-gold-royal tracking-wider">
                    ATIVO
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
