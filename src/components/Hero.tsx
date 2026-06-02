import { useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/hero.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);

    v.addEventListener("canplaythrough", onCanPlay);
    v.addEventListener("playing", onCanPlay);
    v.addEventListener("waiting", onWaiting);

    // Try to play with sound; browsers usually block it and we fall back to muted autoplay.
    v.muted = false;
    v.play()
      .then(() => setMuted(false))
      .catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });

    return () => {
      v.removeEventListener("canplaythrough", onCanPlay);
      v.removeEventListener("playing", onCanPlay);
      v.removeEventListener("waiting", onWaiting);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <video
        ref={videoRef}
        src={heroVideo.url}
        poster={heroPoster.url}
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label="Elite Jewellery Gallery — luxury gold and diamond collection"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)]" />
      {loading && (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={heroPoster.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--gold-light)]" />
            <span className="text-xs tracking-luxe text-white/80">Loading experience…</span>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute hero video" : "Mute hero video"}
        className="absolute right-4 top-24 z-10 rounded-full bg-black/40 px-4 py-2 text-xs tracking-luxe text-white backdrop-blur-md transition hover:bg-black/60 md:right-8"
      >
        {muted ? "🔇 TAP FOR SOUND" : "🔊 SOUND ON"}
      </button>
      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-start justify-center px-5 py-24 md:px-10">
        <span className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-1.5 text-[11px] tracking-luxe text-white backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-[var(--gold-light)]" />
          ELITE JEWELLERY GALLERY
        </span>
        <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.05] text-white md:text-7xl lg:text-8xl">
          Timeless <span className="italic text-gradient-gold">Elegance</span>,
          <br /> Crafted for You
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
          Shine with Elegance — Discover Our Exclusive Heritage Collection.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#collection"
            className="rounded-full bg-gradient-gold px-8 py-4 text-sm font-medium tracking-wide text-white shadow-luxe transition-transform hover:scale-[1.03]"
          >
            View Collection
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Book Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
