"use client"

import LoginForm from "@/components/auth/login-form"
import { useAuth } from "@/components/auth/auth-context"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  // Get redirect path from URL
  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectPath(redirect)
      console.log("Redirect path set to:", redirect)
    }
  }, [searchParams])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      if (user.isAdmin && user.email === "mhmd.bdg.pro1@brisdeglacepro.com" && redirectPath === "/admin") {
        console.log("Admin user detected, redirecting to /admin")
        router.push("/admin")
      } else if (redirectPath) {
        console.log("Redirecting to:", redirectPath)
        router.push(redirectPath)
      } else {
        console.log("No redirect path, going to home")
        router.push("/")
      }
    }
  }, [user, isLoading, router, redirectPath])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
