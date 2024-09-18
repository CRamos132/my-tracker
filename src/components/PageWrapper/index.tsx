import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Menu from "../Menu";
import { useRouter } from "next/router";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isInit } = useAuth()

  useEffect(() => {
    console.log("🚀 ~ user wrapper:", user)
    if (!user && isInit) {
      router.push('/login')
      return
    }
  }, [isInit, router, user])

  return (
    <div>
      {children}
      <Menu />
    </div>
  )
}