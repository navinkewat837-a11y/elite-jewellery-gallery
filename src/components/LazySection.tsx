import { Suspense, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Defers mounting (and therefore the JS chunk download) of a below-the-fold
 * section until it is near the viewport. Reserves vertical space beforehand
 * so deferring never causes layout shift.
 */
export function LazySection({
  children,
  fallback,
  minHeight = "70vh",
}: {
  children: ReactNode;
  fallback: ReactNode;
  minHeight?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "600px" });

  return (
    <div ref={ref} style={inView ? undefined : { minHeight }}>
      {inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}

/** Lightweight placeholder that mirrors a section heading + card grid. */
export function SectionSkeleton({
  eyebrow,
  title,
  cards = 3,
  tone = "background",
}: {
  eyebrow: string;
  title: string;
  cards?: number;
  tone?: "background" | "cream";
}) {
  const bg = tone === "cream" ? "bg-cream" : "bg-background";
  const cardBg = tone === "cream" ? "bg-background" : "bg-cream";
  const blockBg = tone === "cream" ? "bg-cream" : "bg-muted";

  return (
    <section className={`${bg} py-24 md:py-32`}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">{eyebrow}</span>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">{title}</h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl ${cardBg} shadow-soft`}
              aria-hidden="true"
            >
              <div className={`aspect-square animate-pulse ${blockBg}`} />
              <div className="space-y-3 p-6">
                <div className={`h-6 w-2/3 animate-pulse rounded ${blockBg}`} />
                <div className={`h-4 w-full animate-pulse rounded ${blockBg}`} />
                <div className={`h-8 w-1/3 animate-pulse rounded ${blockBg}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
