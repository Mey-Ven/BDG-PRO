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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Types pour les statistiques
type AgentStats = {
  id: string
  name: string
  referralCode: string
  submissionCount: number
}

type FormTypeStats = {
  type: string
  count: number
}

type MonthlyStats = {
  month: string
  carDamage: number
  partner: number
  total: number
}

type Stats = {
  totalSubmissions: number
  totalUsers: number
  totalAgents: number
  agentStats: AgentStats[]
  formTypeStats: FormTypeStats[]
  monthlyStats: MonthlyStats[]
}

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("all")

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      setLoading(true)
      console.log('Fetching stats...')
      const response = await fetch(`/api/admin/stats?timeRange=${timeRange}`)

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error details:', errorText)
        throw new Error(`Erreur lors de la récupération des statistiques: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Stats received:', data)

      if (data.success && data.stats) {
        // Vérifier et normaliser les données pour éviter les erreurs d'affichage
        const normalizedStats = {
          totalSubmissions: data.stats.totalSubmissions || 0,
          totalUsers: data.stats.totalUsers || 0,
          totalAgents: data.stats.totalAgents || 0,
          agentStats: Array.isArray(data.stats.agentStats) ? data.stats.agentStats : [],
          formTypeStats: Array.isArray(data.stats.formTypeStats) ? data.stats.formTypeStats : [],
          monthlyStats: Array.isArray(data.stats.monthlyStats) ? data.stats.monthlyStats : []
        }

        // S'assurer que les tableaux ne sont pas vides pour éviter les erreurs dans les graphiques
        if (normalizedStats.formTypeStats.length === 0) {
          normalizedStats.formTypeStats = [
            { type: 'Aucune donnée', count: 0 }
          ]
        }

        if (normalizedStats.monthlyStats.length === 0) {
          normalizedStats.monthlyStats = [
            { month: 'Aucune donnée', carDamage: 0, partner: 0, total: 0 }
          ]
        }

        if (normalizedStats.agentStats.length === 0) {
          normalizedStats.agentStats = [
            { id: '0', name: 'Aucun agent', referralCode: 'N/A', submissionCount: 0 }
          ]
        }

        setStats(normalizedStats)
      } else {
        console.error('Invalid stats data:', data)
        toast.error('Format de données invalide')
      }
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
  }, [timeRange])

  // Exporter les données au format CSV
  const exportData = () => {
    if (!stats) return

    try {
      // Créer les données CSV
      let csv = 'data:text/csv;charset=utf-8,'

      // En-têtes
      csv += 'Agent,Code,Soumissions\n'

      // Données des agents
      stats.agentStats.forEach(agent => {
        csv += `${agent.name},${agent.referralCode},${agent.submissionCount}\n`
      })

      // Créer un lien de téléchargement
      const encodedUri = encodeURI(csv)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `stats-export-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Données exportées avec succès')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Erreur lors de l\'exportation des données')
    }
  }



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Statistiques</h1>
          <p className="text-muted-foreground mt-1">
            Analysez les performances de votre application
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les données</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={loading || !stats}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
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
        <>
          {/* Cartes de statistiques générales */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Soumissions totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalSubmissions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalAgents}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="agents">Performance des agents</TabsTrigger>
              <TabsTrigger value="submissions">Soumissions</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des soumissions</CardTitle>
                  <CardDescription>
                    Nombre de soumissions par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.monthlyStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="carDamage" name="Dommage vitre" fill="#0088FE" />
                        <Bar dataKey="partner" name="Partenaire" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par type de formulaire</CardTitle>
                  <CardDescription>
                    Proportion des différents types de soumissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.formTypeStats}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="type"
                        >
                          {stats.formTypeStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance des agents */}
            <TabsContent value="agents" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance des agents</CardTitle>
                  <CardDescription>
                    Nombre de soumissions par agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.agentStats}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="submissionCount" name="Soumissions" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 des agents</CardTitle>
                  <CardDescription>
                    Les agents les plus performants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.agentStats
                      .sort((a, b) => b.submissionCount - a.submissionCount)
                      .slice(0, 5)
                      .map((agent, index) => (
                        <div key={agent.id} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">Code: {agent.referralCode}</div>
                          </div>
                          <div className="font-bold">{agent.submissionCount}</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Soumissions */}
            <TabsContent value="submissions" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des soumissions</CardTitle>
                  <CardDescription>
                    Tendance des soumissions au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.monthlyStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" name="Total" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
