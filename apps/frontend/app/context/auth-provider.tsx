import { createAuthClient } from "better-auth/react";
import { createContext, useContext } from "react";

const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
});

const AuthContext = createContext<typeof authClient | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={authClient}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const authClient = useContext(AuthContext);
  if (!authClient) {
    throw new Error("Auth client not found");
  }
  return authClient;
}
