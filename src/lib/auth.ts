import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, type User, getRedirectResult } from 'firebase/auth';
import { type FirebaseError } from '@firebase/util';
import { auth } from './firebase';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Simple mobile detection
const isMobile = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|android/.test(ua);
};

// Helper to get detailed error info
const getDetailedError = (error: unknown): string => {
  if (error instanceof Error) {
    const firebaseError = error as FirebaseError;
    console.error('Detailed auth error:', {
      code: firebaseError.code,
      message: firebaseError.message,
      name: firebaseError.name,
      stack: firebaseError.stack,
      customData: (firebaseError as any).customData
    });
    
    // Return user-friendly error message based on error code
    switch (firebaseError.code) {
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups or try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in attempt is in progress. Please wait.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/argument-error':
        return 'Please try again. If the issue persists, try clearing your browser cache.';
      default:
        return firebaseError.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      
      // Add scopes
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('Starting Google sign in...');
      
      if (isMobile()) {
        console.log('Using redirect flow for mobile...');
        await signInWithRedirect(auth, provider);
        // The redirect will happen here
      } else {
        console.log('Using popup flow for desktop...');
        const result = await signInWithPopup(auth, provider);
        console.log('Sign in successful:', result.user.email);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = getDetailedError(error);
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      const errorMessage = getDetailedError(error);
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

// Handle redirect result when the page loads
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      console.log('Redirect sign in successful:', result.user.email);
    } else {
      console.log('No redirect result');
    }
  })
  .catch((error) => {
    console.error('Redirect sign in error:', error);
    const errorMessage = getDetailedError(error);
    useAuth.setState({ error: errorMessage });
  });

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user?.email ?? 'No user');
  useAuth.setState({ user, loading: false });
});
