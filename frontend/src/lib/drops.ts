export type Drop = {
  id: string;
  name: string;
  eyebrow: string;
  productId: string;
  endsAt: number;
};

const DEFAULT_ENDS = Date.now() + 3 * 86400000 + 4 * 3600000;

export const DEFAULT_DROPS: Drop[] = [
  { id: "blackout-03", name: "Paris Saint-Germain Third", eyebrow: "Blackout Series · Vol. 03", productId: "psg-third", endsAt: DEFAULT_ENDS },
  { id: "legends-senna", name: "Senna · McLaren '88", eyebrow: "Legends · Reissue", productId: "leg-senna-88", endsAt: DEFAULT_ENDS + 4 * 86400000 },
];

export const DROPS_KEY = "veloce.admin.drops.v1";