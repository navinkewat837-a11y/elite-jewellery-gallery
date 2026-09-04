import { lazy } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LazySection, SectionSkeleton } from "@/components/LazySection";

const LatestArrivals = lazy(() =>
  import("@/components/LatestArrivals").then((m) => ({ default: m.LatestArrivals })),
);
const Collection = lazy(() =>
  import("@/components/Collection").then((m) => ({ default: m.Collection })),
);

import {
  BridalInspiration,
  bridalPosterAvifSrcSet,
  bridalPosterSizes,
} from "@/components/BridalInspiration";
import bpAvif640 from "@/assets/bridal-poster-640.avif.asset.json";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { PRODUCTS, CATEGORIES } from "@/components/products";
import avif640 from "@/assets/hero-poster-640.avif.asset.json";
import avif960 from "@/assets/hero-poster-960.avif.asset.json";
import avif1280 from "@/assets/hero-poster-1280.avif.asset.json";

const SITE_URL = "https://elite-jewellery-gallery.lovable.app";

const productSchemas = PRODUCTS.map((p) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${SITE_URL}/#product-${p.id}`,
  name: p.name,
  description: p.description,
  image: typeof p.image === "string" && p.image.startsWith("http") ? p.image : `${SITE_URL}${p.image}`,
  category: p.category,
  sku: p.id,
  brand: { "@type": "Brand", name: "Elite Jewellery Gallery" },
  ...(p.metal ? { material: p.metal } : {}),
  ...(p.weight ? { weight: p.weight } : {}),
  offers: {
    "@type": "Offer",
    price: p.price,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/#product-${p.id}`,
    seller: { "@type": "JewelryStore", name: "Elite Jewellery Gallery" },
  },
}));

const categoryListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Jewellery Collections",
  itemListElement: CATEGORIES.map((cat, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CollectionPage",
      name: cat,
      url: `${SITE_URL}/#${cat.toLowerCase()}`,
    },
  })),
};

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(
    z.object({
      q: fallback(z.string(), "").default(""),
      category: fallback(z.string(), "All").default("All"),
      min: fallback(z.string(), "").default(""),
      max: fallback(z.string(), "").default(""),
      sort: fallback(z.string(), "default").default("default"),
    }),
  ),
  search: {
    middlewares: [
      stripSearchParams({ q: "", category: "All", min: "", max: "", sort: "default" }),
    ],
  },
  head: () => ({
    meta: [
      { title: "Elite Jewellery Gallery — Timeless Gold & Diamond Jewellery" },
      { name: "description", content: "Hand-crafted rings, necklaces, earrings, bracelets and bangles from Elite Jewellery Gallery, Amlai, Shahdol, Madhya Pradesh. Request a quote on WhatsApp." },
      { property: "og:title", content: "Elite Jewellery Gallery — Timeless Gold & Diamond Jewellery" },
      { property: "og:description", content: "Discover hand-crafted luxury jewellery — rings, necklaces, earrings, bracelets, bangles." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://elite-jewellery-gallery.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://elite-jewellery-gallery.lovable.app/" },
      {
        rel: "preload",
        as: "image",
        href: avif640.url,
        imageSrcSet: `${avif640.url} 640w, ${avif960.url} 960w, ${avif1280.url} 1280w`,
        imageSizes: "100vw",
        type: "image/avif",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: bpAvif640.url,
        imageSrcSet: bridalPosterAvifSrcSet,
        imageSizes: bridalPosterSizes,
        type: "image/avif",
        fetchPriority: "low",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JewelryStore",
          name: "Elite Jewellery Gallery",
          description:
            "Hand-crafted gold and diamond jewellery — rings, necklaces, earrings, bracelets and bangles.",
          url: "https://elite-jewellery-gallery.lovable.app/",
          telephone: "+91-9340263932",
          email: "navinkewat837@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Amlai",
            addressLocality: "Shahdol",
            addressRegion: "Madhya Pradesh",
            postalCode: "484116",
            addressCountry: "IN",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(categoryListSchema),
      },
      ...productSchemas.map((schema) => ({
        type: "application/ld+json" as const,
        children: JSON.stringify(schema),
      })),
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LazySection
          minHeight="80vh"
          fallback={<SectionSkeleton eyebrow="JUST IN" title="Latest Arrivals" cards={3} />}
        >
          <LatestArrivals />
        </LazySection>
        <LazySection
          minHeight="120vh"
          fallback={
            <SectionSkeleton
              eyebrow="OUR COLLECTION"
              title="Curated Masterpieces"
              cards={6}
              tone="cream"
            />
          }
        >
          <Collection />
        </LazySection>

        <BridalInspiration />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
