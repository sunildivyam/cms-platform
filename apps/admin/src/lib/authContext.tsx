"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser, ParsedToken } from "firebase/auth";
import { auth } from "./firebase";

type AuthState = {
  user: FirebaseUser | null;
  claims: ParsedToken | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  claims: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [claims, setClaims] = useState<ParsedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const token = await u.getIdTokenResult();
        setUser(u);
        setClaims(token.claims);
      } else {
        setUser(null);
        setClaims(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, claims, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
