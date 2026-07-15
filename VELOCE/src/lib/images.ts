// Responsive image registry.
// Each asset is imported at multiple widths via vite-imagetools and exposed
// as a <Picture>-friendly descriptor: WebP + JPEG srcsets plus the original URL.

import product1Webp from "@/assets/product-1.jpg?format=webp&w=400;800;1200&as=srcset";
import product1Jpg from "@/assets/product-1.jpg?format=jpg&w=400;800;1200&as=srcset";
import product1Src from "@/assets/product-1.jpg";

import product2Webp from "@/assets/product-2.jpg?format=webp&w=400;800;1200&as=srcset";
import product2Jpg from "@/assets/product-2.jpg?format=jpg&w=400;800;1200&as=srcset";
import product2Src from "@/assets/product-2.jpg";

import product3Webp from "@/assets/product-3.jpg?format=webp&w=400;800;1200&as=srcset";
import product3Jpg from "@/assets/product-3.jpg?format=jpg&w=400;800;1200&as=srcset";
import product3Src from "@/assets/product-3.jpg";

import product4Webp from "@/assets/product-4.jpg?format=webp&w=400;800;1200&as=srcset";
import product4Jpg from "@/assets/product-4.jpg?format=jpg&w=400;800;1200&as=srcset";
import product4Src from "@/assets/product-4.jpg";

import heroWebp from "@/assets/hero-bg.jpg?format=webp&w=600;1200;1920&as=srcset";
import heroJpg from "@/assets/hero-bg.jpg?format=jpg&w=600;1200;1920&as=srcset";
import heroSrc from "@/assets/hero-bg.jpg";

import dualFbWebp from "@/assets/dual-football.jpg?format=webp&w=400;800;1200&as=srcset";
import dualFbJpg from "@/assets/dual-football.jpg?format=jpg&w=400;800;1200&as=srcset";
import dualFbSrc from "@/assets/dual-football.jpg";

import dualF1Webp from "@/assets/dual-f1.jpg?format=webp&w=400;800;1200&as=srcset";
import dualF1Jpg from "@/assets/dual-f1.jpg?format=jpg&w=400;800;1200&as=srcset";
import dualF1Src from "@/assets/dual-f1.jpg";

export type PictureSet = { webp: string; jpg: string; src: string };

export const PICTURES: Record<string, PictureSet> = {
  [product1Src]: { webp: product1Webp, jpg: product1Jpg, src: product1Src },
  [product2Src]: { webp: product2Webp, jpg: product2Jpg, src: product2Src },
  [product3Src]: { webp: product3Webp, jpg: product3Jpg, src: product3Src },
  [product4Src]: { webp: product4Webp, jpg: product4Jpg, src: product4Src },
  [heroSrc]: { webp: heroWebp, jpg: heroJpg, src: heroSrc },
  [dualFbSrc]: { webp: dualFbWebp, jpg: dualFbJpg, src: dualFbSrc },
  [dualF1Src]: { webp: dualF1Webp, jpg: dualF1Jpg, src: dualF1Src },
};

export const HERO_PICTURE = PICTURES[heroSrc];
export const DUAL_FB_PICTURE = PICTURES[dualFbSrc];
export const DUAL_F1_PICTURE = PICTURES[dualF1Src];

export function getPicture(url: string): PictureSet | undefined {
  return PICTURES[url];
}
