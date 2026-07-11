const fs = require('fs');
const path = require('path');

try {
  // Find the generated snapshot file dynamically
  const migrationsDir = path.join(__dirname, 'pb_migrations');
  const files = fs.readdirSync(migrationsDir);
  const snapshotFile = files.find(f => f.endsWith('_collections_snapshot.js'));

  if (!snapshotFile) {
    throw new Error('Snapshot migration file not found in pb_migrations.');
  }

  const content = fs.readFileSync(path.join(migrationsDir, snapshotFile), 'utf8');
  const startIdx = content.indexOf('const snapshot = [');
  const endIdx = content.lastIndexOf('];');

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Failed to find snapshot array inside migration file.');
  }

  const arrayStr = content.substring(startIdx + 'const snapshot = '.length, endIdx + 1);
  const data = JSON.parse(arrayStr);

  // Write schema.json
  fs.writeFileSync(path.join(__dirname, 'pb_schema.json'), JSON.stringify(data, null, 2));
  console.log('Successfully generated pb_schema.json containing your database collections schema!');
} catch (err) {
  console.error('Error generating schema:', err.message);
  process.exit(1);
}
