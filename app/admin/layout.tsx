"use client"

import { useAuth } from "@/components/auth/auth-context"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Rediriger si l'utilisateur n'est pas administrateur
  // Cette vérification est redondante avec le middleware, mais c'est une sécurité supplémentaire
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/login?redirect=/admin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Sera redirigé dans useEffect
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 bg-muted/30 overflow-auto lg:ml-0 w-full">
        {children}
      </main>
    </div>
  )
}
