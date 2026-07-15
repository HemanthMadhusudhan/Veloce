import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gyxjytykxzivbtmymtek.supabase.co",
  "sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi",
);

async function main() {
  const { data: pData } = await supabase.from("products").select("*").limit(1).single();
  if (pData) {
    console.log("Found product:", pData.id);
    const { data, error } = await supabase
      .from("products")
      .update({ stock: pData.stock })
      .eq("id", pData.id)
      .select();
    console.log("Update result:", data, error);
  } else {
    console.log("No products found");
  }
}

main();
