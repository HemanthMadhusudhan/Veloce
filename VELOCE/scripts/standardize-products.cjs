const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const https = require('https');
const http = require('http');

const PRODUCTS_FILE = path.join(__dirname, '..', 'src', 'lib', 'default-products.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'products', 'standardized');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download helper with redirect support
function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('/')) {
      const localPath = path.join(__dirname, '..', 'public', url);
      if (fs.existsSync(localPath)) {
        return resolve(fs.readFileSync(localPath));
      }
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

// Standardize jersey image using Sharp
async function standardizeJersey(inputBuffer, targetSize = 800) {
  try {
    // 1. Get metadata
    const meta = await sharp(inputBuffer).metadata();
    
    // 2. Remove background / trim edges
    let pipeline = sharp(inputBuffer);
    
    // If it's a solid/light background or PNG with alpha, trim it tightly to the jersey content
    let trimmedBuffer;
    try {
      trimmedBuffer = await pipeline
        .trim({ threshold: 20 })
        .toBuffer();
    } catch {
      trimmedBuffer = inputBuffer;
    }

    // 3. Scale jersey to 88% of target size so it has uniform padding
    const innerSize = Math.round(targetSize * 0.90);
    const resizedJersey = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // 4. Center composite onto standard transparent square canvas
    const standardized = await sharp({
      create: {
        width: targetSize,
        height: targetSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: resizedJersey, gravity: 'center' }])
    .webp({ quality: 90 })
    .toBuffer();

    return standardized;
  } catch (err) {
    throw err;
  }
}

async function run() {
  console.log('Loading products from:', PRODUCTS_FILE);
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  console.log(`Found ${products.length} products.`);

  let updatedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.images || p.images.length === 0) continue;

    const primaryImg = p.images[0];
    const cleanId = (p.id || `prod-${i}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const outFilename = `${cleanId}-main.webp`;
    const outPath = path.join(OUTPUT_DIR, outFilename);
    const publicUrl = `/products/standardized/${outFilename}`;

    try {
      process.stdout.write(`[${i + 1}/${products.length}] Processing ${p.name.slice(0, 30)}... `);
      
      const buffer = await downloadBuffer(primaryImg);
      const standardizedBuffer = await standardizeJersey(buffer, 800);
      fs.writeFileSync(outPath, standardizedBuffer);

      p.images[0] = publicUrl;
      updatedCount++;
      console.log('✓ Standardized');
    } catch (err) {
      console.log(`✗ Skipped (${err.message})`);
      failedCount++;
    }
  }

  // Save updated default-products.json
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`\n========================================`);
  console.log(`Batch standardizing complete!`);
  console.log(`Successfully standardized: ${updatedCount} products`);
  console.log(`Skipped / Failed: ${failedCount} products`);
  console.log(`========================================\n`);
}

run();
