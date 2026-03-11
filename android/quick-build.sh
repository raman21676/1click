#!/bin/bash
# Quick build script for 1click TWA APK
# This script automates the bubblewrap init and build process

set -e

echo "=========================================="
echo "🚀 1click Games - Quick APK Builder"
echo "=========================================="
echo ""

# Set environment variables
export JAVA_HOME=${JAVA_HOME:-/Library/Frameworks/Java.framework/Versions/Current/Home}
export ANDROID_HOME=${ANDROID_HOME:-/Users/kalikali/Library/Android/sdk}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create input file with all the answers
cat > /tmp/bw-input.txt << 'INPUTEOF'
1click.live
/
1click Games
1click
com.clickgames.twa
1click
#0f172a
#0f172a
Y
n
n
/
https://1click.live/src/assets/images/icon-512x512.png
https://1click.live/src/assets/images/icon-512x512-maskable.png

300
1.0.0
1
21
portrait
standalone
https://1click.live/
Y
n
n
INPUTEOF

echo "🔧 Initializing TWA project..."
echo "(This may take a few minutes on first run)"
echo ""

# Run init with automated input
if [ ! -d "app" ]; then
    ./node_modules/.bin/bubblewrap init --manifest https://1click.live/manifest.json < /tmp/bw-input.txt || {
        echo ""
        echo "⚠️  Init may have completed with warnings. Checking for app directory..."
    }
fi

# Check if app directory was created
if [ ! -d "app" ]; then
    echo ""
    echo "❌ App directory not created. Trying alternative method..."
    echo ""
    echo "Please run manually:"
    echo "  ./node_modules/.bin/bubblewrap init --manifest https://1click.live/manifest.json"
    echo ""
    exit 1
fi

echo ""
echo "🔨 Building APK..."
echo ""

# Create build input with passwords
cat > /tmp/bw-build-input.txt << 'BUILDEOF'
1click2026
1click2026
BUILDEOF

# Run build with automated password input
./node_modules/.bin/bubblewrap build < /tmp/bw-build-input.txt || {
    echo ""
    echo "⚠️  Build may need manual password entry. Trying without input..."
    ./node_modules/.bin/bubblewrap build
}

# Check if APK was created
APK_PATH="app/build/outputs/apk/release/app-release-signed.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "=========================================="
    echo "🎉 SUCCESS! APK Built Successfully!"
    echo "=========================================="
    echo ""
    echo "📱 APK Location: $APK_PATH"
    ls -lh "$APK_PATH"
    echo ""
    echo "🔐 Keystore: 1click-keystore.jks"
    echo "   Password: 1click2026"
    echo ""
    echo "📲 To install on device:"
    echo "   adb install $APK_PATH"
    echo ""
else
    echo ""
    echo "⚠️  APK not found at expected location."
    echo "Check the build output above for errors."
    echo ""
    # Try to find the APK
    find app -name "*.apk" 2>/dev/null | head -5
    exit 1
fi

# Cleanup
rm -f /tmp/bw-input.txt /tmp/bw-build-input.txt
