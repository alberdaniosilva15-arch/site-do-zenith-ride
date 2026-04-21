import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { z } from "zod";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    id: "black",
    name: "Zenith Black",
    tagline: "Discrição executiva",
    seats: "1–3 PAX",
    range: "320 KM",
    response: "04 MIN",
    finish: "Obsidiana Mate",
  },
  {
    id: "gold",
    name: "Zenith Gold",
    tagline: "Apresentação cerimonial",
    seats: "1–4 PAX",
    range: "280 KM",
    response: "06 MIN",
    finish: "Champanhe Pérola",
  },
  {
    id: "armored",
    name: "Zenith Armored",
    tagline: "Protecção máxima",
    seats: "1–4 PAX",
    range: "240 KM",
    response: "08 MIN",
    finish: "Carbono B6/B7",
  },
] as const;

type TierId = (typeof tiers)[number]["id"];

const bookingSchema = z.object({
  pickup: z
    .string()
    .trim()
    .min(2, "Indique o local de recolha")
    .max(120, "Máximo 120 caracteres"),
  destination: z
    .string()
    .trim()
    .min(2, "Indique o destino")
    .max(120, "Máximo 120 caracteres"),
  when: z.string().trim().max(40).optional(),
});

export default function BookingTerminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<TierId>("black");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [when, setWhen] = useState("");

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const active = tiers.find((t) => t.id === tier)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = bookingSchema.safeParse({ pickup, destination, when });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    const msg =
      `Olá Zenith Ride, gostaria de reservar:\n` +
      `• Veículo: ${active.name}\n` +
      `• Recolha: ${result.data.pickup}\n` +
      `• Destino: ${result.data.destination}\n` +
      (result.data.when ? `• Quando: ${result.data.when}\n` : "");
    const url = `https://wa.me/244997608404?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("A redirecionar para WhatsApp…");
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-[3] min-h-screen flex items-center py-32"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <p className="font-mono text-xs tracking-[0.5em] uppercase text-gold-royal mb-4 text-center">
          Acesso Imediato
        </p>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient mb-6 text-center">
          Reserve a sua Viagem
        </h2>
        <div className="luxury-line mx-auto mb-16 w-32" />

        <div
          ref={cardRef}
          className="grid lg:grid-cols-[1fr_1.2fr] gap-10 opacity-0"
        >
          {/* Vehicle selector */}
          <div className="space-y-4">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
              ◆ Selecione o Veículo
            </p>
            {tiers.map((t) => {
              const isActive = t.id === tier;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  className={`group w-full text-left border transition-all duration-500 p-5 sm:p-6 relative overflow-hidden ${
                    isActive
                      ? "border-gold-royal bg-gold-royal/5 shadow-[0_0_60px_hsl(var(--gold-royal)/0.18)]"
                      : "border-border/30 hover:border-gold-royal/40 bg-card/20"
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute top-0 left-0 w-6 h-px bg-gold-royal" />
                      <div className="absolute top-0 left-0 w-px h-6 bg-gold-royal" />
                      <div className="absolute bottom-0 right-0 w-6 h-px bg-gold-royal" />
                      <div className="absolute bottom-0 right-0 w-px h-6 bg-gold-royal" />
                    </>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl text-foreground mb-1">
                        {t.name}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                        {t.tagline}
                      </p>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full mt-2 transition-all ${
                        isActive
                          ? "bg-gold-bright shadow-[0_0_12px_hsl(var(--gold-bright))]"
                          : "bg-border"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Booking form + telemetry */}
          <div className="luxury-glass border border-gold-royal/30 p-6 sm:p-10 relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-px bg-gold-royal" />
            <div className="absolute top-0 left-0 w-px h-8 bg-gold-royal" />
            <div className="absolute bottom-0 right-0 w-8 h-px bg-gold-royal" />
            <div className="absolute bottom-0 right-0 w-px h-8 bg-gold-royal" />

            {/* Active tier telemetry — Ford Raptor style */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gold-royal/15">
              <div>
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold-royal mb-1">
                  Configuração Activa
                </p>
                <p className="font-display text-xl text-gold-gradient">
                  {active.name}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-right">
                <Telemetry label="Lugares" value={active.seats} />
                <Telemetry label="Autonomia" value={active.range} />
                <Telemetry label="Resposta" value={active.response} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <NeonInput
                label="Local de Recolha"
                value={pickup}
                onChange={setPickup}
                placeholder="Ex: Talatona, Edifício Belas"
                maxLength={120}
              />
              <NeonInput
                label="Destino"
                value={destination}
                onChange={setDestination}
                placeholder="Ex: Aeroporto 4 de Fevereiro"
                maxLength={120}
              />
              <NeonInput
                label="Quando · Opcional"
                value={when}
                onChange={setWhen}
                placeholder="Ex: Hoje 19h30"
                maxLength={40}
              />

              <button
                type="submit"
                className="group relative w-full mt-6 py-4 border border-gold-royal/40 bg-gold-royal/5
                           font-mono text-xs tracking-[0.4em] uppercase text-gold-bright
                           hover:bg-gold-royal/15 hover:border-gold-royal transition-all duration-500
                           overflow-hidden"
              >
                <span className="relative z-[1]">Reservar via WhatsApp ◆ {active.finish}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-royal/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>

              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 text-center pt-2">
                Resposta em {active.response} · 24/7
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-base text-gold-bright leading-tight">
        {value}
      </p>
    </div>
  );
}

function NeonInput({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="group">
      <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="neon-input w-full bg-background/40 border border-gold-royal/25 px-4 py-3
                     font-body text-sm text-foreground placeholder:text-muted-foreground/40
                     focus:outline-none focus:border-gold-royal focus:bg-background/60
                     focus:shadow-[0_0_24px_hsl(var(--gold-royal)/0.35),inset_0_0_12px_hsl(var(--gold-royal)/0.15)]
                     transition-all duration-500 rounded-none"
        />
        {/* Neon corners */}
        <div className="absolute top-0 left-0 w-3 h-px bg-gold-bright opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="absolute top-0 left-0 w-px h-3 bg-gold-bright opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-3 h-px bg-gold-bright opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-px h-3 bg-gold-bright opacity-0 group-focus-within:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
