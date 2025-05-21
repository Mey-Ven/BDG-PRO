"use client"

import { useState, useEffect } from "react"
import {
  Users,
  ClipboardList,
  UserCog,
  ArrowUpRight,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types pour les statistiques
type DashboardStats = {
  totalUsers: number
  totalAgents: number
  totalSubmissions: number
  recentSubmissions: {
    id: string
    formType: string
    createdAt: string
    userEmail?: string
    agentName?: string
  }[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        console.log('Fetching dashboard stats...')
        const response = await fetch('/api/admin/dashboard-stats')

        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error details:', errorText)
          throw new Error(`Erreur lors de la récupération des statistiques: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Dashboard stats received:', data)
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue dans l'interface d'administration
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs
              </CardTitle>
              <CardDescription>
                Nombre total d'utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.totalUsers || 0}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/admin/users">
                  Gérer les utilisateurs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Agents
              </CardTitle>
              <CardDescription>
                Nombre total d'agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.totalAgents || 0}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/admin/agents">
                  Gérer les agents
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Soumissions
              </CardTitle>
              <CardDescription>
                Nombre total de soumissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.totalSubmissions || 0}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/admin/submissions">
                  Voir les soumissions
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Accès rapide</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Gestion des utilisateurs
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/agents">
                <UserCog className="mr-2 h-4 w-4" />
                Gestion des agents
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/submissions">
                <ClipboardList className="mr-2 h-4 w-4" />
                Soumissions de formulaires
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/stats">
                <Activity className="mr-2 h-4 w-4" />
                Statistiques détaillées
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Soumissions récentes</CardTitle>
            <CardDescription>
              Les dernières soumissions de formulaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{submission.formType === 'carDamage' ? 'Dommage vitre' : 'Partenaire'}</p>
                      <p className="text-sm text-muted-foreground">
                        {submission.userEmail || submission.agentName || 'Anonyme'}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune soumission récente
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href="/admin/submissions">
                Voir toutes les soumissions
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
