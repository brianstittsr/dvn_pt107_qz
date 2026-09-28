import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminDbInstance: Firestore | null = null;

export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    if (!getApps().length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Firebase Admin SDK credentials are not configured");
      }
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
    adminDbInstance = getFirestore();
  }
  return adminDbInstance;
}
