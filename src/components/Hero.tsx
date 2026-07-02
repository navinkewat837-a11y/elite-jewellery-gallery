import { useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/hero.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const MAX_AUTO_RETRIES = 5;
  const [muted, setMuted] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const scheduleAutoRetry = () => {
    const v = videoRef.current;
    if (!v) return;
    if (retryCountRef.current >= MAX_AUTO_RETRIES) {
      setRetrying(false);
      setVideoFailed(true);
      return;
    }
    const attempt = retryCountRef.current + 1;
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s (+ small jitter)
    const delay = Math.min(16000, 1000 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250);
    retryCountRef.current = attempt;
    setRetryAttempt(attempt);
    setRetrying(true);
    setVideoFailed(false);
    setLoading(true);
    clearRetryTimer();
    retryTimerRef.current = setTimeout(() => {
      const node = videoRef.current;
      if (!node) return;
      node.load();
      node.muted = true;
      setMuted(true);
      node.play().catch(() => {});
    }, delay);
  };

  useEffect(() => {
    setMounted(true);
    const v = videoRef.current;
    if (!v) return;

    // Show loading only after mount so SSR and client trees match initially
    if (v.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      setLoading(true);
    }

    const onCanPlay = () => {
      setLoading(false);
      setVideoFailed(false);
      setRetrying(false);
      retryCountRef.current = 0;
      setRetryAttempt(0);
      clearRetryTimer();
    };
    const onWaiting = () => setLoading(true);
    const onError = () => {
      setLoading(false);
      // Auto-retry with exponential backoff before surfacing a hard error
      scheduleAutoRetry();
    };

    v.addEventListener("canplaythrough", onCanPlay);
    v.addEventListener("playing", onCanPlay);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("error", onError);

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
      v.removeEventListener("error", onError);
      clearRetryTimer();
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
      {!videoFailed ? (
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
      ) : (
        <img
          src={heroPoster.url}
          alt="Elite Jewellery Gallery — luxury gold and diamond collection"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)]" />

      {/* Loading overlay — only shown client-side after mount to avoid hydration mismatch */}
      {mounted && loading && (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={heroPoster.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--gold-light)]" />
            <span className="text-xs tracking-luxe text-white/80">
              {retrying
                ? `Reconnecting… attempt ${retryAttempt} of ${MAX_AUTO_RETRIES}`
                : "Loading experience…"}
            </span>
          </div>
        </div>
      )}

      {!videoFailed && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute hero video" : "Mute hero video"}
          className="absolute right-4 top-24 z-10 rounded-full bg-black/40 px-4 py-2 text-xs tracking-luxe text-white backdrop-blur-md transition hover:bg-black/60 md:right-8"
        >
          {muted ? "🔇 TAP FOR SOUND" : "🔊 SOUND ON"}
        </button>
      )}
      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-start justify-center px-5 py-24 md:px-10">
        <span className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-1.5 text-[11px] tracking-luxe text-white backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-[var(--gold-light)]" />
          ELITE JEWELLERY GALLERY
        </span>
        <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.05] text-white [text-shadow:0_2px_4px_rgb(0_0_0_/_0.3)] md:text-7xl lg:text-8xl">
          Timeless <span className="italic text-gradient-gold">Elegance</span>,
          <br /> Crafted for You
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/85 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.3)] md:text-lg">
          Shine with Elegance — Discover Our Exclusive Heritage Collection.
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#collection"
            className="w-full rounded-full bg-gradient-gold px-8 py-4 text-center text-sm font-medium tracking-wide text-white shadow-luxe transition-transform hover:scale-[1.03] sm:w-auto"
          >
            View Collection
          </a>
          <a
            href="#contact"
            className="w-full rounded-full border border-white/40 bg-white/10 px-8 py-4 text-center text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto"
          >
            Book Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
