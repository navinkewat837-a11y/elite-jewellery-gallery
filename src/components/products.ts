import ring from "@/assets/ring.jpg";
import ring2 from "@/assets/ring2.jpg";
import necklace from "@/assets/necklace.jpg";
import necklace2 from "@/assets/necklace2.jpg";
import earrings from "@/assets/earrings.jpg";
import bracelet from "@/assets/bracelet.jpg";
import bangles from "@/assets/bangles.jpg";
import pinkFloralLuxe from "@/assets/pink-floral-luxe-set.jpg";

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
