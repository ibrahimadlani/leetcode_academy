# Architecture Firestore - LeetCode Academy

## Vue d'ensemble

```
firestore/
├── users/{userId}                    # Profil utilisateur principal
│   ├── progress/{lessonId}           # Progression par leçon (sous-collection)
│   └── bookmarks/{lessonId}          # Leçons sauvegardées (sous-collection)
├── subscriptions/{userId}            # Abonnement Stripe
└── analytics/{userId}                # Statistiques d'apprentissage
```

---

## Collections

### 1. `users/{userId}` - Profil Utilisateur

Document principal contenant les informations du profil.

```typescript
{
  // Identité
  id: string,                         // ID unique (OAuth sub ou email)
  email: string,
  name: string,
  image: string | null,               // Avatar URL

  // Métadonnées
  createdAt: Timestamp,               // Date de création du compte
  lastLoginAt: Timestamp,             // Dernière connexion
  updatedAt: Timestamp,

  // Préférences
  preferences: {
    language: "python" | "java" | "cpp",  // Langage de code préféré
    theme: "light" | "dark" | "system",   // Thème UI
    emailNotifications: boolean,           // Recevoir des emails
  },

  // Statistiques rapides (dénormalisées pour performance)
  stats: {
    totalCompleted: number,           // Nombre de leçons terminées
    currentStreak: number,            // Jours consécutifs d'apprentissage
    longestStreak: number,            // Record de streak
    lastActivityAt: Timestamp,        // Dernière activité
  },

  // Provider OAuth
  provider: "github" | "google",
  providerId: string,                 // ID du provider OAuth
}
```

---

### 2. `users/{userId}/progress/{lessonId}` - Progression

Sous-collection pour suivre la progression de chaque leçon.

```typescript
{
  lessonId: string,                   // ID de la leçon (ex: "two-sum")
  lessonTitle: string,                // Titre pour affichage rapide
  category: string,                   // Catégorie (ex: "Arrays & Hashing")
  difficulty: "easy" | "medium" | "hard",

  // État de progression
  status: "not_started" | "in_progress" | "completed",
  currentStep: number,                // Étape actuelle dans le walkthrough
  totalSteps: number,                 // Nombre total d'étapes
  completed: boolean,

  // Temps passé
  timeSpent: number,                  // Temps total en secondes
  attempts: number,                   // Nombre de tentatives

  // Dates
  startedAt: Timestamp | null,
  completedAt: Timestamp | null,
  lastAccessedAt: Timestamp,

  // Notes personnelles (optionnel)
  notes: string | null,
}
```

---

### 3. `users/{userId}/bookmarks/{lessonId}` - Favoris

Sous-collection pour les leçons sauvegardées.

```typescript
{
  lessonId: string,
  lessonTitle: string,
  category: string,
  difficulty: "easy" | "medium" | "hard",
  bookmarkedAt: Timestamp,
  notes: string | null,               // Notes personnelles
}
```

---

### 4. `subscriptions/{userId}` - Abonnement

Document pour la gestion des abonnements Stripe.

```typescript
{
  // État
  status: "active" | "cancelled" | "past_due" | "inactive",
  type: "lifetime" | "subscription",
  planId: "lifetime" | "yearly",

  // Stripe
  stripeCustomerId: string,
  stripeSubscriptionId: string | null,  // Null pour lifetime
  stripePaymentIntentId: string | null, // Pour paiements uniques

  // Période de facturation
  currentPeriodStart: Timestamp | null,
  currentPeriodEnd: Timestamp | null,
  expiresAt: Timestamp | null,          // Null pour lifetime

  // Prix payé
  amount: number,                       // En centimes
  currency: "eur" | "usd",

  // Métadonnées
  createdAt: Timestamp,
  updatedAt: Timestamp,
  cancelledAt: Timestamp | null,
  cancelReason: string | null,
}
```

---

### 5. `analytics/{userId}` - Analytiques détaillées

Document pour les statistiques d'apprentissage avancées.

```typescript
{
  userId: string,

  // Progression par catégorie
  categoryProgress: {
    [categoryName: string]: {
      total: number,                  // Nombre total de leçons
      completed: number,              // Nombre complétées
      inProgress: number,             // En cours
      averageTime: number,            // Temps moyen en secondes
    }
  },

  // Progression par difficulté
  difficultyProgress: {
    easy: { total: number, completed: number },
    medium: { total: number, completed: number },
    hard: { total: number, completed: number },
  },

  // Activité
  activityHistory: [                  // Derniers 30 jours
    {
      date: string,                   // Format "YYYY-MM-DD"
      lessonsCompleted: number,
      timeSpent: number,              // En secondes
      lessonsAccessed: string[],      // IDs des leçons visitées
    }
  ],

  // Streaks
  streakData: {
    currentStreak: number,
    longestStreak: number,
    lastActivityDate: string,         // "YYYY-MM-DD"
  },

  // Performance
  totalTimeSpent: number,             // Temps total en secondes
  totalLessonsCompleted: number,
  averageTimePerLesson: number,

  updatedAt: Timestamp,
}
```

---

## Index recommandés

```javascript
// Index composites pour requêtes fréquentes

// 1. Progression par statut et date
users/{userId}/progress
  - status ASC, lastAccessedAt DESC

// 2. Bookmarks par date
users/{userId}/bookmarks
  - bookmarkedAt DESC

// 3. Subscriptions actives
subscriptions
  - status ASC, type ASC
```

---

## Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Utilisateurs: lecture/écriture uniquement pour le propriétaire
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /progress/{lessonId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /bookmarks/{lessonId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Subscriptions: lecture pour le propriétaire, écriture via webhook uniquement
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Écriture uniquement côté serveur
    }

    // Analytics: lecture seule pour le propriétaire
    match /analytics/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Écriture uniquement côté serveur
    }
  }
}
```

---

## Exemple d'utilisation

```javascript
// Créer/mettre à jour un utilisateur
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

await setDoc(doc(db, "users", userId), {
  email: session.user.email,
  name: session.user.name,
  image: session.user.image,
  updatedAt: serverTimestamp(),
  lastLoginAt: serverTimestamp(),
}, { merge: true });

// Sauvegarder la progression
await setDoc(doc(db, "users", userId, "progress", lessonId), {
  lessonId,
  currentStep: 5,
  status: "in_progress",
  lastAccessedAt: serverTimestamp(),
}, { merge: true });

// Ajouter un bookmark
await setDoc(doc(db, "users", userId, "bookmarks", lessonId), {
  lessonId,
  lessonTitle: "Two Sum",
  bookmarkedAt: serverTimestamp(),
});
```
