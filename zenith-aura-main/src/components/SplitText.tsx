import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitText({ text, className = "", delay = 0 }: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const chars = containerRef.current.querySelectorAll('.split-char');
    
    const ctx = gsap.context(() => {
      gsap.fromTo(chars, 
        { 
          y: 100, 
          opacity: 0,
          rotateX: -90
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          delay: delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={containerRef} className={`${className} perspective-container inline-block`} style={{ perspective: "400px" }}>
      {text.split(/(\s+)/).map((word, wordIdx) => {
        if (word.match(/\s+/)) {
          return <span key={wordIdx} className="inline-block w-[0.3em]">&nbsp;</span>;
        }
        return (
          <span key={wordIdx} className="inline-block overflow-hidden align-bottom">
            {word.split('').map((char, charIdx) => (
              <span key={charIdx} className="split-char inline-block origin-bottom transform-style-3d">
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
