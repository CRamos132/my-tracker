import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from "../contexts/AuthContext";
import { TasksProvider } from "../contexts/TasksContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <TasksProvider>
          <Component {...pageProps} />
        </TasksProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}
