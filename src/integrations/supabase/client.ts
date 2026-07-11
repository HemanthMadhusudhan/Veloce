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
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
