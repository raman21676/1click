#!/usr/bin/env node
/**
 * TWA Build Script - Uses Bubblewrap programmatic API
 */

const {Bubblewrap} = require('@bubblewrap/core');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('🚀 Building 1click TWA APK...\n');
  
  const manifestPath = path.join(__dirname, 'twa-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ twa-manifest.json not found!');
    process.exit(1);
  }
  
  console.log('📄 Loading TWA manifest...');
  const twaManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('🔧 Initializing Bubblewrap...');
  const bubblewrap = new Bubblewrap(
    process.env.ANDROID_HOME || '/Users/kalikali/Library/Android/sdk',
    process.env.JAVA_HOME || '/Library/Frameworks/Java.framework/Versions/Current/Home'
  );
  
  try {
    console.log('📦 Building APK...');
    await bubblewrap.build(twaManifest, {
      outputDir: path.join(__dirname, 'app'),
      signingKey: {
        path: path.join(__dirname, '1click-keystore.jks'),
        alias: '1click',
        keystorePassword: '1click2026',
        keyPassword: '1click2026'
      }
    });
    
    console.log('\n✅ Build successful!');
    console.log('📱 APK location: android/app/build/outputs/apk/release/app-release-signed.apk');
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

main();
