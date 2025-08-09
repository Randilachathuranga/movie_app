# Android Studio Emulator Troubleshooting Guide

## Common Issues with Android Studio Emulator and Appwrite

### Issue 1: Network Connection Timeouts

**Symptoms:**

- Login works on web but fails on Android emulator
- "Network request failed" errors
- Timeout errors

**Solutions:**

#### Option 1: Enable Cold Boot

1. Open Android Studio
2. Go to Tools → AVD Manager
3. Click the dropdown arrow next to your emulator
4. Select "Cold Boot Now"
5. Wait for emulator to fully restart

#### Option 2: Check Internet Connectivity

```bash
# In Android emulator, open browser and test:
# - Can you access google.com?
# - Can you access https://cloud.appwrite.io?
```

#### Option 3: Reset Network Settings

1. In emulator settings: Settings → Network & Internet
2. Turn Wi-Fi off and on
3. Or try switching to mobile data if available

#### Option 4: Use Different Emulator

1. Create a new AVD with:
   - Latest Android version (API 33 or 34)
   - Google APIs or Google Play Store image
   - Sufficient RAM (4GB+)
   - Hardware acceleration enabled

### Issue 2: SSL/TLS Certificate Issues

**Symptoms:**

- Certificate verification errors
- SSL handshake failures

**Solutions:**

#### Option 1: Clear Emulator Data

1. Android Studio → AVD Manager
2. Click dropdown → Wipe Data
3. Restart emulator

#### Option 2: Update System WebView

1. In emulator: Play Store → Search "Android System WebView"
2. Update if available

### Issue 3: DNS Resolution Problems

**Symptoms:**

- "Could not resolve host" errors
- Works on web but not emulator

**Solutions:**

#### Option 1: Change DNS in Emulator

1. Settings → Network & Internet → Wi-Fi
2. Long press your network → Modify
3. Advanced → IP settings → Static
4. DNS 1: 8.8.8.8, DNS 2: 8.8.4.4

#### Option 2: Restart Emulator with DNS

```bash
# Start emulator with specific DNS
emulator -avd YOUR_AVD_NAME -dns-server 8.8.8.8,8.8.4.4
```

### Issue 4: Proxy/Firewall Issues

**Check if your network blocks Appwrite Cloud:**

#### Test Connection Manually

```javascript
// In your app's network diagnostics:
// 1. Test basic connectivity to cloud.appwrite.io
// 2. Check if corporate firewall blocks the connection
// 3. Try using mobile hotspot instead of office/school network
```

### Issue 5: Emulator Hardware Issues

**Create Optimal AVD:**

1. API Level: 33 or 34 (latest stable)
2. ABI: x86_64 or arm64-v8a
3. RAM: 4GB or more
4. Internal Storage: 8GB or more
5. Graphics: Hardware - GLES 2.0
6. Enable: Hardware keyboard, Camera, GPS

### Quick Fix Commands

#### Restart ADB

```bash
adb kill-server
adb start-server
```

#### Clear App Data

```bash
adb shell pm clear com.movieapp  # Replace with your package name
```

#### Check Emulator Network

```bash
adb shell ping google.com
adb shell ping cloud.appwrite.io
```

### Environment Variables for Testing

Create different endpoint configurations:

#### For Network Issues - Try HTTP (less secure, testing only):

```env
# WARNING: Only for testing - never use HTTP in production
EXPO_PUBLIC_APPWRITE_ENDPOINT=http://cloud.appwrite.io/v1
```

#### Alternative Appwrite Cloud Endpoints:

```env
# Try different regional endpoints if available
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://eu-central-1.appwrite.global/v1
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://us-east-1.appwrite.global/v1
```

### Debug Steps

1. **Use Network Diagnostics in App:**

   - Go to Sign In screen
   - Click "Show Network Diagnostics"
   - Run tests and check results

2. **Check Console Logs:**

   ```bash
   npx expo start
   # Press 'j' to open debugger
   # Check Network tab for failed requests
   ```

3. **Test with Different Network:**

   - Try mobile hotspot
   - Try different Wi-Fi network
   - Check if corporate/school firewall is blocking

4. **Verify Appwrite Project:**
   - Go to Appwrite Console
   - Check if project exists: 68161a49002d89c5e289
   - Verify Auth is enabled
   - Check API keys are valid

### Last Resort Solutions

#### Option 1: Use Physical Device

- Install Expo Go on your phone
- Scan QR code from `npx expo start`
- Test on physical device instead of emulator

#### Option 2: Switch to Local Appwrite

```bash
# Run Appwrite locally with Docker
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.4.13

# Then update .env:
EXPO_PUBLIC_APPWRITE_ENDPOINT=http://10.0.2.2:80/v1
```

#### Option 3: Use Different Emulator

- Try Genymotion
- Try BlueStacks
- Try running on web version instead

### Success Indicators

✅ Network diagnostics show all green checkmarks
✅ Can create account and see it in Appwrite Console → Auth → Users
✅ Console logs show "Login successful" messages
✅ No timeout or network errors in logs

If none of these solutions work, the issue might be:

- Corporate/school firewall blocking Appwrite
- ISP blocking certain domains
- Emulator networking driver issues (try different emulator)
- Windows Defender/Antivirus blocking network requests
