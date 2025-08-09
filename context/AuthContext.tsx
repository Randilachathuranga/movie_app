import { createUser, getCurrentUser, signIn, signOut } from '@/services/appwrite';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  $id: string;
  name: string;
  email: string;
  $createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log("Checking authentication state...");
      const currentUser = await getCurrentUser();
      if (currentUser) {
        console.log("User is authenticated:", currentUser.email);
        setUser(currentUser);
      } else {
        console.log("No authenticated user found");
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      setIsLoading(true);
      await signIn(email, password);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        console.log("Login successful for:", currentUser.email);
        setUser(currentUser);
      } else {
        throw new Error("Failed to get user after login");
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting registration for:", email);
      setIsLoading(true);
      await createUser(email, password, name);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        console.log("Registration successful for:", currentUser.email);
        setUser(currentUser);
      } else {
        throw new Error("Failed to get user after registration");
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      setIsLoading(true);
      await signOut();
      setUser(null);
      console.log("Logout successful");
    } catch (error: any) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
