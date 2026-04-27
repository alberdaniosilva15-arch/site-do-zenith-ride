import { useEffect, useRef } from "react";

function FooterParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; r: number; dx: number; dy: number }[] = [];
    const numParticles = 50;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(200, 164, 92, 0.4)"; // Gold color

      particles.forEach((p) => {
        // Move
        p.x += p.dx;
        p.y += p.dy;

        // Bounce
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default function FooterSection() {
  return (
    <footer className="relative z-[3] bg-background pt-32 pb-10 border-t border-border/20 overflow-hidden min-h-[60vh] flex flex-col justify-between">
      <FooterParticles />
      <div className="container mx-auto px-6 max-w-6xl relative z-10 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div>
            <h3 className="font-mono text-[10px] tracking-[0.5em] text-gold-royal uppercase mb-6">Localização</h3>
            <p className="font-display text-2xl text-foreground mb-2">Luanda</p>
            <p className="font-body text-sm text-muted-foreground">Angola</p>
          </div>
          <div>
            <h3 className="font-mono text-[10px] tracking-[0.5em] text-gold-royal uppercase mb-6">Contacto</h3>
            <a href="https://wa.me/244997608404" target="_blank" rel="noopener noreferrer" className="block font-display text-2xl text-foreground mb-2 hover:text-gold-bright transition-colors">
              +244 997 608 404
            </a>
            <a href="mailto:hello@zenith.ao" className="block font-body text-sm text-muted-foreground hover:text-gold-bright transition-colors">
              hello@zenith.ao
            </a>
          </div>
          <div>
            <h3 className="font-mono text-[10px] tracking-[0.5em] text-gold-royal uppercase mb-6">Social</h3>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com/zenithride" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground hover:text-gold-bright transition-colors flex items-center gap-2 magnetic w-fit">
                Instagram <span className="text-gold-royal">↗</span>
              </a>
              <a href="#" className="font-body text-sm text-foreground hover:text-gold-bright transition-colors flex items-center gap-2 magnetic w-fit">
                LinkedIn <span className="text-gold-royal">↗</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center w-full mt-auto">
          <h2 className="font-display text-[15vw] leading-none font-bold text-gold-gradient opacity-80 whitespace-nowrap overflow-hidden">
            ZENITH RIDE
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-border/30">
            <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider uppercase">
              © {new Date().getFullYear()} Zenith Ride — Mobilidade Cinemática
            </p>
            <div className="flex gap-6 font-mono text-[10px] text-muted-foreground/50 tracking-wider uppercase">
              <a href="#" className="hover:text-gold-royal transition-colors">Termos</a>
              <a href="#" className="hover:text-gold-royal transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
