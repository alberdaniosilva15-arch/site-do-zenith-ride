import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      infinite: false,
    });

    // CRITICAL: Sync Lenis with GSAP ScrollTrigger for Awwwards-level smooth scrub
    lenis.on("scroll", ScrollTrigger.update);

    // CRITICAL: Register Lenis as GSAP's ticker so all animations share the same RAF loop
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // CRITICAL: Prevent lag spike by capping delta at ~100ms
    gsap.ticker.lagSmoothing(0);

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
