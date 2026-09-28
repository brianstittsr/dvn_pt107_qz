import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client SDK should only be used in the browser");
  }
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_API_KEY is missing. Create a .env.local file from env.example and restart the dev server."
    );
  }
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

function getClientAuth(): Auth {
  return getAuth(getFirebaseApp());
}

function getClientDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function getAuthInstance(): Auth {
  if (!authInstance) authInstance = getClientAuth();
  return authInstance;
}

export function getDbInstance(): Firestore {
  if (!dbInstance) dbInstance = getClientDb();
  return dbInstance;
}
