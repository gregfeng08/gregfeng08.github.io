// Auth context: wraps Firebase Google sign-in and exposes whether the current
// user is the site admin. "isAdmin" is a client-side hint for showing edit UI;
// the server independently verifies the ID token on every write, so this is
// not a security boundary — it just decides what to render.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, firebaseEnabled } from "./firebase";
import { setTokenGetter } from "./api";

interface AuthValue {
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
  enabled: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

// Admin allow-list — mirrors ADMIN_EMAIL on the server. The server is the real
// gate; this only controls whether edit affordances appear.
const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase() ||
  "gregfeng08@gmail.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseEnabled);

  useEffect(() => {
    // Attach ID tokens to API calls whenever a user is signed in.
    setTokenGetter(async () =>
      auth?.currentUser ? auth.currentUser.getIdToken() : null,
    );
    if (!firebaseEnabled || !auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => {
      unsub();
      setTokenGetter(null);
    };
  }, []);

  const value = useMemo<AuthValue>(() => {
    const isAdmin =
      !!user && !!user.email && user.email.toLowerCase() === ADMIN_EMAIL;

    return {
      user,
      isAdmin,
      authReady,
      enabled: firebaseEnabled,
      signIn: async () => {
        if (!auth) return;
        await signInWithPopup(auth, googleProvider);
      },
      signOut: async () => {
        if (!auth) return;
        await fbSignOut(auth);
      },
      getToken: async () => {
        if (!auth?.currentUser) return null;
        return auth.currentUser.getIdToken();
      },
    };
  }, [user, authReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
