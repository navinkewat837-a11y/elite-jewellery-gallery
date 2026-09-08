import bpAvif640 from "@/assets/bridal-poster-640.avif.asset.json";
import bpAvif960 from "@/assets/bridal-poster-960.avif.asset.json";
import bpAvif1280 from "@/assets/bridal-poster-1280.avif.asset.json";
import bpWebp640 from "@/assets/bridal-poster-640.webp.asset.json";
import bpWebp960 from "@/assets/bridal-poster-960.webp.asset.json";
import bpWebp1280 from "@/assets/bridal-poster-1280.webp.asset.json";

/**
 * Shared poster metadata: kept in its own tiny module so the route head() can
 * preload the bridal poster without pulling the whole BridalInspiration
 * component (and its video code) into the initial bundle.
 */
export const bridalPosterAvifSrcSet = `${bpAvif640.url} 640w, ${bpAvif960.url} 960w, ${bpAvif1280.url} 1280w`;
export const bridalPosterWebpSrcSet = `${bpWebp640.url} 640w, ${bpWebp960.url} 960w, ${bpWebp1280.url} 1280w`;
export const bridalPosterSizes = "(min-width: 1024px) 50vw, 100vw";
export const bridalPosterAvif640 = bpAvif640.url;
