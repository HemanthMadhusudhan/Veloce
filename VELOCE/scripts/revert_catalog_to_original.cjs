const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://gyxjytykxzivbtmymtek.supabase.co',
  'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi'
);

async function revertCatalog() {
  console.log("Fetching original products from Supabase...");
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Fetched ${data.length} original products from Supabase.`);

  const localJsonPath = path.join(__dirname, '..', 'src', 'lib', 'default-products.json');
  fs.writeFileSync(localJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved pristine original catalog directly to src/lib/default-products.json!`);
}

revertCatalog();
