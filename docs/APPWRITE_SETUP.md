# Appwrite Database Setup Guide

## Database Collections Setup

You need to set up collections in your Appwrite database to store user profiles and movie data properly.

### 1. Users Collection (Optional - for extended user profiles)

**Collection ID:** `users` (or create a new collection ID and update your .env)

**Attributes:**

- `userId` (String, 36 characters, required) - References the Appwrite user ID
- `name` (String, 100 characters, required) - User's full name
- `email` (String, 100 characters, required) - User's email
- `joinDate` (String, 30 characters, required) - ISO date string
- `moviesWatched` (Integer, required, default: 0) - Count of movies watched
- `watchlistCount` (Integer, required, default: 0) - Count of watchlist items
- `favoriteGenre` (String, 50 characters, default: "Not Set") - User's favorite genre

**Permissions:**

- **Create:** Users (authenticated users can create their profiles)
- **Read:** Users (authenticated users can read their profiles)
- **Update:** Users (authenticated users can update their profiles)
- **Delete:** Users (authenticated users can delete their profiles)

### 2. Movie Search Collection (Existing)

**Collection ID:** `681c182e001707764f80` (from your .env)

**Attributes:**

- `searchTerm` (String, required) - The search query
- `movie_id` (Integer, required) - TMDB movie ID
- `title` (String, required) - Movie title
- `count` (Integer, required) - Search count
- `poster_url` (String, required) - Movie poster URL

**Permissions:**

- **Create:** Users (for tracking searches)
- **Read:** Users (for trending movies)
- **Update:** Users (for updating search counts)

### 3. User Watchlist Collection (Optional Enhancement)

**Collection ID:** `watchlist`

**Attributes:**

- `userId` (String, 36 characters, required) - User ID
- `movieId` (Integer, required) - TMDB movie ID
- `title` (String, required) - Movie title
- `poster_url` (String, required) - Movie poster URL
- `addedDate` (String, required) - ISO date string
- `watched` (Boolean, default: false) - Whether the movie was watched

## Quick Setup Steps

### Step 1: Enable Authentication

1. Go to your Appwrite Console
2. Navigate to Auth → Settings
3. Enable Email/Password authentication
4. Set session length as needed

### Step 2: Update Collection Permissions

1. Go to Databases → Your Database → Collections
2. For each collection, click on Settings → Permissions
3. Add the following permissions:
   - **Any** role for read operations (if you want public data)
   - **Users** role for create/update/delete operations

### Step 3: Test Connection

1. Use the "Test Appwrite Connection" button in your sign-in screen
2. Check the console logs for any connection issues

### Step 4: Environment Variables

Make sure your `.env` file has correct values without spaces:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=68161a49002d89c5e289
EXPO_PUBLIC_APPWRITE_DATABASE_ID=681c17e50021a17b76fb
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=681c182e001707764f80
```

## Troubleshooting

### Common Issues:

1. **"Missing scope" error:**

   - Check collection permissions
   - Ensure "Users" role has proper CRUD permissions

2. **"Invalid credentials" error:**

   - Verify email/password authentication is enabled
   - Check if user exists

3. **"Collection not found" error:**

   - Verify collection IDs in .env file
   - Ensure collections exist in your database

4. **Connection timeout:**
   - Check your internet connection
   - Verify Appwrite endpoint URL
   - For local development, ensure Appwrite server is running

### Testing Authentication:

1. Try creating a test account with:

   - Email: test@example.com
   - Password: password123
   - Name: Test User

2. Check Appwrite Console → Auth → Users to see if user was created

3. Check console logs in your app for detailed error messages

### Debug Mode:

The updated authentication system now includes extensive logging. Check your development console for detailed information about:

- Connection attempts
- Authentication status
- Error messages
- User creation/login process
