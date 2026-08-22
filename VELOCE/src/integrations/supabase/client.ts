import { createClient } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  email: string;
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
  cart?: any[];
  wishlist?: string[];
  walletBalance?: number;
};

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL : undefined) ||
  "https://gyxjytykxzivbtmymtek.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_ANON_KEY : undefined) ||
  "sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
