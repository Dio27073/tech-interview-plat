'use client';

// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { 
  signIn, 
  signOut, 
  signUp, 
  confirmSignUp, 
  getCurrentUser, 
  type AuthUser,
} from 'aws-amplify/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  error: Error | null;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      const user = await getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignIn(username: string, password: string): Promise<void> {
    try {
      setError(null);
      const { isSignedIn } = await signIn({ 
        username, 
        password,
      });
      
      if (isSignedIn) {
        const user = await getCurrentUser();
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An error occurred during sign in'));
      throw error;
    }
  }

  async function handleSignOut(): Promise<void> {
    try {
      setError(null);
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An error occurred during sign out'));
      throw error;
    }
  }

  async function handleSignUp(username: string, password: string, email: string): Promise<void> {
    try {
      setError(null);
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An error occurred during sign up'));
      throw error;
    }
  }

  async function handleConfirmSignUp(username: string, code: string): Promise<void> {
    try {
      setError(null);
      await confirmSignUp({
        username,
        confirmationCode: code
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An error occurred during confirmation'));
      throw error;
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    error
  };
}