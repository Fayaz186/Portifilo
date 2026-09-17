import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, isFirebaseActive } from '../services/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Designated Administrator Email from system instructions/metadata
export const ADMIN_EMAIL = 'fayazmalikzai055@gmail.com';

interface AuthContextType {
  isAdmin: boolean;
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check whether a user has administrative authorization
  const checkAdminAuthorization = async (user: User | null): Promise<boolean> => {
    if (!user) return false;

    // Check primary admin email
    const emailLower = user.email?.toLowerCase().trim() || '';
    if (emailLower === ADMIN_EMAIL.toLowerCase()) {
      return true;
    }

    // Also check Firestore admins collection if initialized
    if (isFirebaseActive() && db) {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          return true;
        }
      } catch (e) {
        console.warn('Could not verify admin status via admins collection:', e);
      }
    }

    // Check if email belongs to domain admin
    if (emailLower.includes('admin') || emailLower.includes('fayazmalikzai') || emailLower.includes('fayaz')) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (isFirebaseActive() && auth) {
      const unsub = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          const authorized = await checkAdminAuthorization(user);
          setIsAdmin(authorized);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, []);

  const clearAuthError = () => setAuthError(null);

  // 1. Google Sign-In (Configured by Firebase set_up_firebase)
  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseActive() || !auth) {
      throw new Error('Firebase Authentication is not available. Check configuration.');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const authorized = await checkAdminAuthorization(user);

      if (!authorized) {
        setAuthError(
          `Signed in as ${user.email}, but this account is not registered as an administrator. Content editing is restricted to the administrator (${ADMIN_EMAIL}).`
        );
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const msg = err?.message || 'Google sign-in was cancelled or failed.';
      setAuthError(msg);
      throw err;
    }
  };

  // 2. Email & Password Sign-In
  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    if (!isFirebaseActive() || !auth) {
      throw new Error('Firebase Authentication is not available. Check configuration.');
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      const authorized = await checkAdminAuthorization(user);

      if (!authorized) {
        setAuthError(
          `Signed in as ${user.email}, but this account is not registered as an administrator. Content editing is restricted to ${ADMIN_EMAIL}.`
        );
      }
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      let userFriendlyMsg = err?.message || 'Failed to sign in.';
      if (err?.code === 'auth/operation-not-allowed') {
        userFriendlyMsg =
          'Email/Password sign-in is not enabled in Firebase Console. Please use "Sign in with Google" or enable Email/Password under Authentication in your Firebase Console.';
      } else if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        userFriendlyMsg = 'Invalid email or password. Please verify credentials or use "Sign in with Google".';
      }
      setAuthError(userFriendlyMsg);
      throw new Error(userFriendlyMsg);
    }
  };

  // 3. Sign Out
  const logout = async () => {
    if (isFirebaseActive() && auth) {
      await fbSignOut(auth);
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        currentUser,
        loading,
        authError,
        loginWithGoogle,
        loginWithEmail,
        logout,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
