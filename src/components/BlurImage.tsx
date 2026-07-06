import { useCallback, useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Wrapper class — used for aspect ratio / positioning. */
  wrapperClassName?: string;
  /** Placeholder tint shown before the image decodes. */
  placeholderClassName?: string;
};

/**
 * Image with a soft blur-up placeholder. Renders a tinted, blurred
 * layer underneath the real <img> and fades the image in on load so
 * the layout feels instant while bytes are still arriving.
 *
 * If the image fails to load, an elegant fallback is shown so the
 * layout never collapses into a blank space.
 */
export function BlurImage({
  wrapperClassName = "",
  placeholderClassName = "",
  className = "",
  onLoad,
  onError,
  ...imgProps
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Handle cached images: if the browser already decoded the image before
  // React attached the onLoad handler, mark it loaded immediately.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const showFallback = errored;
  const showImage = !errored;
  const hidePlaceholder = loaded && !errored;

  return (
    <span className={`relative block overflow-hidden ${wrapperClassName}`}>
      {/* Blur-up placeholder — visible until the image loads or errors out */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 scale-110 bg-cream blur-xl transition-opacity duration-500 ${
          hidePlaceholder ? "opacity-0" : "opacity-100"
        } ${placeholderClassName}`}
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--cream, 40 33% 94%)) 0%, hsl(var(--gold-light, 42 45% 82%) / 0.4) 100%)",
        }}
      />

      {/* Error fallback — elegant icon + label so the layout never collapses */}
      {showFallback && (
        <span
          aria-label="Image unavailable"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-cream/80 text-[var(--gold-dark)]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-8 w-8 opacity-60"
            aria-hidden="true"
          >
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L11 15.5" />
            <path d="M6 17l2.5-2.5" />
          </svg>
          <span className="text-[10px] tracking-luxe opacity-60">
            IMAGE UNAVAILABLE
          </span>
        </span>
      )}

      {/* Real image */}
      {showImage && (
        <img
          {...imgProps}
          ref={imgRef}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setErrored(true);
            onError?.(e);
          }}
          className={`relative transition-opacity duration-700 ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </span>
  );
}

export default BlurImage;