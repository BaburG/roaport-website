import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    roles?: string[]
  }
  
  interface Session {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    error?: string
    user: {
      id: string
      role: string
      roles?: string[]
      groups?: string[]
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    expiresAt?: number
    error?: string
    user?: {
      id: string
      role: string
      roles?: string[]
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
} 