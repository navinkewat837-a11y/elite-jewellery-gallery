import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "./products";
import { quoteUrl } from "./contact";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const images = product ? (product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]) : [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIdx(0);
    setLightboxOpen(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose, lightboxOpen]);

  if (!product) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-luxe md:grid-cols-2">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 shadow-soft hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-3 bg-cream p-3 md:h-full md:p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View image fullscreen"
            className="group relative flex-1 overflow-hidden rounded-xl bg-background cursor-zoom-in"
          >
            <img
              key={images[activeIdx]}
              src={images[activeIdx]}
              alt={product.name}
              width={1200}
              height={1200}
              decoding="async"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-64 w-full object-cover transition-opacity duration-300 md:h-full"
            />
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1.5 text-[10px] tracking-luxe text-foreground/80 opacity-0 shadow-soft backdrop-blur transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3 w-3" /> ZOOM
            </span>
          </button>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all md:h-20 md:w-20 ${
                    activeIdx === i
                      ? "border-[var(--gold)] shadow-soft"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto p-8 md:p-10">
          <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
            {product.category.toUpperCase()}
          </span>
          <h3 className="font-serif text-3xl md:text-4xl">{product.name}</h3>
          <p className="font-serif text-3xl text-gradient-gold">{fmt.format(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Metal</span><span>{product.metal ?? "18kt Yellow Gold"}</span>
            </li>
            {product.weight && (
              <li className="flex justify-between border-b border-border py-2">
                <span className="text-muted-foreground">Weight</span><span>{product.weight}</span>
              </li>
            )}
            <li className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Certification</span><span>BIS Hallmarked</span>
            </li>
            <li className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Make</span><span>Hand-finished</span>
            </li>
          </ul>
          <a
            href={quoteUrl(product.name, product.price)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-center text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
          >
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.387.701 4.611 1.905 6.477L4 29l7.7-1.857A11.94 11.94 0 0 0 16.003 27C22.628 27 28 21.627 28 15S22.628 3 16.003 3zm5.49 14.4c-.3-.15-1.78-.879-2.057-.978-.276-.1-.477-.15-.678.15-.2.3-.776.978-.951 1.179-.176.2-.351.225-.652.075-.3-.15-1.27-.469-2.42-1.494-.894-.798-1.498-1.784-1.674-2.084-.176-.3-.019-.462.131-.611.135-.135.3-.351.452-.526.15-.176.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.244-.587-.493-.508-.677-.518l-.577-.01a1.105 1.105 0 0 0-.802.376c-.276.301-1.053 1.029-1.053 2.51s1.078 2.911 1.228 3.112c.15.2 2.122 3.241 5.142 4.546 2.998 1.295 2.998.863 3.539.81.54-.054 1.78-.728 2.032-1.43.252-.701.252-1.302.176-1.43-.075-.125-.276-.2-.577-.351z" />
            </svg>
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
    {lightboxOpen && (
      <Lightbox
        images={images}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        alt={product.name}
        onClose={() => setLightboxOpen(false)}
      />
    )}
    </>
  );
}

function Lightbox({
  images,
  activeIdx,
  setActiveIdx,
  alt,
  onClose,
}: {
  images: string[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  alt: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    reset();
  }, [activeIdx, reset]);

  const prev = useCallback(() => {
    setActiveIdx((activeIdx - 1 + images.length) % images.length);
  }, [activeIdx, images.length, setActiveIdx]);
  const next = useCallback(() => {
    setActiveIdx((activeIdx + 1) % images.length);
  }, [activeIdx, images.length, setActiveIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      else if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
      else if (e.key === "0") reset();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prev, next, reset]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.005;
    setZoom((z) => Math.max(1, Math.min(4, z + delta)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const toggleZoom = () => {
    if (zoom > 1) reset();
    else setZoom(2);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 z-10 rounded-full bg-background/10 p-2.5 text-white backdrop-blur transition hover:bg-background/20"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/10 p-3 text-white backdrop-blur transition hover:bg-background/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/10 p-3 text-white backdrop-blur transition hover:bg-background/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden"
        onWheel={onWheel}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={images[activeIdx]}
          alt={alt}
          draggable={false}
          decoding="async"
          onDoubleClick={toggleZoom}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
            cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in",
            transition: dragRef.current ? "none" : "transform 0.2s ease",
          }}
          className="absolute left-1/2 top-1/2 max-h-[92vh] max-w-[92vw] select-none object-contain"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-background/10 p-1 text-white backdrop-blur">
        <button
          onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
          aria-label="Zoom out"
          disabled={zoom <= 1}
          className="rounded-full p-2 transition hover:bg-background/20 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] text-center text-xs tabular-nums tracking-luxe">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
          aria-label="Zoom in"
          disabled={zoom >= 4}
          className="rounded-full p-2 transition hover:bg-background/20 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
        {images.length > 1 && (
          <span className="ml-2 border-l border-white/20 pl-3 pr-2 text-xs tracking-luxe">
            {activeIdx + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
