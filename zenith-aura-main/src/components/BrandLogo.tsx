import { useEffect, useRef, useState } from "react";

const LOGO_SRC = "/assets/logo.png";

export default function BrandLogo({ 
  className = "",
  size = "default"
}: { 
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  const sizeClasses = {
    sm: "h-6",
    default: "h-10", 
    lg: "h-16"
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    if (img.complete && img.naturalHeight > 0) {
      setLoaded(true);
    }
    
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <img
      ref={imgRef}
      src={LOGO_SRC}
      alt="Zenith Ride"
      className={`${className} ${sizeClasses[size]} w-auto transition-all duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        filter: "drop-shadow(0 0 24px rgba(212, 175, 55, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))",
      }}
    />
  );
}