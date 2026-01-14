"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { app, auth, db, analytics } from "@/lib/firebase";

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Firebase is initialized when this component mounts
    setIsInitialized(true);
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, auth, db, analytics, isInitialized }}>
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
