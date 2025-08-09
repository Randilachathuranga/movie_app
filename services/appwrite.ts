// track the searches made by a user

import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

import { config } from "@/config";
import { Platform } from "react-native";

const { appwrite } = config;

// Enhanced client configuration for Android emulator
const client = new Client()
  .setEndpoint(appwrite.endpoint)
  .setProject(appwrite.projectId);

// Add platform-specific configurations
if (Platform.OS === 'android') {
  // Android emulator specific settings
  console.log("Configuring Appwrite client for Android emulator");
  console.log("Endpoint:", appwrite.endpoint);
  console.log("Project ID:", appwrite.projectId);
}

const account = new Account(client);
const database = new Databases(client);


export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(appwrite.databaseId, appwrite.collectionId, [
          Query.equal("searchTerm", query),
        ]);
    
        if (result.documents.length > 0) {
          const existingMovie = result.documents[0];
          await database.updateDocument(
            appwrite.databaseId,
            appwrite.collectionId,
            existingMovie.$id,
            {
              count: existingMovie.count + 1,
            }
          );
        } else {
          await database.createDocument(appwrite.databaseId, appwrite.collectionId, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            title: movie.title,
            count: 1,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          });
        }
      } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
      }
    
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(appwrite.databaseId, appwrite.collectionId, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Authentication functions
export const createUser = async (email: string, password: string, name: string) => {
  try {
    console.log("Creating user with email:", email);
    
    // Create the account
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    console.log("Account created successfully:", newAccount.$id);
    
    // Automatically sign in the new user
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created successfully:", session.$id);
    
    // Optionally store additional user data in database
    try {
      await database.createDocument(
        appwrite.databaseId,
        appwrite.collectionId,
        ID.unique(),
        {
          userId: newAccount.$id,
          name: name,
          email: email,
          joinDate: new Date().toISOString(),
          moviesWatched: 0,
          watchlistCount: 0,
          favoriteGenre: "Not Set"
        }
      );
      console.log("User profile created in database");
    } catch (dbError) {
      console.log("Profile creation in database failed (optional):", dbError);
      // Don't throw error here as account creation was successful
    }
    
    return { account: newAccount, session };
  } catch (error: any) {
    console.error("Create user error:", error);
    
    // Provide more specific error messages
    if (error.code === 409) {
      throw new Error("A user with this email already exists");
    } else if (error.code === 400) {
      throw new Error("Invalid email or password format");
    } else if (error.message?.includes("password")) {
      throw new Error("Password must be at least 8 characters long");
    } else {
      throw new Error(error.message || "Account creation failed");
    }
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log("Signing in user with email:", email);
    
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Sign in successful:", session.$id);
    
    return session;
  } catch (error: any) {
    console.error("Sign in error:", error);
    
    // Provide more specific error messages
    if (error.code === 401) {
      throw new Error("Invalid email or password");
    } else if (error.code === 400) {
      throw new Error("Please enter valid email and password");
    } else {
      throw new Error(error.message || "Sign in failed");
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    console.log("Current user retrieved:", currentAccount.$id);
    return currentAccount;
  } catch (error: any) {
    console.error("Get current user error:", error);
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const result = await database.listDocuments(
      appwrite.databaseId,
      appwrite.collectionId,
      [Query.equal("userId", userId)]
    );
    
    if (result.documents.length > 0) {
      return result.documents[0];
    }
    return null;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    console.log("Signing out user");
    const session = await account.deleteSession("current");
    console.log("Sign out successful");
    return session;
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw new Error(error.message || "Sign out failed");
  }
};