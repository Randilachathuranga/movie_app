# Environment Configuration Guide

This guide helps you configure the app for different development environments, especially for Android Studio simulator.

## Quick Setup

### For Android Studio Simulator

```bash
npm run env:android
```

### For iOS Simulator

```bash
npm run env:ios
```

### For Appwrite Cloud

```bash
npm run env:cloud
```

### For Local Development

```bash
npm run env:local
```

## Manual Configuration

### Android Studio Simulator

If you're running a local Appwrite instance and using Android Studio simulator, update your `.env` file:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=http://10.0.2.2:80/v1
```

**Why 10.0.2.2?**

- Android Emulator maps `10.0.2.2` to your host machine's `localhost`
- This is required because `localhost` inside the emulator refers to the emulator itself, not your computer

### iOS Simulator

For iOS simulator with local Appwrite:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=http://localhost:80/v1
```

### Physical Device

For testing on a physical device with local Appwrite, use your computer's IP address:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=http://YOUR_COMPUTER_IP:80/v1
```

To find your IP address:

- Windows: `ipconfig`
- Mac/Linux: `ifconfig` or `ip addr show`

### Appwrite Cloud

For using Appwrite Cloud service:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

## Environment Variables

Make sure your `.env` file contains all required variables:

```env
# Appwrite Configuration
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id

# TMDB API
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
```

## Troubleshooting

### Connection Issues

1. **Android Simulator can't connect to local Appwrite:**

   - Make sure you're using `10.0.2.2` instead of `localhost`
   - Check that Appwrite is running on the correct port
   - Verify firewall settings allow connections

2. **iOS Simulator connection issues:**

   - Use `localhost` or `127.0.0.1`
   - Ensure Appwrite is accessible on your local machine

3. **Physical device can't connect:**
   - Use your computer's actual IP address
   - Make sure both devices are on the same network
   - Check firewall/security settings

### Authentication Issues

1. **Users can't sign up/sign in:**

   - Verify Appwrite project configuration
   - Check that authentication is enabled in Appwrite console
   - Ensure proper API keys are set

2. **Database access issues:**
   - Verify database and collection IDs
   - Check permissions in Appwrite console
   - Ensure authenticated users have read/write access

## Development Workflow

1. **Start Development:**

   ```bash
   # Configure for your environment
   npm run env:android    # or ios, cloud, local

   # Start the development server
   npm start
   ```

2. **Switch Environments:**

   ```bash
   # Switch to Appwrite Cloud
   npm run env:cloud

   # Switch to Android Simulator
   npm run env:android
   ```

3. **Reset Environment:**
   ```bash
   # Manually edit .env file or use setup scripts
   npm run env:cloud
   ```
