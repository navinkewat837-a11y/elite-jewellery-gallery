import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LatestArrivals } from "@/components/LatestArrivals";
import { Collection } from "@/components/Collection";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite Jewellery Gallery — Timeless Gold & Diamond Jewellery" },
      { name: "description", content: "Hand-crafted rings, necklaces, earrings, bracelets and bangles from Elite Jewellery Gallery, Amlai, Shahdol, Madhya Pradesh. Request a quote on WhatsApp." },
      { property: "og:title", content: "Elite Jewellery Gallery — Timeless Gold & Diamond Jewellery" },
      { property: "og:description", content: "Discover hand-crafted luxury jewellery — rings, necklaces, earrings, bracelets, bangles." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap",
      },
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
        <LatestArrivals />
        <Collection />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
