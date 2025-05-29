import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    roles?: string[]
  }
  
  interface Session {
    accessToken?: string
    idToken?: string
    error?: string
    user: {
      id: string
      role: string
      roles?: string[]
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    idToken?: string
    refreshToken?: string
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