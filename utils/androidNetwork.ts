import { config } from '@/config';
import { Platform } from 'react-native';

// Android emulator network configuration
export const getOptimizedEndpoint = () => {
  // For Android emulator, we might need to handle network differently
  if (Platform.OS === 'android') {
    // Use the configured endpoint but with potential fallbacks
    return config.appwrite.endpoint;
  }
  
  return config.appwrite.endpoint;
};

// Network timeout configuration for Android emulator
export const getNetworkConfig = () => {
  if (Platform.OS === 'android') {
    return {
      timeout: 30000, // 30 seconds timeout for Android emulator
      retry: 3,
    };
  }
  
  return {
    timeout: 15000, // 15 seconds for other platforms
    retry: 2,
  };
};

// Enhanced fetch with better error handling for Android emulator
export const enhancedFetch = async (url: string, options: RequestInit = {}) => {
  const networkConfig = getNetworkConfig();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), networkConfig.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Network timeout after ${networkConfig.timeout}ms. This often happens in Android emulator.`);
    }
    
    // Android-specific error handling
    if (Platform.OS === 'android' && error.message?.includes('Network request failed')) {
      throw new Error('Network connection failed. If using Android emulator, ensure internet connectivity and try restarting the emulator.');
    }
    
    throw error;
  }
};
