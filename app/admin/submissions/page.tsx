"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, RefreshCw, Trash2, Download } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Type pour une soumission de formulaire
type FormSubmission = {
  id: string
  formType: string
  formData: string
  createdAt: string
  user?: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  } | null
  agent?: {
    id: string
    name: string
    referralCode: string
  } | null
  referralCode?: string | null
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [formTypeFilter, setFormTypeFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Charger les soumissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      console.log('Fetching submissions...')
      const response = await fetch('/api/admin/submissions')

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error details:', errorText)
        throw new Error(`Erreur lors de la récupération des soumissions: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Submissions received:', data)

      if (data.submissions && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions)
      } else {
        console.error('Invalid submissions data:', data)
        toast.error('Format de données invalide')
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Erreur lors de la récupération des soumissions')
    } finally {
      setLoading(false)
    }
  }

  // Charger les soumissions au chargement du composant
  useEffect(() => {
    fetchSubmissions()
  }, [])

  // Supprimer une soumission
  const deleteSubmission = async () => {
    if (!selectedSubmission) return

    try {
      const response = await fetch(`/api/admin/submissions/${selectedSubmission.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression de la soumission')
      }

      toast.success('Soumission supprimée avec succès')
      setOpenDeleteDialog(false)
      fetchSubmissions()
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression de la soumission')
    }
  }

  // Ouvrir le dialogue de visualisation
  const openViewDialogWithSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setOpenViewDialog(true)
  }

  // Ouvrir le dialogue de suppression
  const openDeleteDialogWithSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setOpenDeleteDialog(true)
  }

  // Filtrer les soumissions
  const filteredSubmissions = submissions.filter(submission => {
    // Filtrer par type de formulaire
    if (formTypeFilter !== "all" && submission.formType !== formTypeFilter) {
      return false
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const formData = JSON.parse(submission.formData)

      // Rechercher dans les données du formulaire
      const formDataString = JSON.stringify(formData).toLowerCase()
      if (formDataString.includes(searchLower)) {
        return true
      }

      // Rechercher dans les informations de l'utilisateur
      if (submission.user && (
        submission.user.email.toLowerCase().includes(searchLower) ||
        (submission.user.firstName && submission.user.firstName.toLowerCase().includes(searchLower)) ||
        (submission.user.lastName && submission.user.lastName.toLowerCase().includes(searchLower))
      )) {
        return true
      }

      // Rechercher dans les informations de l'agent
      if (submission.agent && (
        submission.agent.name.toLowerCase().includes(searchLower) ||
        submission.agent.referralCode.toLowerCase().includes(searchLower)
      )) {
        return true
      }

      // Rechercher dans le code de référence
      if (submission.referralCode && submission.referralCode.toLowerCase().includes(searchLower)) {
        return true
      }

      return false
    }

    return true
  })

  // Exporter les données au format JSON
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(filteredSubmissions, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `submissions-export-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()

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
          <h1 className="text-3xl font-bold">Soumissions de formulaires</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez les soumissions de formulaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubmissions}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={loading || filteredSubmissions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="space-y-2 w-1/3">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2 w-1/4">
          <Label htmlFor="formType">Type de formulaire</Label>
          <Select
            value={formTypeFilter}
            onValueChange={setFormTypeFilter}
          >
            <SelectTrigger id="formType">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="carDamage">Dommage vitre</SelectItem>
              <SelectItem value="partner">Partenaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Aucune soumission trouvée</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Aucune soumission ne correspond aux critères de recherche</p>
          <Button
            variant="link"
            onClick={() => {
              setFormTypeFilter("all")
              setSearchTerm("")
            }}
            className="mt-2"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead className="font-bold">Agent Référent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <Badge variant={submission.formType === 'carDamage' ? "default" : "secondary"}>
                      {submission.formType === 'carDamage' ? 'Dommage vitre' : 'Partenaire'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {submission.user ? (
                      <div>
                        <p className="font-medium">
                          {submission.user.firstName} {submission.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {submission.user.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Anonyme</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.agent ? (
                      <div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-1">
                          Agent: {submission.agent.name}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Code: {submission.agent.referralCode}
                        </p>
                      </div>
                    ) : submission.referralCode ? (
                      <div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Code non associé
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Référence: {submission.referralCode}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Aucune référence</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewDialogWithSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialogWithSubmission(submission)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogue de visualisation */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la soumission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Type de formulaire</h3>
                  <Badge variant={selectedSubmission.formType === 'carDamage' ? "default" : "secondary"}>
                    {selectedSubmission.formType === 'carDamage' ? 'Dommage vitre' : 'Partenaire'}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date de soumission</h3>
                  <p>{new Date(selectedSubmission.createdAt).toLocaleDateString()} {new Date(selectedSubmission.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              {selectedSubmission.user && (
                <div>
                  <h3 className="font-semibold mb-1">Utilisateur</h3>
                  <p>Nom: {selectedSubmission.user.firstName} {selectedSubmission.user.lastName}</p>
                  <p>Email: {selectedSubmission.user.email}</p>
                </div>
              )}

              {(selectedSubmission.agent || selectedSubmission.referralCode) && (
                <div className={selectedSubmission.agent ? "border p-4 rounded-md bg-green-50" : "border p-4 rounded-md bg-yellow-50"}>
                  <h3 className="font-semibold mb-2">
                    {selectedSubmission.agent ? "Agent Référent" : "Code de Référence"}
                  </h3>
                  {selectedSubmission.agent ? (
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="font-medium w-24">Nom:</span>
                        <span>{selectedSubmission.agent.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium w-24">Code:</span>
                        <span>{selectedSubmission.agent.referralCode}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="font-medium w-24">Code:</span>
                      <span>{selectedSubmission.referralCode}</span>
                      <span className="ml-2 text-yellow-600 text-sm">(Agent non identifié)</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-1">Données du formulaire</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {JSON.stringify(JSON.parse(selectedSubmission.formData), null, 2)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenViewDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la soumission</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer cette soumission ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={deleteSubmission}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
