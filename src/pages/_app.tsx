import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { TasksProvider } from "../contexts/TasksContext";

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <TasksProvider>
            <Component {...pageProps} />
          </TasksProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
