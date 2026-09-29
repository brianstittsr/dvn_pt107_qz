"use client";

import * as React from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuthInstance, getDbInstance } from "@/lib/firebase";
import { UserProfile } from "@/lib/types";

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function buildProfile(uid: string, snap: UserProfile | undefined): UserProfile {
  return {
    uid,
    email: snap?.email ?? null,
    displayName: snap?.displayName ?? null,
    photoURL: snap?.photoURL ?? null,
    role: snap?.role ?? "user",
    subscriptionStatus: snap?.subscriptionStatus ?? "inactive",
    subscriptionExpiry: snap?.subscriptionExpiry ?? null,
    stripeCustomerId: snap?.stripeCustomerId ?? null,
    stripeSubscriptionId: snap?.stripeSubscriptionId ?? null,
    planId: snap?.planId ?? null,
    cancelAtPeriodEnd: snap?.cancelAtPeriodEnd ?? false,
    registration: snap?.registration ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    return onAuthStateChanged(getAuthInstance(), async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(getDbInstance(), "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? (snap.data() as UserProfile) : undefined;
        const built = buildProfile(firebaseUser.uid, data);
        setProfile(built);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: "user",
            subscriptionStatus: "inactive",
            subscriptionExpiry: null,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            planId: null,
            cancelAtPeriodEnd: false,
            registration: null,
            createdAt: serverTimestamp(),
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuthInstance(), provider);
  }, []);

  const signInWithEmail = React.useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getAuthInstance(), email, password);
  }, []);

  const signUpWithEmail = React.useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(getAuthInstance(), email, password);
  }, []);

  const signOut = React.useCallback(async () => {
    await firebaseSignOut(getAuthInstance());
  }, []);

  const refreshProfile = React.useCallback(async () => {
    const current = getAuthInstance().currentUser;
    if (!current) return;
    const snap = await getDoc(doc(getDbInstance(), "users", current.uid));
    setProfile(buildProfile(current.uid, snap.exists() ? (snap.data() as UserProfile) : undefined));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
