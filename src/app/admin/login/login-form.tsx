"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin/statistics"
  const error = searchParams?.get("error")
  const hasShownError = useRef(false)

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User is authenticated, redirecting to:", callbackUrl)
      toast({
        title: "Giriş başarılı",
        description: "Admin paneline yönlendiriliyorsunuz.",
        variant: "default",
      })
      router.replace(callbackUrl)
    }
  }, [status, session, callbackUrl, router, toast])

  useEffect(() => {
    const showErrorToast = () => {
      if (error === "AccessDenied" && window.location.pathname === "/admin/login" && !hasShownError.current) {
        console.log("toast geldi bro")
        hasShownError.current = true
        
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
        
        setTimeout(() => {
          toast({
            title: "Erişim Reddedildi",
            description: "Admin yetkisine sahip değilsiniz. Sadece admin rolüne sahip kullanıcılar giriş yapabilir.",
            variant: "destructive",
            duration: 5000,
          })
        }, 100)
      }
    }

    showErrorToast()
  }, [error, toast])

  const handleLogin = async () => {
    try {
      await signIn("keycloak", {
        callbackUrl,
        prompt: "login",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Sistem Hatası",
        description: "Giriş yapılırken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      })
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Girişi</CardTitle>
          <CardDescription>
            Keycloak hesabınızla giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            className="w-full"
          >
            Keycloak ile Giriş Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 