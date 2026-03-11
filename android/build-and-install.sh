#!/bin/bash
# Build and install 1click APK
set -e

echo "=========================================="
echo "🚀 Building 1click APK"
echo "=========================================="

cd ~/Desktop/1click/android

export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home
export ANDROID_HOME=/Users/kalikali/Library/Android/sdk

# Step 1: Initialize with all defaults
echo ""
echo "Step 1/3: Initializing TWA project..."
echo "----------------------------------------"

# Create input file
 cat > /tmp/inputs.txt << 'INPUTS'




com.games.oneclick




















INPUTS

# Run init with automated inputs
if [ ! -d "app/build" ]; then
    script -q /dev/null -c "node ./node_modules/@bubblewrap/cli/bin/bubblewrap.js init --manifest https://1click.live/manifest.json" < /tmp/inputs.txt || true
fi

# Step 2: Build
echo ""
echo "Step 2/3: Building APK..."
echo "----------------------------------------"

cat > /tmp/build-inputs.txt << 'BUILDINPUTS'
1click2026
1click2026
BUILDINPUTS

script -q /dev/null -c "node ./node_modules/@bubblewrap/cli/bin/bubblewrap.js build" < /tmp/build-inputs.txt || true

# Step 3: Install
echo ""
echo "Step 3/3: Installing on device..."
echo "----------------------------------------"

APK_PATH="app/build/outputs/apk/release/app-release-signed.apk"
if [ -f "$APK_PATH" ]; then
    adb install -r "$APK_PATH"
    echo ""
    echo "✅ APK installed successfully!"
else
    echo "❌ APK not found at $APK_PATH"
    echo "Trying to find APK..."
    find app -name "*.apk" 2>/dev/null | head -5
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 DONE! App installed on your device!"
echo "=========================================="
