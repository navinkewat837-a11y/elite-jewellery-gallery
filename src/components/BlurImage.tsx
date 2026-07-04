import { useState, type ImgHTMLAttributes } from "react";

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
 */
export function BlurImage({
  wrapperClassName = "",
  placeholderClassName = "",
  className = "",
  onLoad,
  ...imgProps
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={`relative block overflow-hidden ${wrapperClassName}`}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 scale-110 bg-cream blur-xl transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        } ${placeholderClassName}`}
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--cream, 40 33% 94%)) 0%, hsl(var(--gold-light, 42 45% 82%) / 0.4) 100%)",
        }}
      />
      <img
        {...imgProps}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`relative transition-opacity duration-700 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </span>
  );
}

export default BlurImage;