"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useFirebase } from "@/components/FirebaseProvider";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const DEFAULT_PREFERENCES = {
  language: "python",
  theme: "system",
  emailNotifications: true,
};

const DEFAULT_STATS = {
  totalCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityAt: null,
};

export function useUser() {
  const { data: session, status } = useSession();
  const { db, firebaseUser, authLoading, getUserId } = useFirebase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = getUserId();

  // Create or update user document on login
  const createOrUpdateUser = useCallback(async () => {
    if (!session?.user || !userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          id: userId,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image || null,
          provider: session.user.provider || "oauth",
          providerId: session.user.id || null,
          preferences: DEFAULT_PREFERENCES,
          stats: DEFAULT_STATS,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // Update profile info in case it changed
          name: session.user.name,
          image: session.user.image || null,
        });
      }
    } catch (err) {
      console.error("Error creating/updating user:", err);
      setError(err.message);
    }
  }, [session, userId]);

  // Listen to user document changes
  useEffect(() => {
    if (status === "loading" || authLoading) return;

    if (!firebaseUser || !userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Create/update user first, then listen
    createOrUpdateUser();

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUser({ id: snapshot.id, ...snapshot.data() });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to user:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [session, status, userId, createOrUpdateUser, firebaseUser, authLoading, db]);

  // Update user preferences
  const updatePreferences = useCallback(
    async (newPreferences) => {
      if (!userId) return;

      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          preferences: { ...user?.preferences, ...newPreferences },
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error updating preferences:", err);
        throw err;
      }
    },
    [userId, user?.preferences]
  );

  // Update user stats
  const updateStats = useCallback(
    async (newStats) => {
      if (!userId) return;

      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          stats: { ...user?.stats, ...newStats },
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error updating stats:", err);
        throw err;
      }
    },
    [userId, user?.stats]
  );

  // Increment completed lessons count
  const incrementCompleted = useCallback(async () => {
    if (!userId || !user) return;

    const newTotal = (user.stats?.totalCompleted || 0) + 1;
    const today = new Date().toDateString();
    const lastActivity = user.stats?.lastActivityAt?.toDate?.()?.toDateString?.();

    let newStreak = user.stats?.currentStreak || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActivity === yesterday.toDateString()) {
      newStreak += 1;
    } else if (lastActivity !== today) {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, user.stats?.longestStreak || 0);

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        "stats.totalCompleted": newTotal,
        "stats.currentStreak": newStreak,
        "stats.longestStreak": longestStreak,
        "stats.lastActivityAt": serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error incrementing completed:", err);
    }
  }, [userId, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!session?.user,
    updatePreferences,
    updateStats,
    incrementCompleted,
    preferences: user?.preferences || DEFAULT_PREFERENCES,
    stats: user?.stats || DEFAULT_STATS,
  };
}
