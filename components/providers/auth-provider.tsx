"use client"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Suppress NextAuth errors in console
  useEffect(() => {
    const originalError = console.error
    console.error = (...args: any[]) => {
      // Filter out NextAuth ClientFetchError
      if (
        args[0]?.message?.includes?.("ClientFetchError") ||
        args[0]?.message?.includes?.("Unexpected token '<'") ||
        args[0]?.message?.includes?.("is not valid JSON")
      ) {
        return // Suppress these errors
      }
      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
