"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Type pour les statistiques
type AgentStats = {
  agentId: string
  agentName: string
  count: number
}

type Stats = {
  totalSubmissions: number
  submissionsByAgent: AgentStats[]
}

export default function AgentStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents/stats')
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques')
      }
      
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Erreur lors de la récupération des statistiques')
    } finally {
      setLoading(false)
    }
  }

  // Charger les statistiques au chargement du composant
  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Statistiques des agents</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !stats ? (
        <div className="text-center py-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Aucune statistique disponible</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Nombre total de soumissions</CardTitle>
              <CardDescription>
                Nombre total de formulaires soumis via un code de référence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalSubmissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soumissions par agent</CardTitle>
              <CardDescription>
                Classement des agents par nombre de soumissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.submissionsByAgent.length === 0 ? (
                <p className="text-muted-foreground">Aucune soumission enregistrée</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead className="text-right">Soumissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.submissionsByAgent.map((stat) => (
                      <TableRow key={stat.agentId}>
                        <TableCell className="font-medium">{stat.agentName}</TableCell>
                        <TableCell className="text-right">{stat.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
