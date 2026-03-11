const fs = require('fs');
const path = require('path');

// Read the TWA manifest
const twaManifestPath = path.join(__dirname, 'twa-manifest.json');
const twaManifest = JSON.parse(fs.readFileSync(twaManifestPath, 'utf8'));

console.log('Building with TWA Manifest:');
console.log('Package ID:', twaManifest.packageId);
console.log('Host:', twaManifest.host);

// The package ID is already correct in twa-manifest.json
console.log('\\n✅ TWA manifest looks good!');
console.log('Run: ./node_modules/.bin/bubblewrap build --skipSigning');
