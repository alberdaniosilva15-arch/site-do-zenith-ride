import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const loop = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx - 6}px, ${cy - 6}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${cx - 80}px, ${cy - 80}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[200] mix-blend-difference"
        style={{ background: "hsl(40, 55%, 54%)" }}
      />
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
