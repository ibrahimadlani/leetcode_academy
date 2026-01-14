"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useBookmarks() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id || session?.user?.email;

  // Load bookmarks with real-time updates
  useEffect(() => {
    if (!userId) {
      setBookmarks([]);
      setBookmarkIds(new Set());
      setLoading(false);
      return;
    }

    const bookmarksRef = collection(db, "users", userId, "bookmarks");
    const q = query(bookmarksRef, orderBy("bookmarkedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookmarkList = [];
        const ids = new Set();

        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          bookmarkList.push(data);
          ids.add(doc.id);
        });

        setBookmarks(bookmarkList);
        setBookmarkIds(ids);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading bookmarks:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Add a bookmark
  const addBookmark = useCallback(
    async (lesson) => {
      if (!userId || !lesson?.id) return;

      try {
        const docRef = doc(db, "users", userId, "bookmarks", lesson.id);
        await setDoc(docRef, {
          lessonId: lesson.id,
          lessonTitle: lesson.title || lesson.id,
          category: lesson.category || "Unknown",
          difficulty: lesson.difficulty || "medium",
          bookmarkedAt: serverTimestamp(),
          notes: null,
        });
      } catch (error) {
        console.error("Error adding bookmark:", error);
        throw error;
      }
    },
    [userId]
  );

  // Remove a bookmark
  const removeBookmark = useCallback(
    async (lessonId) => {
      if (!userId || !lessonId) return;

      try {
        const docRef = doc(db, "users", userId, "bookmarks", lessonId);
        await deleteDoc(docRef);
      } catch (error) {
        console.error("Error removing bookmark:", error);
        throw error;
      }
    },
    [userId]
  );

  // Toggle bookmark
  const toggleBookmark = useCallback(
    async (lesson) => {
      if (!lesson?.id) return;

      if (bookmarkIds.has(lesson.id)) {
        await removeBookmark(lesson.id);
      } else {
        await addBookmark(lesson);
      }
    },
    [bookmarkIds, addBookmark, removeBookmark]
  );

  // Check if a lesson is bookmarked
  const isBookmarked = useCallback(
    (lessonId) => {
      return bookmarkIds.has(lessonId);
    },
    [bookmarkIds]
  );

  // Update bookmark notes
  const updateBookmarkNotes = useCallback(
    async (lessonId, notes) => {
      if (!userId || !lessonId) return;

      try {
        const docRef = doc(db, "users", userId, "bookmarks", lessonId);
        await setDoc(docRef, { notes }, { merge: true });
      } catch (error) {
        console.error("Error updating bookmark notes:", error);
        throw error;
      }
    },
    [userId]
  );

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    updateBookmarkNotes,
    bookmarkCount: bookmarks.length,
    isAuthenticated: !!userId,
  };
}
