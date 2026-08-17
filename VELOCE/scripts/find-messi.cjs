const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gyxjytykxzivbtmymtek.supabase.co',
  'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi'
);

async function findMessi() {
  const { data, error } = await supabase.from('products').select('*').ilike('name', '%Messi%');
  console.log('Found Messi products in Supabase:', data?.map(p => ({ id: p.id, name: p.name, images: p.images })));
}

findMessi();
