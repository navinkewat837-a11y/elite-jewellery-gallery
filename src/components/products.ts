import ring from "@/assets/ring.jpg";
import ring2 from "@/assets/ring2.jpg";
import necklaceRealAsset from "@/assets/necklace-real.jpg.asset.json";
const necklace = necklaceRealAsset.url;
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

// Bridal & Silver Anklets — CDN-hosted assets
import ankletSilverGhungroo from "@/assets/anklet-f2db764dad65ea936ae267ae9ab0e9dd.jpg.asset.json";
import ankletSilverMeenakari from "@/assets/anklet-faad645fac31fd91e898abb86443e078.jpg.asset.json";
import ankletRubyFloral from "@/assets/anklet-d3bfee46556acdffbe855a7bdd3a2503.jpg.asset.json";
import ankletSapphirePearl from "@/assets/anklet-be9a04ef08735431a69a7d620939f8fb.jpg.asset.json";
import ankletPinkTassel from "@/assets/anklet-22df28158196f09b7e7ee231a3f92a4c.jpg.asset.json";
import ankletRoseFloret from "@/assets/anklet-243cef3fbcb0b3b38657ef00085eb29f.jpg.asset.json";
import ankletAquaBloom from "@/assets/anklet-6f54f096f45cce26fc5fb242edd4033f.jpg.asset.json";
import ankletTealBarefoot from "@/assets/anklet-37b9ce18c05bf82c666ccf4776c3264f.jpg.asset.json";
import ankletHeavyBridal from "@/assets/anklet-fc975a281d57063872ddbca12dab5f3a.jpg.asset.json";

export type Category = "Rings" | "Necklaces" | "Earrings" | "Bracelets" | "Bangles" | "Anklets";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  weight?: string;
  metal?: string;
}

export const CATEGORIES: Category[] = ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Anklets"];

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

  // ---------- Bridal & Silver Anklets ----------
  { id: "ank1", name: "Ghungroo Cascade Silver Payal", category: "Anklets", price: 18500,
    image: ankletSilverGhungroo.url, isNew: true, metal: "92.5 Sterling Silver",
    weight: "Pair · approx. 145–155 g",
    description: "A timeless pair of hand-crafted sterling silver payal featuring a scalloped jaali border, hand-painted meenakari paisleys and a cascading row of pure-silver ghungroos that chime with every step." },
  { id: "ank2", name: "Rangeeli Meenakari Silver Anklets", category: "Anklets", price: 22500,
    image: ankletSilverMeenakari.url, isNew: true, metal: "92.5 Sterling Silver",
    weight: "Pair · approx. 165–175 g",
    description: "Statement bridal payal in lustrous silver with multicolour stone florals and tiny jhumka drops in ruby, sapphire, emerald and amber — joyful, regal and made for festive aartis and pheras." },
  { id: "ank3", name: "Ruby Blossom Floral Payal", category: "Anklets", price: 26500,
    image: ankletRubyFloral.url, isNew: true, metal: "92.5 Sterling Silver with Ruby Enamel",
    weight: "Pair · approx. 120–135 g",
    description: "Delicate silver chains draped with ruby-red enamel flowers and faceted bead drops — a romantic everyday-bridal pair that flatters every saree, lehenga and silk drape." },
  { id: "ank4", name: "Royal Sapphire & Pearl Bridal Anklet", category: "Anklets", price: 84500,
    image: ankletSapphirePearl.url, isNew: true, metal: "22kt Gold Plated with Sapphires & Pearls",
    weight: "Pair · approx. 95–110 g",
    description: "A regal bridal anklet of sapphire-blue paisleys and pavé crystal scallops, hung with luminous baroque pearls and pink kundan teardrops — couture craftsmanship for the modern maharani." },
  { id: "ank5", name: "Gulaab Pink Tassel Bridal Payal", category: "Anklets", price: 38500,
    image: ankletPinkTassel.url, isNew: true, metal: "22kt Gold Plated with Pink Crystals",
    weight: "Single · approx. 55–65 g",
    description: "A festive payal hand-set with rose-pink crystal florals and a fringe of pink beaded tassels — the perfect statement piece for sangeet, mehendi and reception nights." },
  { id: "ank6", name: "Rose Floret Heritage Anklet", category: "Anklets", price: 46500,
    image: ankletRoseFloret.url, isNew: true, metal: "22kt Gold Plated with CZ & Pink Stones",
    weight: "Single · approx. 70–80 g",
    description: "Layered rose-gold florals studded with brilliant CZ and blush sapphires, finished with pink crystal drops — heirloom workmanship in a wearable, contemporary silhouette." },
  { id: "ank7", name: "Aqua Bloom Diamanté Anklet", category: "Anklets", price: 52500,
    image: ankletAquaBloom.url, isNew: true, metal: "22kt Gold Plated with Aquamarine Drops",
    weight: "Single · approx. 80–90 g",
    description: "An icy-blue floral centrepiece haloed in pavé crystals, with aquamarine teardrops dancing beneath — graceful, glamorous and unmistakably bridal." },
  { id: "ank8", name: "Teal Peacock Barefoot Bridal Set", category: "Anklets", price: 96500,
    image: ankletTealBarefoot.url, isNew: true, metal: "22kt Gold Plated with Emerald-Hue Stones",
    weight: "Single · approx. 110–125 g",
    description: "An elaborate barefoot bridal anklet with toe-ring drape, layered teal-and-gold florals and cascading emerald beads — inspired by Rajputi heritage, made for the showstopping bride." },
  { id: "ank9", name: "Heavy Kundan Bridal Payal (Pair)", category: "Anklets", price: 145000,
    image: ankletHeavyBridal.url, isNew: true, metal: "22kt Gold Plated with Kundan & Polki",
    weight: "Pair · approx. 320–360 g",
    description: "Our heaviest ceremonial payal — multi-layered gold cuffs encrusted with kundan, polki and iridescent stones, finished with rows of gold drops and bells. The ultimate heirloom for the wedding day." },
];
