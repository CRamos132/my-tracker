/* eslint-disable @typescript-eslint/no-explicit-any */
import { onAuthStateChanged } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/router";

interface IAuthContext {
  user: Record<string, unknown> | null;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, data => {
      console.log("🚀 ~ user:", data)
      if (!data) return
      // data.getIdTokenResult().then((IdTokenResult) => {
      //   if (IdTokenResult?.claims?.admin) {
      //     // setIsAdmin(true)
      //   }
      // })
      setUser(data)
    });
    return unsubscribe;
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };