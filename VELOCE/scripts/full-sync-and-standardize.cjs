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

  // Create combined map of ALL products by id
  const productMap = new Map();
  (localProducts || []).forEach((p) => productMap.set(p.id, p));
  (dbProducts || []).forEach((p) => {
    const existing = productMap.get(p.id);
    if (!existing) {
      productMap.set(p.id, {
        id: p.id,
        created_at: p.created_at,
        name: p.name,
        category: p.category,
        series: p.series,
        zone: p.zone,
        team: p.team,
        driver: p.driver,
        tag: p.tag,
        price: Number(p.price),
        compare_at: p.compare_at ? Number(p.compare_at) : undefined,
        badge: p.badge,
        colors: p.colors || ['Default'],
        sizes: p.sizes || ['S', 'M', 'L', 'XL'],
        images: p.images || [],
        description: p.description,
        material: p.material || 'Premium cotton',
        rating: Number(p.rating || 4.8),
        reviews: Number(p.reviews || 20),
        stock: Number(p.stock || 10),
        has_video: p.has_video || false,
        has_360: p.has_360 || false,
        stock_by_size: p.stock_by_size || { S: 2, M: 3, L: 3, XL: 2 }
      });
    }
  });

  const allProducts = Array.from(productMap.values());
  console.log(`Total complete catalog size: ${allProducts.length} products`);

  let count = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0) continue;

    const cleanId = (p.id || `prod-${i}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const newImages = [];

    process.stdout.write(`[${i + 1}/${allProducts.length}] ${p.name?.slice(0, 30) || cleanId}... `);

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
      count++;
      console.log(`✓ (${newImages.length} images standardized)`);
    }
  }

  // Save the full 314 products to default-products.json
  fs.writeFileSync(LOCAL_JSON, JSON.stringify(allProducts, null, 2), 'utf-8');
  console.log(`\n======================================================`);
  console.log(`SAVED ALL ${allProducts.length} PRODUCTS TO default-products.json!`);
  console.log(`======================================================\n`);
}

run();
