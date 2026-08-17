const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const originalJsonStr = execSync('git show 0294114:VELOCE/src/lib/default-products.json', {
  maxBuffer: 50 * 1024 * 1024,
  encoding: 'utf-8'
});

const outPath = path.join(__dirname, 'original_master_catalog.json');
fs.writeFileSync(outPath, originalJsonStr, 'utf-8');
const originalCatalog = JSON.parse(originalJsonStr);
console.log(`Successfully extracted ${originalCatalog.length} original master products from Git commit 0294114!`);
