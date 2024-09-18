import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Menu from "../Menu";
import { useRouter } from "next/router";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    console.log("🚀 ~ user wrapper:", user)
    if (!user) {
      router.push('/login')
      return
    }
  }, [router, user])

  return (
    <div>
      {children}
      <Menu />
    </div>
  )
}