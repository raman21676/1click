# 1Click Games - TWA Android App - Project Summary for New AI Agent

## Project Overview
**1Click Games** is a web-based gaming platform at `https://1click.live` that offers instant-play mini games. The project is being converted into a Trusted Web Activity (TWA) Android app.

### Key Components
- **Website**: PWA at 1click.live with games like Ludo, Chess, etc.
- **TWA Android App**: Package `com.games.oneclick` (signed APK built)
- **GitHub Repo**: Connected to GitHub Pages for hosting

---

## Current Status (As of Last Session)

### ✅ COMPLETED
1. **TWA APK Built Successfully**
   - Signed APK: `android/app/build/outputs/apk/release/app-release.apk` (418KB)
   - Package: `com.games.oneclick`
   - Keystore: `android/1click-keystore.jks` (password: 1click2026, alias: 1click)
   - Installed on device and launches successfully

2. **Digital Asset Links Setup**
   - `/.well-known/assetlinks.json` deployed on GitHub Pages
   - SHA-256 fingerprint: `99:84:28:32:80:72:A1:D7:FF:C0:E1:8E:B2:61:13:A1:EC:FB:95:E3:BC:F8:71:03:8C:70:BD:60:1B:D4:D8:84`
   - Content-Type: `application/json` (correct)

3. **Main App Page Scrolling**: Working - can scroll through game cards

### ⚠️ PENDING ISSUES

#### Issue #1: URL Bar Still Visible in TWA
**Problem**: The address bar shows `https://1click.live` at the top of the app.

**Root Cause**: Digital Asset Links verification not completing. This could be due to:
- Old Chrome version on test device (Chrome 61 from ~2017)
- Verification cache not cleared
- TWA provider not finding matching assetlinks

**Log Evidence**:
```
TWAProviderPicker: Found no TWA providers, using first Custom Tabs provider: com.android.chrome
```

**Potential Fixes**:
1. Update Chrome on device to v72+ (better TWA support)
2. Try clearing Chrome data: `adb shell pm clear com.android.chrome` (may need root)
3. Rebuild APK with different signing config
4. Test on different device with newer Chrome

**Note**: App is functional despite URL bar - users can play games.

---

#### Issue #2: Ludo Game Setup Screen - SCROLLING NOT WORKING (CRITICAL)
**Problem**: User cannot scroll up/down in Ludo game setup screen.

**What Was Tried**:
1. Changed body CSS from `overflow:hidden` to `overflow-y:auto`
2. Added `game-active` class to body when game starts (to disable scrolling during gameplay)
3. Added `touch-action:pan-y` to body and setup screen
4. Changed setup-screen from `justify-content:center` to `justify-content:flex-start`
5. Wrapped setup content in `setup-screen-content` div with auto margins

**Files Modified**:
- `/src/games/ludo/index.html` - CSS and structure changes

**Current CSS in ludo/index.html**:
```css
/* Body styles */
html,body{min-height:100%;font-family:'Segoe UI',Arial,sans-serif;
  background:radial-gradient(ellipse at center,#283593 0%,#1a237e 50%,#0d1b6e 100%);
  color:#fff;overflow-x:hidden}
body{overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y}
body.game-active{overflow:hidden;touch-action:none}

/* Setup screen */
.setup-screen{position:fixed;inset:0;
  background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display:flex;flex-direction:column;align-items:center;
  justify-content:flex-start;padding:20px;z-index:100;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.setup-screen *{touch-action:pan-y}
.setup-screen-content{margin-top:auto;margin-bottom:auto}
```

**What Still Needs Investigation**:
- The issue might be specific to Chrome Custom Tabs in TWA
- Touch events might be captured by the TWA wrapper
- May need JavaScript-based scrolling solution
- Could be a viewport/meta tag issue

**Test Method**:
```bash
# Launch app
adb shell am start -n com.games.oneclick/com.google.androidbrowserhelper.trusted.LauncherActivity
# Navigate to Ludo game
# Try scrolling on the setup screen
```

---

## Project Structure

### Important Files
| File | Purpose |
|------|---------|
| `/.well-known/assetlinks.json` | Digital Asset Links for TWA verification |
| `/android/app/build.gradle` | Android app build config |
| `/android/app/src/main/AndroidManifest.xml` | App manifest with TWA config |
| `/android/app/src/main/java/com/games/oneclick/MainActivity.java` | Launcher activity |
| `/src/games/ludo/index.html` | Ludo game (current issue) |
| `/index.html` | Main website homepage |
| `/manifest.json` | PWA manifest |

### Build System
- **Gradle**: 8.10 (manual install at `/tmp/gradle-8.10`)
- **JDK**: Java 17 (Temurin-17.0.9+9 at `/tmp/jdk-17.0.9+9`)
- **Android SDK**: `/Users/kalikali/Library/Android/sdk`
- **Min SDK**: 21, **Target SDK**: 33

### Build Commands
```bash
cd android
export JAVA_HOME=/tmp/jdk-17.0.9+9/Contents/Home
export ANDROID_HOME=/Users/kalikali/Library/Android/sdk
/tmp/gradle-8.10/bin/gradle assembleRelease

# Install on device
adb install -r app/build/outputs/apk/release/app-release.apk
```

---

## Device Under Test
- **Device ID**: 1089089
- **ADB Status**: Connected
- **Chrome Version**: 61.0.3163.98 (very old - from ~2017)
- **OS**: Android (appears to be older version)

---

## GitHub Integration
- **Repo**: `Raman21676/1click` (or similar)
- **Branch**: main
- **Deployment**: GitHub Pages (1click.live)
- **Last Commits**: 
  - Touch-action CSS fix for scrolling
  - Setup screen scrollable wrapper
  - Body overflow fix
  - Assetlinks.json package name fix

---

## Goals for Next Session

### Priority 1: Fix Ludo Scrolling (CRITICAL)
- User explicitly stated they cannot scroll in Ludo game
- Try JavaScript-based scrolling if CSS fails
- Consider using `overflow: scroll` with `-webkit-overflow-scrolling: touch`
- Test different touch-action values
- May need to redesign layout to not require scrolling

### Priority 2: Hide URL Bar (NICE TO HAVE)
- Update Chrome on device if possible
- Or test on different device with newer Chrome
- Verify assetlinks.json is accessible and correctly formatted
- Consider using a different TWA provider (not Chrome)

### Priority 3: General Testing
- Test all games for similar scrolling issues
- Verify TTS (Text to Speech) features work
- Check offline functionality

---

## Technical Notes

### TWA Manifest Configuration
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="1click.live" />
</intent-filter>
```

### Asset Links Format (Currently Deployed)
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.games.oneclick",
    "sha256_cert_fingerprints": [
      "99:84:28:32:80:72:A1:D7:FF:C0:E1:8E:B2:61:13:A1:EC:FB:95:E3:BC:F8:71:03:8C:70:BD:60:1B:D4:D8:84"
    ]
  }
}]
```

### APK Signing (DO NOT LOSE KEYSTORE)
- Keystore: `android/1click-keystore.jks`
- Store password: `1click2026`
- Key alias: `1click`
- Key password: `1click2026`
- **CRITICAL**: Losing this keystore means cannot update app on Play Store

---

## Common ADB Commands
```bash
# Check device
adb devices

# Install APK
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Launch app
adb shell am start -n com.games.oneclick/com.google.androidbrowserhelper.trusted.LauncherActivity

# Force stop
adb shell am force-stop com.games.oneclick

# Screenshot
adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png /tmp/screen.png

# Check logs
adb logcat -d | grep -i "twa\|assetlink\|verification"
```

---

## Key People/Context
- **User/Client**: Working on 1Click Games platform
- **Goal**: Deploy TWA Android app with full functionality
- **Previous AI**: Worked on build system, APK creation, basic scrolling fixes
- **Current Blocker**: Ludo game scrolling not working on device

---

## Questions for User (If Needed)
1. What device/Android version are you testing on?
2. Is Chrome updated to latest version on the device?
3. Does scrolling work when accessing 1click.live directly in Chrome browser (not TWA)?
4. Which specific screen in Ludo can't you scroll - the setup screen or the game board?
5. Do other games have similar scrolling issues?

---

## Next Steps Recommendation
1. **Test scrolling in regular Chrome browser first** - open Chrome, go to 1click.live, navigate to Ludo, verify if scrolling works there
2. **If it works in Chrome but not TWA** - issue is with TWA/Custom Tabs touch handling
3. **If it doesn't work in Chrome either** - issue is with CSS/JavaScript on the page
4. **Try a JavaScript scrolling solution** - implement touch event handlers for manual scrolling
5. **Consider alternative layouts** - make setup screen fit without scrolling

---

**Document Created**: 2026-03-11
**Last Updated**: After session with Ludo scrolling fixes
**Status**: Awaiting new AI agent to continue

---

## Recent Git History
```
cc0dc1f Add touch-action CSS for mobile scrolling in Ludo setup
4c7c147 Fix Ludo setup screen scrolling - add scrollable content wrapper
2d09afb Fix Ludo scrolling issue - allow body scroll in setup screen
1ee96eb fix: Update assetlinks.json with correct package name com.games.oneclick
cc7d226 docs: Add immediate install instructions
```

## Key Locations on Filesystem
- Project root: `~/Desktop/1click/`
- Android project: `~/Desktop/1click/android/`
- Ludo game: `~/Desktop/1click/src/games/ludo/index.html`
- APK output: `~/Desktop/1click/android/app/build/outputs/apk/release/app-release.apk`
- Keystore: `~/Desktop/1click/android/1click-keystore.jks`

## Environment Variables (if building)
```bash
export JAVA_HOME=/tmp/jdk-17.0.0+9/Contents/Home  # Adjust version as needed
export ANDROID_HOME=/Users/kalikali/Library/Android/sdk
export PATH=$PATH:/tmp/gradle-8.10/bin
```

## Current Screenshot of Issue
If available, check `/tmp/ludo_scroll_test.png` or similar for current state.
