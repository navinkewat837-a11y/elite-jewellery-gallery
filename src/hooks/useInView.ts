import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref + boolean that flips to true once the element has entered
 * (or is near) the viewport. Used to defer loading heavy media like video
 * so it never blocks initial render.
 */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { rootMargin: "200px" },
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { ref, inView };
}
