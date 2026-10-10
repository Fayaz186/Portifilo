import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, isFirebaseActive } from '../services/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../services/firebase';
import { getSignInError } from '../utils/authErrors';

// Designated Administrator Email from system instructions/metadata
export const ADMIN_EMAIL = 'fayazmalikzai055@gmail.com';

function getAuthorizationError(user: User): string {
  if (user.email?.toLowerCase().trim() === ADMIN_EMAIL && !user.emailVerified) {
    return 'Your administrator email is not verified. Verify it in Firebase Authentication or sign in with the matching Google account.';
  }
  return `Signed in as ${user.email}, but this account is not registered as an administrator. Use ${ADMIN_EMAIL} or an account registered in the admins collection.`;
}

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
    if (emailLower === ADMIN_EMAIL.toLowerCase() && user.emailVerified) {
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
        throw new Error(getAuthorizationError(user));
      }
      setCurrentUser(user);
      setIsAdmin(true);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const msg = getSignInError(err, 'Google');
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // 2. Email & Password Sign-In
  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    if (!isFirebaseActive() || !auth) {
      throw new Error('Firebase Authentication is not available. Check configuration.');
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = result.user;
      const authorized = await checkAdminAuthorization(user);

      if (!authorized) {
        throw new Error(getAuthorizationError(user));
      }
      setCurrentUser(user);
      setIsAdmin(true);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      const userFriendlyMsg = getSignInError(err, 'Email/Password');
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
