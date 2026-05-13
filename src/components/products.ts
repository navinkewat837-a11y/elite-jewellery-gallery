import ring from "@/assets/ring.jpg";
import ring2 from "@/assets/ring2.jpg";
import necklace from "@/assets/necklace.jpg";
import necklace2 from "@/assets/necklace2.jpg";
import earrings from "@/assets/earrings.jpg";
import bracelet from "@/assets/bracelet.jpg";
import bangles from "@/assets/bangles.jpg";
import pinkFloralLuxe from "@/assets/pink-floral-luxe-set.jpg";
import pinkFloralBracelet from "@/assets/pink-floral-bracelet.jpg";
import butterflyTasselEarrings from "@/assets/butterfly-tassel-earrings.jpg";
import iridescentFeatherRing from "@/assets/iridescent-feather-ring.jpg";
import sapphireHaloRing from "@/assets/sapphire-halo-ring.jpg";
import butterflyBloomRing from "@/assets/butterfly-bloom-ring.jpg";

export type Category = "Rings" | "Necklaces" | "Earrings" | "Bracelets" | "Bangles";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
}

export const CATEGORIES: Category[] = ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles"];

export const PRODUCTS: Product[] = [
  { id: "new1", name: "Pink Floral Luxe Set", category: "Necklaces", price: 78500, image: pinkFloralLuxe, isNew: true,
    description: "An exquisite floral-inspired luxe set featuring a blush-pink centre stone surrounded by a halo of brilliant diamonds, complemented by matching earrings — crafted for unforgettable occasions." },
  { id: "new2", name: "Rosé Blossom Tennis Bracelet", category: "Bracelets", price: 89500, image: pinkFloralBracelet, isNew: true,
    description: "A statement tennis bracelet adorned with vivid pink sapphires and pavé diamond florals, set in lustrous rose gold — a romantic heirloom in the making." },
  { id: "new3", name: "Papillon Cascade Earrings", category: "Earrings", price: 32500, image: butterflyTasselEarrings, isNew: true,
    description: "Crystal butterflies take flight with cascading rose-gold tassels and pink sapphire droplets — graceful, weightless, and unforgettable." },
  { id: "new4", name: "Iridescent Feather Solitaire", category: "Rings", price: 1125000, image: iridescentFeatherRing, isNew: true,
    description: "A rare iridescent centre stone framed by sculpted diamond feathers and pastel sapphires — a couture piece for the truly extraordinary." },
  { id: "new5", name: "Royal Sapphire Halo Ring", category: "Rings", price: 215000, image: sapphireHaloRing, isNew: true,
    description: "A regal blue sapphire crowned by a brilliant diamond halo and intricate gold filigree — timeless majesty for every occasion." },
  { id: "new6", name: "Butterfly Bloom Statement Ring", category: "Rings", price: 68500, image: butterflyBloomRing, isNew: true,
    description: "Hand-enamelled butterflies and blossoms entwined in 18kt gold with diamond accents — a wearable garden of romance." },
  { id: "r1", name: "Aurora Halo Ring", category: "Rings", price: 48500, image: ring,
    description: "A radiant halo of pavé diamonds embraces a brilliant centre stone, set in 18kt yellow gold." },
  { id: "r2", name: "Solitaire Étoile", category: "Rings", price: 92000, image: ring2,
    description: "Single solitaire diamond suspended in a four-prong gold setting — the timeless promise." },
  { id: "n1", name: "Marquise Drop Pendant", category: "Necklaces", price: 36000, image: necklace,
    description: "A double-marquise gold pendant cradling a topaz centre, on a fine cable chain." },
  { id: "n2", name: "Triple Layer Charm", category: "Necklaces", price: 28500, image: necklace2,
    description: "Three delicate gold chains layered effortlessly, finished with a soft diamond charm." },
  { id: "e1", name: "Chandelier Diamond Earrings", category: "Earrings", price: 54200, image: earrings,
    description: "Pear-cut diamonds suspended within a gold lattice — graceful with every movement." },
  { id: "b1", name: "Eternity Stone Bangle", category: "Bracelets", price: 41000, image: bracelet,
    description: "A continuous band of bezel-set crystals on hand-finished yellow gold." },
  { id: "bg1", name: "Heritage Filigree Bangles", category: "Bangles", price: 67500, image: bangles,
    description: "Pair of traditional filigree bangles, hand-crafted with intricate granulation work." },
];
