const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gyxjytykxzivbtmymtek.supabase.co',
  'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi'
);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Total products in Supabase:', data.length);
  const sample = data.slice(0, 5);
  console.log('Sample product names and images:', sample.map(p => ({ id: p.id, name: p.name, images: p.images })));
}

run();
