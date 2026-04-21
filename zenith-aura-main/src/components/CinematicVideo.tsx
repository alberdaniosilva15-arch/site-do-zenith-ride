import MuxPlayer from "@mux/mux-player-react";

const MUX_ID = "UlFZ3j8Qko012KzMTsY013Y902EioY1mgzIZk2gU438tVU";
const FALLBACK = "/assets/zenith-emblem-loop.mp4";

export default function CinematicVideo() {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <MuxPlayer
        playbackId={MUX_ID}
        streamType="on-demand"
        muted
        loop
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
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