/* eslint-disable @typescript-eslint/no-explicit-any */
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase";
import { useRouter } from "next/router";

interface IAuthContext {
  user: Record<string, any> | null;
  signInWithGoogle: () => void
  isInit: boolean
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  signInWithGoogle: () => { },
  isInit: false
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isInit, setIsInit] = useState(false)
  const router = useRouter()

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        // The signed-in user info.
        // const user = result.user;
        router.push('/')
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.error("errorCode:", errorCode)
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
      setIsInit(true)
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
        signInWithGoogle,
        isInit
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