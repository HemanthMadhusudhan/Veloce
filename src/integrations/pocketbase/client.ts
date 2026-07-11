import PocketBase, { type RecordModel } from "pocketbase";

export type AppUser = RecordModel & {
  email: string;
  verified: boolean;
  role: "user" | "admin";
  disabled: boolean;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

const baseUrl = import.meta.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090";

export const pb = new PocketBase(baseUrl);
pb.autoCancellation(false);

export function currentUser(): AppUser | null {
  return pb.authStore.record as AppUser | null;
}
