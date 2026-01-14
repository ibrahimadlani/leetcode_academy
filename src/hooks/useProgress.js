"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

/**
 * IMPORTANT:
 * - Firestore rules check request.auth.uid -> we must use Firebase Auth uid as userId.
 * - DO NOT use next-auth email/id for Firestore paths unless you also sign in to Firebase with custom tokens.
 */

export function useProgress(lessonId, lessonMeta = {}) {
  const [uid, setUid] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const startTimeRef = useRef(null);
  const timeAccumulatedRef = useRef(0);
  const didInitTimeRef = useRef(false);

  // Track Firebase Auth user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return unsub;
  }, []);

  const stableTotalSteps = lessonMeta?.totalSteps ?? 0;

  // Load progress from Firestore
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!uid || !lessonId) {
        setProgress(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const docRef = doc(db, "users", uid, "progress", lessonId);
        const docSnap = await getDoc(docRef);

        if (cancelled) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProgress(data);
          timeAccumulatedRef.current = data.timeSpent || 0;
        } else {
          // local default (no write here)
          setProgress({
            lessonId,
            currentStep: 0,
            totalSteps: stableTotalSteps,
            status: "not_started",
            completed: false,
            timeSpent: 0,
            attempts: 0,
          });
          timeAccumulatedRef.current = 0;
        }
      } catch (error) {
        console.error("Error loading progress:", error);
        if (!cancelled) {
          setProgress({
            lessonId,
            currentStep: 0,
            totalSteps: stableTotalSteps,
            status: "not_started",
            completed: false,
            timeSpent: 0,
            attempts: 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [uid, lessonId, stableTotalSteps]);

  // Track time spent (mount/unmount)
  useEffect(() => {
    // In React 18 StrictMode (dev), effects mount/unmount twice.
    // Avoid creating bogus time tracking on the "test" unmount.
    if (!uid || !lessonId) return;

    startTimeRef.current = Date.now();
    didInitTimeRef.current = true;

    return () => {
      // If we never initialized properly, skip.
      if (!didInitTimeRef.current) return;

      // Save time on unmount only if we have a valid uid + lessonId
      const startedAt = startTimeRef.current;
      if (!startedAt) return;

      const sessionTime = Math.floor((Date.now() - startedAt) / 1000);
      if (sessionTime <= 0) return;

      const totalTime = timeAccumulatedRef.current + sessionTime;

      const docRef = doc(db, "users", uid, "progress", lessonId);
      // Fire-and-forget (will still fail if rules/auth not ok, but uid gating avoids that)
      setDoc(
        docRef,
        { timeSpent: totalTime, lastAccessedAt: serverTimestamp() },
        { merge: true }
      ).catch((e) => console.error("Error saving time on unmount:", e));
    };
  }, [uid, lessonId]);

  // Save progress to Firestore
  const saveProgress = useCallback(
    async (currentStep, completed = false) => {
      if (!uid || !lessonId) return;

      try {
        const docRef = doc(db, "users", uid, "progress", lessonId);

        // time spent
        const sessionTime = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : 0;
        const totalTime = timeAccumulatedRef.current + Math.max(sessionTime, 0);

        const isFirstTime = !progress?.startedAt;
        const isNowComplete = completed && !progress?.completed;

        const totalSteps = lessonMeta.totalSteps || progress?.totalSteps || 0;

        const data = {
          lessonId,
          lessonTitle: lessonMeta.title || lessonId,
          category: lessonMeta.category || "Unknown",
          difficulty: lessonMeta.difficulty || "medium",
          currentStep,
          totalSteps,
          status: completed
            ? "completed"
            : currentStep > 0
            ? "in_progress"
            : "not_started",
          completed,
          timeSpent: totalTime,
          attempts: (progress?.attempts || 0) + (isFirstTime ? 1 : 0),
          lastAccessedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        if (isFirstTime) data.startedAt = serverTimestamp();
        if (isNowComplete) data.completedAt = serverTimestamp();

        await setDoc(docRef, data, { merge: true });

        setProgress((prev) => ({ ...(prev || {}), ...data }));

        // reset time tracking
        startTimeRef.current = Date.now();
        timeAccumulatedRef.current = totalTime;
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    },
    [uid, lessonId, progress, lessonMeta]
  );

  const markComplete = useCallback(async () => {
    await saveProgress(progress?.currentStep || 0, true);
  }, [saveProgress, progress?.currentStep]);

  const saveNotes = useCallback(
    async (notes) => {
      if (!uid || !lessonId) return;

      try {
        const docRef = doc(db, "users", uid, "progress", lessonId);
        await setDoc(
          docRef,
          { notes, lastAccessedAt: serverTimestamp(), updatedAt: serverTimestamp() },
          { merge: true }
        );
        setProgress((prev) => ({ ...(prev || {}), notes }));
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    },
    [uid, lessonId]
  );

  return {
    progress,
    loading,
    saveProgress,
    markComplete,
    saveNotes,
    isAuthenticated: !!uid,
  };
}

// Hook to get all progress for a user
export function useAllProgress() {
  const [uid, setUid] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAllProgress() {
      if (!uid) {
        setAllProgress([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const progressRef = collection(db, "users", uid, "progress");
        const q = query(progressRef, orderBy("lastAccessedAt", "desc"));
        const snapshot = await getDocs(q);

        if (cancelled) return;

        const progressList = [];
        let completed = 0;
        let inProgress = 0;

        snapshot.forEach((d) => {
          const data = { id: d.id, ...d.data() };
          progressList.push(data);
          if (data.completed) completed++;
          else if (data.status === "in_progress" || (data.currentStep || 0) > 0) inProgress++;
        });

        setAllProgress(progressList);
        setStats({
          total: progressList.length,
          completed,
          inProgress,
          notStarted: Math.max(0, 75 - completed - inProgress), // adjust if needed
        });
      } catch (error) {
        console.error("Error loading all progress:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAllProgress();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { allProgress, loading, stats, isAuthenticated: !!uid };
}

// Hook to get progress by category
export function useProgressByCategory() {
  const [uid, setUid] = useState(null);
  const [categoryProgress, setCategoryProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCategoryProgress() {
      if (!uid) {
        setCategoryProgress({});
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const progressRef = collection(db, "users", uid, "progress");
        const snapshot = await getDocs(progressRef);

        if (cancelled) return;

        const byCategory = {};

        snapshot.forEach((d) => {
          const data = d.data();
          const category = data.category || "Unknown";

          if (!byCategory[category]) {
            byCategory[category] = { total: 0, completed: 0, inProgress: 0, timeSpent: 0 };
          }

          byCategory[category].total++;
          byCategory[category].timeSpent += data.timeSpent || 0;

          if (data.completed) byCategory[category].completed++;
          else if (data.status === "in_progress") byCategory[category].inProgress++;
        });

        setCategoryProgress(byCategory);
      } catch (error) {
        console.error("Error loading category progress:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategoryProgress();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { categoryProgress, loading, isAuthenticated: !!uid };
}
