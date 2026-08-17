const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gyxjytykxzivbtmymtek.supabase.co',
  'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi'
);

async function findArsenal() {
  const { data, error } = await supabase.from('products').select('*').ilike('name', '%Arsenal%');
  console.log('Found Arsenal products in Supabase:', data?.map(p => ({ id: p.id, name: p.name, images: p.images })));
}

findArsenal();
