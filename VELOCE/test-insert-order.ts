import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

const env = loadEnv("development", process.cwd(), "");
const supabaseUrl = env.VITE_SUPABASE_URL || "";
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testTypes() {
  const { data, error } = await supabase.from("products").select("*").limit(1).single();
  console.log("PRODUCT:", typeof data.sizes, Array.isArray(data.sizes));
}

testTypes();
