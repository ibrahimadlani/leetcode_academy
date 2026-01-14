"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { app, auth, db, analytics } from "@/lib/firebase";

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const { data: session, status } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Sync NextAuth session with Firebase Auth
  useEffect(() => {
    async function syncFirebaseAuth() {
      // Wait for NextAuth session to be determined
      if (status === "loading") return;

      // If no NextAuth session, sign out of Firebase
      if (!session?.user) {
        if (firebaseUser) {
          try {
            await auth.signOut();
          } catch (err) {
            console.error("Firebase sign out error:", err);
          }
        }
        setAuthLoading(false);
        return;
      }

      // If already signed in to Firebase with the same user, skip
      const currentEmail = firebaseUser?.email || firebaseUser?.uid?.replace(/_/g, ".");
      if (currentEmail === session.user.email) {
        setAuthLoading(false);
        return;
      }

      try {
        setAuthLoading(true);
        // Get custom token from our API
        const response = await fetch("/api/auth/firebase-token");

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to get Firebase token");
        }

        const { token } = await response.json();

        // Sign in to Firebase with custom token
        await signInWithCustomToken(auth, token);
        setAuthError(null);
      } catch (err) {
        console.error("Firebase auth sync error:", err);
        setAuthError(err.message);
      } finally {
        setAuthLoading(false);
      }
    }

    syncFirebaseAuth();
  }, [session, status, firebaseUser]);

  // Get the sanitized userId for Firestore operations
  const getUserId = useCallback(() => {
    if (firebaseUser?.uid) {
      return firebaseUser.uid;
    }
    if (session?.user?.email) {
      return session.user.email.replace(/[.#$[\]]/g, "_");
    }
    return null;
  }, [firebaseUser, session]);

  return (
    <FirebaseContext.Provider
      value={{
        app,
        auth,
        db,
        analytics,
        isInitialized,
        firebaseUser,
        authLoading,
        authError,
        isAuthenticated: !!firebaseUser,
        getUserId,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
