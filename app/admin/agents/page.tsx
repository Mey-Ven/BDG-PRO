"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgentList from "@/components/admin/agent-list"
import AgentStats from "@/components/admin/agent-stats"

export default function AgentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Rediriger si l'utilisateur n'est pas administrateur
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/")
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
    <div className="flex min-h-screen flex-col p-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto py-8">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Gestion des agents</h1>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Liste des agents</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <AgentList />
          </TabsContent>
          <TabsContent value="stats">
            <AgentStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
