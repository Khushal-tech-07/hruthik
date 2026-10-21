import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { User, Transaction } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigData.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigData.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigData.appId,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const AUTH_STORAGE_KEY = 'hruthik_kirana_auth_user';

export const getPersistedUser = (): User | null => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error reading auth state:", err);
    return null;
  }
};

export const persistUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error("Error persisting auth state:", err);
  }
};

/**
 * Format Firebase User into internal User model
 */
export const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
  uid: fbUser.uid,
  displayName: fbUser.displayName || 'Hruthik (Owner)',
  email: fbUser.email || 'hruthik.kirana@gmail.com',
  photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'Hruthik')}&backgroundColor=059669`,
  isDemo: false
});

/**
 * Real-time Google Sign-In via Firebase Auth
 */
export const signInWithGoogleRealtime = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = mapFirebaseUser(result.user);
    persistUser(user);

    // Persist user profile to Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || '',
        lastLogin: Date.now()
      }, { merge: true });
    } catch (dbErr) {
      console.warn("Could not sync user profile to Firestore:", dbErr);
    }

    return user;
  } catch (error: any) {
    console.error("Firebase Google Sign-In error:", error);
    // If popup blocked or cancelled, rethrow so UI can handle or offer bypass
    throw error;
  }
};

/**
 * Listen to real-time auth state changes
 */
export const subscribeToAuth = (callback: (user: User | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const user = mapFirebaseUser(fbUser);
      persistUser(user);
      callback(user);
    } else {
      // Check if demo user is persisted
      const current = getPersistedUser();
      if (current && current.isDemo) {
        callback(current);
      } else {
        persistUser(null);
        callback(null);
      }
    }
  });
};

/**
 * Sign out user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn("Firebase signOut error:", err);
  }
  persistUser(null);
};

export const loginAsDemo = (name = "Hruthik (Shop Owner)", email = "hruthik.kirana@gmail.com"): User => {
  const demoUser: User = {
    uid: 'demo_user_' + Date.now(),
    displayName: name,
    email: email,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=059669`,
    isDemo: true
  };
  persistUser(demoUser);
  return demoUser;
};

// ================= Firestore Realtime Sync Helpers =================

/**
 * Listen to real-time transactions for the user
 */
export const subscribeToUserTransactions = (
  userId: string,
  onUpdate: (transactions: Transaction[]) => void
): Unsubscribe => {
  const txCollectionRef = collection(db, 'users', userId, 'transactions');
  const q = query(txCollectionRef, orderBy('timestamp', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const list: Transaction[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        timestamp: data.timestamp,
        dateStr: data.dateStr,
        timeStr: data.timeStr,
        description: data.description,
        gpayAmount: data.gpayAmount,
        cashAmount: data.cashAmount,
        totalAmount: data.totalAmount,
      });
    });
    onUpdate(list);
  }, (err) => {
    console.warn("Firestore transactions snapshot listener error:", err);
  });
};

/**
 * Add or update transaction in Firestore
 */
export const saveTransactionToFirestore = async (
  userId: string,
  tx: Transaction
): Promise<void> => {
  const txDocRef = doc(db, 'users', userId, 'transactions', tx.id);
  await setDoc(txDocRef, {
    userId,
    timestamp: tx.timestamp,
    dateStr: tx.dateStr,
    timeStr: tx.timeStr,
    description: tx.description,
    gpayAmount: tx.gpayAmount,
    cashAmount: tx.cashAmount,
    totalAmount: tx.totalAmount,
  });
};

/**
 * Delete a transaction from Firestore
 */
export const deleteTransactionFromFirestore = async (
  userId: string,
  txId: string
): Promise<void> => {
  const txDocRef = doc(db, 'users', userId, 'transactions', txId);
  await deleteDoc(txDocRef);
};
