// Test Appwrite connection

import { config } from "@/config";
import { Client } from "react-native-appwrite";

export const testAppwriteConnection = async () => {
  console.log("Testing Appwrite connection...");
  console.log("Endpoint:", config.appwrite.endpoint);
  console.log("Project ID:", config.appwrite.projectId);
  
  const client = new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.projectId);

  try {
    // Try to get health status (this doesn't require auth)
    const response = await fetch(`${config.appwrite.endpoint}/health`, {
      method: 'GET',
      headers: {
        'X-Appwrite-Project': config.appwrite.projectId,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log("✅ Appwrite connection successful");
      return true;
    } else {
      console.error("❌ Appwrite connection failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Appwrite connection error:", error);
    return false;
  }
};
