"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useProgress(lessonId) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  // Load progress from Firestore
  useEffect(() => {
    async function loadProgress() {
      if (!userId || !lessonId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", userId, "progress", lessonId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProgress(docSnap.data());
        } else {
          setProgress({ currentStep: 0, completed: false });
        }
      } catch (error) {
        console.error("Error loading progress:", error);
        setProgress({ currentStep: 0, completed: false });
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [userId, lessonId]);

  // Save progress to Firestore
  const saveProgress = useCallback(
    async (currentStep, completed = false) => {
      if (!userId || !lessonId) return;

      try {
        const docRef = doc(db, "users", userId, "progress", lessonId);
        const data = {
          currentStep,
          completed,
          lastUpdated: new Date().toISOString(),
        };

        await setDoc(docRef, data, { merge: true });
        setProgress(data);
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    },
    [userId, lessonId]
  );

  // Mark lesson as completed
  const markComplete = useCallback(async () => {
    await saveProgress(progress?.currentStep || 0, true);
  }, [saveProgress, progress?.currentStep]);

  return {
    progress,
    loading,
    saveProgress,
    markComplete,
    isAuthenticated: !!userId,
  };
}
