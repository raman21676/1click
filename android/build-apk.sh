#!/bin/bash
# 1click Games - TWA APK Build Script
# This script builds the Android APK using Bubblewrap

set -e

echo "=========================================="
echo "🚀 1click Games - APK Build Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed. Please install Java JDK 11 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Java found: $(java -version 2>&1 | head -1)${NC}"

# Install Bubblewrap CLI if not already installed
if [ ! -d "node_modules/@bubblewrap/cli" ]; then
    echo ""
    echo "📦 Installing Bubblewrap CLI..."
    npm install @bubblewrap/cli
fi

echo -e "${GREEN}✅ Bubblewrap CLI installed${NC}"

# Check if twa-manifest.json exists
if [ ! -f "twa-manifest.json" ]; then
    echo -e "${RED}❌ twa-manifest.json not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ TWA manifest found${NC}"

# Check if keystore exists
if [ ! -f "1click-keystore.jks" ]; then
    echo -e "${YELLOW}⚠️ Keystore not found. Generating new keystore...${NC}"
    keytool -genkey -v \
        -keystore 1click-keystore.jks \
        -alias 1click \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass 1click2026 \
        -keypass 1click2026 \
        -dname "CN=1click Games, OU=Gaming, O=1click, L=Kathmandu, ST=Bagmati, C=NP"
    echo -e "${GREEN}✅ Keystore generated${NC}"
fi

echo -e "${GREEN}✅ Keystore found${NC}"

echo ""
echo "=========================================="
echo "🔨 Building APK..."
echo "=========================================="
echo ""

# Build the APK
# Note: This may prompt for JDK installation on first run
echo "Running Bubblewrap build..."
echo "(If prompted about JDK installation, press 'y' to install automatically)"
echo ""

node ./node_modules/@bubblewrap/cli/bin/bubblewrap.js build \
    --skipSigning \
    2>&1 || true

# Check if APK was generated
if ls *.apk 1> /dev/null 2>&1; then
    echo ""
    echo "=========================================="
    echo -e "${GREEN}🎉 APK Build Successful!${NC}"
    echo "=========================================="
    echo ""
    ls -lh *.apk
    echo ""
    echo "📱 To install on your Android device:"
    echo "   1. Enable 'Developer Options' on your phone"
    echo "   2. Enable 'USB Debugging'"
    echo "   3. Connect phone via USB"
    echo "   4. Run: adb install <apk-file>"
    echo ""
    echo "📤 To publish on Play Store:"
    echo "   1. Go to https://play.google.com/console"
    echo "   2. Create new app"
    echo "   3. Upload the signed APK"
    echo ""
else
    echo ""
    echo -e "${YELLOW}⚠️ APK not found. Build may have failed.${NC}"
    echo "Check the error messages above."
    echo ""
    echo "Common fixes:"
    echo "   1. Run: ./node_modules/.bin/bubblewrap doctor"
    echo "   2. Install Android SDK if prompted"
    echo "   3. Ensure JAVA_HOME is set correctly"
    exit 1
fi
