/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import { useRouter } from "next/router";

interface IAuthContext {
  user: Record<string, unknown> | null;
  signInWithGoogle: () => void
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  signInWithGoogle: () => { }
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log("🚀 ~ token:", token)
        // The signed-in user info.
        const user = result.user;
        console.log("🚀 ~ user:", user)
        router.push('/')
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log("🚀 ~ errorCode:", errorCode)
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

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
        signInWithGoogle
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