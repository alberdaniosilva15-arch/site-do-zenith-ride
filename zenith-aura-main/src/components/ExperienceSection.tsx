import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    title: "Precisão",
    desc: "Cada trajecto é optimizado. Cada segundo é contabilizado. Eficiência cirúrgica para quem exige controlo absoluto do seu tempo.",
    stat: "99.7%",
    statLabel: "Pontualidade",
  },
  {
    title: "Discrição",
    desc: "A privacidade não é um extra — é a base. Os seus movimentos continuam apenas seus.",
    stat: "0",
    statLabel: "Dados partilhados",
  },
  {
    title: "Prestígio",
    desc: "Uma frota escolhida para quem não aceita nada abaixo do extraordinário. Cada viatura é uma afirmação.",
    stat: "S-Class",
    statLabel: "Categoria mínima",
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll(".pillar-card");
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, rotateY: 5 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          stagger: 0.25,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[3] min-h-screen flex items-center py-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-[0.5em] uppercase text-gold-royal mb-4">
            Filosofia
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient">
            O Conforto
          </h2>
          <div className="luxury-line mx-auto mt-8 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="pillar-card group relative border border-border/30 rounded-sm p-8 sm:p-10 
                         bg-card/20 backdrop-blur-sm hover:border-gold-royal/30 
                         transition-all duration-700 opacity-0"
              style={{ perspective: "600px" }}
            >
              <div className="mb-8">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-gold-bright">
                  {p.stat}
                </span>
                <span className="block font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-1">
                  {p.statLabel}
                </span>
              </div>
              <h3 className="font-display text-2xl text-foreground mb-4 group-hover:text-gold-bright transition-colors duration-500">
                {p.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-royal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
