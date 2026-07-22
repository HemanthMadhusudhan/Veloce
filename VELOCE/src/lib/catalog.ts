import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export type Category = "football" | "f1" | "worldcup" | "basketball" | "cricket";
export type Series = "legends";
export type Zone = "messi" | "ronaldo" | "verstappen" | "hamilton";

export type Product = {
  id: string;
  name: string;
  category: Category;
  series?: Series;
  zone?: Zone;
  team: string;
  driver?: string;
  player?: string;
  tag: string;
  price: number;
  compareAt?: number;
  badge?: string;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  material: string;
  rating: number;
  reviews: number;
  stock: number;
  stockBySize?: Record<string, number>;
  hasVideo?: boolean;
  has360?: boolean;
};

const IMG_A = [product2, product4, product1, product3];
const IMG_B = [product1, product3, product2, product4];
const IMG_C = [product3, product1, product4, product2];
const IMG_D = [product4, product2, product3, product1];

export const PRODUCTS: Product[] = [];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
export const TEAMS = Array.from(new Set(PRODUCTS.map((p) => p.team))).sort();
export const DRIVERS = Array.from(
  new Set(PRODUCTS.map((p) => p.driver).filter(Boolean) as string[]),
).sort();
export const TRENDING = [
  "Ferrari 2025 Team Kit",
  "Real Madrid Home",
  "Verstappen Cap",
  "McLaren Papaya",
  "PSG Blackout",
];

export const ZONES: { slug: Zone; name: string; tagline: string; category: "football" | "f1" }[] = [
  { slug: "messi", name: "Leo Messi", tagline: "El Capitán · #10", category: "football" },
  { slug: "ronaldo", name: "Cristiano Ronaldo", tagline: "Siuu · #7", category: "football" },
  { slug: "verstappen", name: "Max Verstappen", tagline: "Simply Lovely · #1", category: "f1" },
  { slug: "hamilton", name: "Lewis Hamilton", tagline: "Still We Rise · #44", category: "f1" },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  football: "Football",
  f1: "Formula 1",
  worldcup: "World Cup",
  basketball: "Basketball",
  cricket: "Cricket",
};
