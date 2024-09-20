import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Menu from "../Menu";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isInit } = useAuth()

  useEffect(() => {
    if (!user && isInit) {
      router.push('/login')
      return
    }
  }, [isInit, router, user])

  return (
    <Box marginBottom={'100px'}>
      {children}
      <Menu />
    </Box>
  )
}