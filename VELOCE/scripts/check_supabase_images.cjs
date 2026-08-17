const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gyxjytykxzivbtmymtek.supabase.co',
  'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi'
);

async function check() {
  const { data, error } = await supabase.from('products').select('*');
  console.log(`Supabase total products: ${data?.length}`);
  
  // Check Dortmund, AC Milan, Formula 1
  const dortmund = data?.find(p => p.name?.toLowerCase().includes('dortmund'));
  const milan = data?.find(p => p.name?.toLowerCase().includes('milan'));
  const f1 = data?.filter(p => p.category === 'f1' || p.series === 'f1');
  
  console.log('Dortmund:', dortmund?.name, dortmund?.images);
  console.log('Milan:', milan?.name, milan?.images);
  console.log(`F1 products: ${f1?.length}`, f1?.slice(0, 3).map(p => ({ name: p.name, images: p.images })));
}

check();
