# 📱 1click Android App - Complete Guide

> Everything you need to build, test, and publish the 1click Android APK

---

## 🎯 Overview

Your 1click website is now **TWA-ready**! This guide will help you build the Android APK using **Trusted Web Activity (TWA)** - a Google-approved technology that wraps your PWA into a real Android app.

### Why TWA?

| Feature | TWA Benefit |
|---------|-------------|
| **Auto-updates** | App updates when you update the website |
| **Offline play** | Service Worker caches all games |
| **Play Store ready** | Real APK, not a WebView wrapper |
| **Small size** | ~50KB shell + your website content |
| **AdSense ready** | Will work when you add it later |

---

## ✅ What's Already Done

### Phase 1: PWA Compliance ✅

| Task | Status | Details |
|------|--------|---------|
| PWA Icons | ✅ | 8 sizes from 72x72 to 512x512 |
| Screenshots | ✅ | Wide (1280x720) & Narrow (750x1334) |
| Game Icons | ✅ | Ludo, Chess, Snake & Ladder shortcuts |
| Service Worker | ✅ | Caches all 9 games for offline play |
| Manifest | ✅ | Already configured |

### Phase 2: TWA Setup ✅

| Task | Status | Details |
|------|--------|---------|
| Android Keystore | ✅ | `android/1click-keystore.jks` |
| SHA-256 Fingerprint | ✅ | Added to assetlinks.json |
| Asset Links | ✅ | `/.well-known/assetlinks.json` |
| TWA Config | ✅ | `android/twa-manifest.json` |

---

## 🛠️ Building the APK

### Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Java JDK** (11 or higher) - [Download](https://adoptium.net/)
3. **Android device** for testing (optional but recommended)

### Build Steps

#### Option 1: Automated Script (Recommended)

```bash
cd android
chmod +x build-apk.sh
./build-apk.sh
```

#### Option 2: Manual Build

```bash
# 1. Navigate to android folder
cd android

# 2. Install dependencies (if not already done)
npm install

# 3. Run Bubblewrap build
# (First run will prompt for JDK installation - press 'y')
./node_modules/.bin/bubblewrap build
```

### Expected Output

After successful build, you'll see:
```
🎉 APK Build Successful!

app-release-signed.apk    (2.5 MB)
app-release-unsigned.apk  (2.5 MB)
```

---

## 🔑 Critical: Save Your Keystore!

**⚠️ WARNING: If you lose `android/1click-keystore.jks`, you can NEVER update your app on Play Store!**

### Backup Instructions

1. **Copy to secure locations:**
   ```bash
   # Copy to Google Drive, Dropbox, etc.
   cp android/1click-keystore.jks ~/Google\ Drive/1click-backup/
   
   # Copy to USB drive
   cp android/1click-keystore.jks /Volumes/USB/1click/
   ```

2. **Save these details in a password manager:**
   - Keystore file: `1click-keystore.jks`
   - Keystore password: `1click2026`
   - Key alias: `1click`
   - Key password: `1click2026`

---

## 📱 Testing the APK

### Method 1: Direct Install (USB)

```bash
# Enable Developer Options on your phone
# Settings > About > Tap "Build Number" 7 times

# Enable USB Debugging
# Settings > Developer Options > USB Debugging

# Connect phone and install
adb install app-release-signed.apk
```

### Method 2: Email/Download

1. Email the APK to yourself
2. Open email on Android device
3. Download and tap to install
4. Allow "Install from unknown sources" when prompted

### Testing Checklist

- [ ] App installs successfully
- [ ] App icon appears in launcher
- [ ] All 9 games load
- [ ] **Offline test:** Enable Airplane Mode → Open app → Games still work
- [ ] Back button works properly
- [ ] No browser address bar visible (proves TWA is working)

---

## 🚀 Publishing to Play Store

### Step 1: Create Play Store Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete developer profile

### Step 2: Create App Listing

**App Details:**
- App name: `1click Games`
- Default language: English
- App category: Games > Casual

**Store Listing Assets Needed:**

| Asset | Size | Source |
|-------|------|--------|
| App icon | 512x512 | `src/assets/images/icon-512x512.png` |
| Feature graphic | 1024x500 | Create in Canva |
| Screenshots | Various | Take from device |
| Short description | 80 chars | "Play 9+ free games offline! Ludo, Chess, Snake & Ladder & more." |
| Full description | 4000 chars | See template below |

### Full Description Template

```
🎮 1click Games - Free Mini Games Collection

Play 9+ free games instantly! No download, no waiting - just click and play.

GAMES INCLUDED:
🎲 Ludo - Classic board game with AI
♟️ Chess - Play vs computer (3 difficulties)  
🐍 Snake & Ladder - Fun for all ages
🐅 Baagchal - Traditional Nepali game
🎯 Carrom - Physics-based board game
🔢 Sudoku - Number puzzle (4 difficulties)
🐍 Snake - Retro arcade game
❌ Tic-Tac-Toe - X and O with AI
🍾 Truth or Dare - Party game

✨ FEATURES:
✅ Works OFFLINE - play without internet
✅ No ads (we're planning to add optional ads later)
✅ Completely FREE
✅ Mobile optimized
✅ Regular updates with new games

Perfect for:
• Killing time on commute
• Playing with friends and family
• Quick gaming sessions
• Offline entertainment

Download now and start playing!
```

### Step 3: Upload APK

1. Go to Play Console > Your App > Production
2. Click "Create new release"
3. Upload `app-release-signed.apk`
4. Add release notes: "Initial release - 9 free games"
5. Save and publish

### Step 4: Wait for Review

- New apps: 1-3 days review time
- Updates: Few hours

---

## 📊 App Signing (Important!)

Google Play now requires **App Signing by Google Play**. During upload:

1. Choose "Use existing app signing key"
2. Upload your keystore: `android/1click-keystore.jks`
3. Enter passwords:
   - Keystore: `1click2026`
   - Key: `1click2026`

---

## 🔧 Troubleshooting

### Build Errors

**Error: "JDK not found"**
```bash
# macOS (using Homebrew)
brew install openjdk@11

# Or download from https://adoptium.net/
```

**Error: "Android SDK not found"**
```bash
# Let Bubblewrap install it automatically (press 'y' when prompted)
# Or install Android Studio for full SDK
```

### App Shows Browser Address Bar

This means **Digital Asset Links** aren't working:

1. Verify `assetlinks.json` is deployed: `https://1click.live/.well-known/assetlinks.json`
2. Check SHA-256 fingerprint matches your keystore
3. Ensure `https://1click.live/manifest.json` is accessible

### Games Don't Work Offline

1. Open DevTools in Chrome on Android
2. Check Application > Service Workers
3. Verify all games are cached
4. Check Console for errors

---

## 📁 File Structure

```
1click/
├── .well-known/
│   └── assetlinks.json          # Links website to app
├── android/
│   ├── 1click-keystore.jks      # 🔐 BACKUP THIS FILE!
│   ├── twa-manifest.json        # TWA configuration
│   ├── build-apk.sh             # Build script
│   └── ...
├── src/assets/images/
│   ├── icon-72x72.png           # PWA icons
│   ├── icon-96x96.png
│   ├── ...
│   ├── screenshot-wide.png      # Store screenshots
│   └── screenshot-narrow.png
└── sw.js                        # Service Worker (offline support)
```

---

## 🎓 Understanding Auto-Updates

Here's the magic: **Your APK is just a shell!**

```
APK Contents:
├── Chrome WebView (50KB)
├── TWA Wrapper (100KB)
└── Config: "Load https://1click.live"
```

When users open the app:
1. TWA launches Chrome in fullscreen
2. Loads your website from cache
3. If online, checks for updates
4. Service Worker updates game files automatically

**Result:** When you add AdSense, fix bugs, or add new games - the app updates automatically!

---

## 💰 Adding AdSense Later

When you're ready for monetization:

1. Add AdSense code to `index.html` on your website
2. Deploy to GitHub Pages
3. Within 24 hours, ads appear in the app automatically
4. No APK update needed!

---

## 📞 Support

If you encounter issues:

1. Check [Bubblewrap documentation](https://github.com/GoogleChromeLabs/bubblewrap)
2. Review [TWA documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
3. File issue on [1click GitHub](https://github.com/Raman21676/1click/issues)

---

## ✅ Final Checklist Before Play Store

- [ ] All 9 games tested and working
- [ ] Offline mode tested (Airplane Mode)
- [ ] Keystore backed up in 3+ locations
- [ ] Screenshots taken on real device
- [ ] Feature graphic created
- [ ] Privacy policy page exists
- [ ] App description written
- [ ] APK file size under 10MB
- [ ] No browser address bar visible

---

**Good luck with your app launch! 🚀**

Last Updated: March 2026
