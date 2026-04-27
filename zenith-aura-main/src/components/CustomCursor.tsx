import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    let mx = 0, my = 0, cx = 0, cy = 0;
    let isHovering = false;
    let hoverText = "";

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, input, [role='button'], .magnetic");
      if (clickable) {
        isHovering = true;
        if (target.tagName.toLowerCase() === 'input') {
          hoverText = "ESCREVER";
        } else if (target.closest('a') || target.tagName.toLowerCase() === 'button') {
          hoverText = "RESERVAR";
        } else {
          hoverText = "EXPLORAR";
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, [role='button'], .magnetic")) {
        isHovering = false;
        hoverText = "";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    let raf: number;
    const loop = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      
      if (cursorRef.current) {
        if (isHovering) {
          cursorRef.current.style.transform = `translate(${cx - 30}px, ${cy - 30}px) scale(1)`;
          cursorRef.current.style.width = "60px";
          cursorRef.current.style.height = "60px";
          cursorRef.current.style.opacity = "0.9";
          cursorRef.current.style.border = "1px solid hsl(40, 55%, 54%)";
          cursorRef.current.style.background = "hsl(0, 0%, 5%, 0.8)";
          cursorRef.current.style.backdropFilter = "blur(4px)";
          
          const textEl = cursorRef.current.querySelector('span');
          if (textEl) {
            textEl.innerText = hoverText;
            textEl.style.opacity = "1";
          }
        } else {
          cursorRef.current.style.transform = `translate(${cx - 6}px, ${cy - 6}px) scale(1)`;
          cursorRef.current.style.width = "12px";
          cursorRef.current.style.height = "12px";
          cursorRef.current.style.opacity = "1";
          cursorRef.current.style.border = "none";
          cursorRef.current.style.background = "hsl(40, 55%, 54%)";
          cursorRef.current.style.backdropFilter = "none";
          
          const textEl = cursorRef.current.querySelector('span');
          if (textEl) {
            textEl.style.opacity = "0";
          }
        }
      }
      
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${cx - 80}px, ${cy - 80}px)`;
      }
      
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[200] transition-[width,height,background-color,border-color] duration-300 flex items-center justify-center overflow-hidden"
        style={{ width: "12px", height: "12px", background: "hsl(40, 55%, 54%)" }}
      >
        <span className="font-mono text-[8px] tracking-[0.2em] text-gold-bright opacity-0 transition-opacity duration-300 pointer-events-none"></span>
      </div>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-40 h-40 rounded-full pointer-events-none z-[199]"
        style={{
          background: "radial-gradient(circle, hsl(40 55% 54% / 0.06), transparent 70%)",
        }}
      />
    </>
  );
}
