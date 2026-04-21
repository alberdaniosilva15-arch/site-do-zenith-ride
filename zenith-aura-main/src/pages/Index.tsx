import { useState, useCallback, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import { startPreloading } from "@/lib/framePreloader";
import CustomCursor from "@/components/CustomCursor";
import GoldParticleScene from "@/components/GoldParticleScene";
import SVGFilters from "@/components/SVGFilters";
import CinematicVideo from "@/components/CinematicVideo";
import BrandingSection from "@/components/BrandingSection";
import HeroSection from "@/components/HeroSection";
import MorphSection from "@/components/MorphSection";
import InfoSection from "@/components/InfoSection";
import BookingTerminal from "@/components/BookingTerminal";
import FleetSection from "@/components/FleetSection";
import FooterSection from "@/components/FooterSection";
import LoadingScreen from "@/components/LoadingScreen";
import WhatsAppButton from "@/components/WhatsAppButton";
import MorphCard from "@/components/MorphCard";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startPreloading();
  }, []);

  const handleLoadComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}

      <SVGFilters />

      <SmoothScroll>
        <div className="vignette" />
        <div className="grain" />
        <CustomCursor />
        <GoldParticleScene />

        <main className="relative">
          <CinematicVideo />
          <BrandingSection />
          <HeroSection />
          <MorphSection />
          <InfoSection />
          <BookingTerminal />
          <FleetSection />
          <MorphCard />
          <FooterSection />
        </main>
      </SmoothScroll>

      <WhatsAppButton show={!loading} />
    </>
  );
}