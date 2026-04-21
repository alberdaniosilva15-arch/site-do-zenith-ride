export default function FooterSection() {
  return (
    <footer className="relative z-[3] py-20 border-t border-border/20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-cinzel-decorative text-2xl text-gold-gradient">ZENITH RIDE</h3>
            <p className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground mt-2 uppercase">
              Luanda, Angola
            </p>
          </div>
          <div className="flex gap-8">
            <span className="font-mono text-xs text-muted-foreground hover:text-gold-royal transition-colors cursor-pointer tracking-wider">
              Instagram
            </span>
            <span className="font-mono text-xs text-muted-foreground hover:text-gold-royal transition-colors cursor-pointer tracking-wider">
              WhatsApp
            </span>
          </div>
        </div>
        <div className="luxury-line mt-10 mb-6" />
        <p className="font-fell text-xs text-center text-muted-foreground/50 tracking-wider italic">
          © {new Date().getFullYear()} Zenith Ride — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
