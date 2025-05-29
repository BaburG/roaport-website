"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin/statistics"

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User is authenticated, redirecting to:", callbackUrl)
      router.replace(callbackUrl)
    }
  }, [status, session, callbackUrl, router])

  const handleLogin = async () => {
    try {
      const result = await signIn("keycloak", {
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        console.error("Sign in error:", result.error)
        toast.error("Giriş başarısız oldu. Lütfen daha sonra tekrar deneyin.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Giriş başarısız oldu. Lütfen daha sonra tekrar deneyin.")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Admin Girişi</CardTitle>
          <CardDescription>
            Keycloak hesabınızla giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={handleLogin}
          >
            Keycloak ile Giriş Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 