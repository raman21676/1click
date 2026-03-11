#!/bin/bash
# Run these commands in Terminal to build and install the APK

cd ~/Desktop/1click/android

export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home
export ANDROID_HOME=/Users/kalikali/Library/Android/sdk

# Option 1: If you have Android Studio installed
# Open Android Studio → Open Project → Select ~/Desktop/1click/android
# Build → Generate Signed Bundle/APK → APK
# Use existing keystore: 1click-keystore.jks
# Password: 1click2026

# Option 2: Manual Bubblewrap (requires interactive input)
node ./node_modules/@bubblewrap/cli/bin/bubblewrap.js init \
  --manifest https://1click.live/manifest.json
# Type 'com.games.oneclick' when prompted for Application ID
# Press Enter for all other prompts

node ./node_modules/@bubblewrap/cli/bin/bubblewrap.js build
# Enter password: 1click2026

# Install
adb install app/build/outputs/apk/release/app-release-signed.apk
