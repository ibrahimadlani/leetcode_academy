"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useSubscription() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const userId = session.user.id || session.user.email;
    const unsubscribe = onSnapshot(
      doc(db, "subscriptions", userId),
      (doc) => {
        if (doc.exists()) {
          setSubscription(doc.data());
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Subscription listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [session]);

  const isPremium =
    subscription?.status === "active" &&
    (subscription?.type === "lifetime" ||
      (subscription?.type === "subscription" &&
        (!subscription?.expiresAt ||
          new Date(subscription.expiresAt.toDate()) > new Date())));

  return {
    subscription,
    isPremium,
    loading,
  };
}
