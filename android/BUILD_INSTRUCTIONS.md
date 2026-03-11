# 🔨 Manual APK Build Instructions

Since Bubblewrap requires interactive input, follow these steps to build the APK:

## Prerequisites

Make sure these are installed:
```bash
# Check Java (should be 11 or higher)
java -version

# Check Android SDK
echo $ANDROID_HOME
```

If Android SDK is not set up, the Bubblewrap CLI will prompt to install it automatically.

## Build Steps

### Step 1: Navigate to the android directory
```bash
cd ~/Desktop/1click/android
```

### Step 2: Run Bubblewrap Init
```bash
./node_modules/.bin/bubblewrap init --manifest https://1click.live/manifest.json
```

### Step 3: Answer the prompts
The init command will ask several questions. Use these answers:

| Prompt | Answer |
|--------|--------|
| Domain | `1click.live` (press Enter for default) |
| URL path | `/` (press Enter for default) |
| Application name | `1click Games` (press Enter for default) |
| Short name | `1click` (press Enter for default) |
| Package name | `com.clickgames.twa` (press Enter for default) |
| Launcher name | `1click` (press Enter for default) |
| Theme color | `#0f172a` (press Enter for default) |
| Background color | `#0f172a` (press Enter for default) |
| Enable notifications? | `Y` (press Enter for default) |
| Play Billing enabled? | `n` (press Enter for default) |
| Location Delegation enabled? | `n` (press Enter for default) |
| Start URL | `/` (press Enter for default) |
| Icon URL | `https://1click.live/src/assets/images/icon-512x512.png` (press Enter) |
| Maskable icon URL | `https://1click.live/src/assets/images/icon-512x512-maskable.png` (press Enter) |
| Monochrome icon URL | (press Enter for none) |
| Splash screen fade out duration | `300` (press Enter for default) |
| App version name | `1.0.0` (press Enter for default) |
| App version code | `1` (press Enter for default) |
| Minimum SDK version | `21` (press Enter for default) |
| Orientation | `portrait` (press Enter for default) |
| Display mode | `standalone` (press Enter for default) |
| Full scope URL | `https://1click.live/` (press Enter for default) |
| Enable site settings shortcut? | `Y` (press Enter for default) |
| Is this a ChromeOS only app? | `n` (press Enter for default) |
| Is this a Meta Quest app? | `n` (press Enter for default) |

This will create the `app/` directory with the Android project.

### Step 4: Build the APK
```bash
./node_modules/.bin/bubblewrap build
```

When prompted for keystore password, enter: `1click2026`
When prompted for key password, enter: `1click2026`

### Step 5: Find the APK
The signed APK will be at:
```
app/build/outputs/apk/release/app-release-signed.apk
```

## Install on Device

### Option A: Using ADB (if USB debugging is enabled)
```bash
adb install app/build/outputs/apk/release/app-release-signed.apk
```

### Option B: Email/Download
1. Copy the APK to your device
2. Open the file on your Android device
3. Allow "Install from unknown sources" when prompted
4. Install the app

## Troubleshooting

### "ANDROID_HOME not set"
Run:
```bash
export ANDROID_HOME=/Users/kalikali/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

### "JDK not found"
Bubblewrap will offer to download JDK 17 automatically. Press `Y` to accept.

### Build fails with "SDK not correct"
Make sure you've run `sdkmanager --licenses` and accepted all licenses:
```bash
yes | sdkmanager --licenses
```

## Quick Test After Install

1. Open the app
2. Play a game (e.g., Ludo)
3. Enable Airplane Mode on your device
4. Try opening another game
5. All games should work offline! ✅
