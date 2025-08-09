// Configuration helper for different environments

export const config = {
  // Appwrite Configuration
  appwrite: {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!,
  },
  
  // TMDB API Configuration
  tmdb: {
    apiKey: process.env.EXPO_PUBLIC_MOVIE_API_KEY!,
    baseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p/w500",
  },
  
  // Google Gemini AI Configuration
  gemini: {
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  },
  
  // Environment helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Environment-specific endpoints for reference
export const endpoints = {
  // For Appwrite Cloud
  cloud: "https://cloud.appwrite.io/v1",
  
  // For Android Studio Simulator with local Appwrite
  androidSimulator: "http://10.0.2.2:80/v1",
  
  // For iOS Simulator with local Appwrite
  iosSimulator: "http://localhost:80/v1",
  
  // For physical device with local Appwrite (replace with your IP)
  physicalDevice: "http://YOUR_IP_ADDRESS:80/v1",
};

// Helper function to get the correct endpoint based on platform
export const getAppwriteEndpoint = () => {
  // You can add logic here to automatically detect the environment
  // and return the appropriate endpoint
  return config.appwrite.endpoint;
};
