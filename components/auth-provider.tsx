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
import { DEMO_ENABLED } from "@/lib/demo-data";
import { UserProfile } from "@/lib/types";

type DemoRole = "user" | "admin";

const DEMO_ROLE_KEY = "part107-demo-role";
/** Fixed ~30-day demo subscription expiry, computed once at module load. */
const DEMO_SUBSCRIPTION_EXPIRY = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  /** Real profile when signed in; synthesized demo profile in demo mode. */
  effectiveProfile: UserProfile | null;
  demo: boolean;
  demoRole: DemoRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  enterDemo: (role: DemoRole) => void;
  exitDemo: () => void;
  setDemoRole: (role: DemoRole) => void;
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
  const [authLoading, setAuthLoading] = React.useState(true);
  const [demoReady, setDemoReady] = React.useState(false);
  const [storedDemoRole, setStoredDemoRole] = React.useState<DemoRole | null>(null);

  // Restore a persisted demo session after mount. sessionStorage is
  // browser-only, so this runs post-hydration; `loading` stays true until it
  // completes so consumers (e.g. admin role guards) never observe a pre-demo
  // render and bounce.
  React.useEffect(() => {
    void Promise.resolve().then(() => {
      if (DEMO_ENABLED) {
        const stored = window.sessionStorage.getItem(DEMO_ROLE_KEY);
        if (stored === "user" || stored === "admin") {
          setStoredDemoRole(stored);
        }
      }
      setDemoReady(true);
    });
  }, []);

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
      setAuthLoading(false);
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

  const enterDemo = React.useCallback((role: DemoRole) => {
    if (!DEMO_ENABLED) return;
    window.sessionStorage.setItem(DEMO_ROLE_KEY, role);
    setStoredDemoRole(role);
  }, []);

  const exitDemo = React.useCallback(() => {
    window.sessionStorage.removeItem(DEMO_ROLE_KEY);
    setStoredDemoRole(null);
  }, []);

  const setDemoRole = React.useCallback(
    (role: DemoRole) => {
      if (!DEMO_ENABLED || storedDemoRole === null) return;
      window.sessionStorage.setItem(DEMO_ROLE_KEY, role);
      setStoredDemoRole(role);
    },
    [storedDemoRole]
  );

  const demo = DEMO_ENABLED && storedDemoRole !== null;
  const demoRole: DemoRole = storedDemoRole ?? "user";

  // Auth is "loading" until Firebase has resolved AND any persisted demo
  // session has been restored, so role guards never see a pre-demo render.
  const loading = authLoading || !demoReady;

  const demoProfile = React.useMemo<UserProfile | null>(() => {
    if (!demo) return null;
    return {
      uid: "demo",
      email: "demo@part107.app",
      displayName: demoRole === "admin" ? "Demo Commander" : "Demo Pilot",
      photoURL: null,
      role: demoRole,
      subscriptionStatus: "active",
      planId: "monthly",
      subscriptionExpiry: DEMO_SUBSCRIPTION_EXPIRY,
      stripeCustomerId: "demo",
      stripeSubscriptionId: null,
      cancelAtPeriodEnd: false,
      registration: null,
    };
  }, [demo, demoRole]);

  const effectiveProfile = demo ? demoProfile : profile;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        effectiveProfile,
        demo,
        demoRole,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
        enterDemo,
        exitDemo,
        setDemoRole,
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
