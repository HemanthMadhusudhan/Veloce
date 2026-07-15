// Responsive image registry.
// Each asset is imported at multiple widths via vite-imagetools and exposed
// as a <Picture>-friendly descriptor: WebP + JPEG srcsets plus the original URL.

import product1Url from "@/assets/product-1.jpg";
import product2Url from "@/assets/product-2.jpg";
import product3Url from "@/assets/product-3.jpg";
import product4Url from "@/assets/product-4.jpg";

import heroUrl from "@/assets/hero-bg.jpg";
import dualFbUrl from "@/assets/dual-football.jpg";
import dualF1Url from "@/assets/dual-f1.jpg";

export type PictureSet = { webp: string; jpg: string; src: string };

export const PICTURES: Record<string, PictureSet> = {
  [product1Url]: { webp: product1Url, jpg: product1Url, src: product1Url },
  [product2Url]: { webp: product2Url, jpg: product2Url, src: product2Url },
  [product3Url]: { webp: product3Url, jpg: product3Url, src: product3Url },
  [product4Url]: { webp: product4Url, jpg: product4Url, src: product4Url },
  [heroUrl]: { webp: heroUrl, jpg: heroUrl, src: heroUrl },
  [dualFbUrl]: { webp: dualFbUrl, jpg: dualFbUrl, src: dualFbUrl },
  [dualF1Url]: { webp: dualF1Url, jpg: dualF1Url, src: dualF1Url },
};

export const HERO_PICTURE = PICTURES[heroUrl];
export const DUAL_FB_PICTURE = PICTURES[dualFbUrl];
export const DUAL_F1_PICTURE = PICTURES[dualF1Url];

export function getPicture(url: string): PictureSet | undefined {
  return PICTURES[url];
}
