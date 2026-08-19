'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPLVqZ_CgguwH9W_yaCWiQiz2nzGniBZM",
  authDomain: "gunfits.firebaseapp.com",
  projectId: "gunfits",
  storageBucket: "gunfits.firebasestorage.app",
  messagingSenderId: "841263994035",
  appId: "1:841263994035:web:124e56aa1caff4fa3d8cc6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Get user role from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    // Save user to Firestore with role 'user'
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    });
    return userCredential;
  }

  async function ensureUserProfile(firebaseUser) {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: firebaseUser.displayName || '',
        email: firebaseUser.email,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    }
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      await ensureUserProfile(userCredential.user);
      return userCredential;
    } catch (error) {
      if (error?.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in was blocked by the browser. Please allow popups and try again.');
      }

      if (error?.code === 'auth/cancelled-popup-request') {
        throw new Error('Google sign-in was cancelled.');
      }

      if (error?.code === 'auth/configuration-not-found') {
        throw new Error('Google login is not enabled in your Firebase project. Enable Google sign-in in Firebase Authentication.');
      }

      throw error;
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const isAdmin = role === 'admin';
  const isPremium = role === 'premium' || role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      isAdmin,
      isPremium
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}