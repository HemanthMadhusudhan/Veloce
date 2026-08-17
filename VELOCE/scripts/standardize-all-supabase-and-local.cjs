const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { processJerseyToTransparentSquare, downloadBuffer } = require('./test-bg-removal.cjs');

const supabase = createClient(
  'https://gyxjytykxzivbtmymtek.supabase.co',
  'sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi'
);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'products', 'standardized');
const LOCAL_JSON = path.join(__dirname, '..', 'src', 'lib', 'default-products.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Fetching all products from Supabase...');
  const { data: dbProducts, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching Supabase products:', error);
  }

  let localProducts = [];
  try {
    localProducts = JSON.parse(fs.readFileSync(LOCAL_JSON, 'utf-8'));
  } catch (e) {
    console.warn('Could not read default-products.json:', e.message);
  }

  // Combine products list by ID
  const productMap = new Map();
  (localProducts || []).forEach((p) => productMap.set(p.id, p));
  (dbProducts || []).forEach((p) => productMap.set(p.id, p));

  const allProducts = Array.from(productMap.values());
  console.log(`Total products to process: ${allProducts.length}`);

  let successCount = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0) continue;

    const cleanId = (p.id || `prod-${i}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const newImages = [];

    process.stdout.write(`[${i + 1}/${allProducts.length}] Processing ${p.name?.slice(0, 30) || cleanId}... `);

    for (let imgIdx = 0; imgIdx < p.images.length; imgIdx++) {
      const srcUrl = p.images[imgIdx];
      if (!srcUrl) continue;

      const outFilename = `${cleanId}-${imgIdx}.webp`;
      const outPath = path.join(OUTPUT_DIR, outFilename);
      const publicUrl = `/products/standardized/${outFilename}`;

      try {
        const buffer = await downloadBuffer(srcUrl);
        const standardizedBuffer = await processJerseyToTransparentSquare(buffer, 800);
        fs.writeFileSync(outPath, standardizedBuffer);
        newImages.push(publicUrl);
      } catch (err) {
        newImages.push(srcUrl);
      }
    }

    if (newImages.length > 0) {
      p.images = newImages;

      // Update in Supabase
      try {
        await supabase
          .from('products')
          .update({ images: newImages })
          .eq('id', p.id);
      } catch (dbErr) {
        console.error(`DB update failed for ${p.id}:`, dbErr.message);
      }

      successCount++;
      console.log(`✓ (${newImages.length} imgs standardized & saved)`);
    }
  }

  // Update default-products.json
  const updatedLocal = localProducts.map((lp) => {
    const matched = productMap.get(lp.id);
    return matched ? { ...lp, images: matched.images } : lp;
  });
  fs.writeFileSync(LOCAL_JSON, JSON.stringify(updatedLocal, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`ALL PRODUCTS STANDARDIZED WITH TRANSPARENT BACKGROUNDS!`);
  console.log(`Successfully processed: ${successCount} products`);
  console.log(`======================================================\n`);
}

run();
