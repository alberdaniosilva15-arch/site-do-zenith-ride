export default function CinematicVideo() {
  const FALLBACK = "/assets/zenith-emblem-loop.mp4";

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <video
        src={FALLBACK}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}