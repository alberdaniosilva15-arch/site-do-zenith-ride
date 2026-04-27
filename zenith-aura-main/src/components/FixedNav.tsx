import { useEffect, useState } from "react";
import BrandLogo from "./BrandLogo";

export default function FixedNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || "";
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 flex items-center justify-between px-6 py-4 
      ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm" : "bg-transparent"}`}
    >
      <div className="flex items-center gap-4 magnetic cursor-pointer">
        <BrandLogo size="sm" className={scrolled ? "opacity-100" : "opacity-0 transition-opacity duration-300"} />
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal">
          ZENITH / 001
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-8">
        <a href="#info" className={`font-mono text-[10px] tracking-[0.3em] uppercase magnetic transition-colors ${activeSection === 'info' ? 'text-gold-bright' : 'text-muted-foreground hover:text-gold-royal'}`}>A Experiência</a>
        <a href="#reserva" className={`font-mono text-[10px] tracking-[0.3em] uppercase magnetic transition-colors ${activeSection === 'reserva' ? 'text-gold-bright' : 'text-muted-foreground hover:text-gold-royal'}`}>Reserva</a>
        <a href="#frota" className={`font-mono text-[10px] tracking-[0.3em] uppercase magnetic transition-colors ${activeSection === 'frota' ? 'text-gold-bright' : 'text-muted-foreground hover:text-gold-royal'}`}>A Frota</a>
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal/50 ml-4">
          LUANDA · AO
        </span>
      </div>
    </nav>
  );
}
