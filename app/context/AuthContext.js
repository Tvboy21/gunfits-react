'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AuthContext = createContext(null);

async function ensureUserProfile(currentUser, overrides = {}) {
  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);
  const existingData = userSnap.exists() ? userSnap.data() : {};

  const nextProfile = {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName || existingData.displayName || overrides.displayName || 'User',
    role: existingData.role || overrides.role || 'user',
    updatedAt: new Date().toISOString(),
    ...(existingData.createdAt ? {} : { createdAt: new Date().toISOString() }),
    ...overrides,
  };

  await setDoc(userRef, nextProfile, { merge: true });
  return nextProfile;
}

async function sendWelcomeEmailIfNeeded(currentUser, name) {
  if (!currentUser?.email) return;

  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);
  const existingData = userSnap.exists() ? userSnap.data() : {};

  if (existingData.welcomeEmailSentAt) return;

  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        name: name || currentUser.displayName || 'there',
      }),
    });

    if (response.ok) {
      await setDoc(userRef, { welcomeEmailSentAt: new Date().toISOString() }, { merge: true });
    }
  } catch (error) {
    console.warn('Welcome email failed:', error);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const savedRole = userDoc.exists() ? userDoc.data().role : 'user';
          setRole(savedRole || 'user');
        } catch (error) {
          console.error('Failed to fetch user role:', error);
          setRole('user');
        }
      } else {
        setRole('user');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email, password) => {
    const { user: currentUser } = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserProfile(currentUser, { displayName: currentUser.displayName || 'User' });
    await sendWelcomeEmailIfNeeded(currentUser, currentUser.displayName || 'there');
    return currentUser;
  };

  const signup = async (email, password, name) => {
    const { user: currentUser } = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(currentUser, { displayName: name });
    }

    await ensureUserProfile(currentUser, {
      displayName: name || currentUser.displayName || 'User',
      role: 'user',
    });

    await sendWelcomeEmailIfNeeded(currentUser, name || currentUser.displayName || 'there');
    return currentUser;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user: currentUser } = await signInWithPopup(auth, provider);

    await ensureUserProfile(currentUser, {
      displayName: currentUser.displayName || 'Google User',
      role: 'user',
    });

    await sendWelcomeEmailIfNeeded(currentUser, currentUser.displayName || 'there');
    return currentUser;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isAdmin: role === 'admin',
      isPremium: role === 'premium' || role === 'admin',
      login,
      signup,
      loginWithGoogle,
      logout,
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}