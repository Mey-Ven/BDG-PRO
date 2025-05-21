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

  // Exporter les données au format CSV
  const exportData = () => {
    try {
      // Définir les en-têtes des colonnes en français
      const headers = [
        "ID",
        "Type de formulaire",
        "Date de soumission",
        "Heure",
        "Prénom",
        "Nom",
        "Email",
        "Téléphone",
        "Plaque d'immatriculation",
        "Assurance",
        "Adresse",
        "Code postal",
        "Ville",
        "Type de vitre",
        "Détails du dommage",
        "Agent référent",
        "Code de référence"
      ];

      // Préparer les lignes de données
      const rows = filteredSubmissions.map(submission => {
        // Extraire les données du formulaire
        const formData = JSON.parse(submission.formData);
        const clientInfo = formData.clientInfo || {};
        const glassType = formData.glassType?.label || "";

        // Extraire les détails du dommage
        let damageDetails = "";
        if (formData.details) {
          // Convertir les détails en texte lisible
          damageDetails = Object.entries(formData.details)
            .map(([key, value]: [string, any]) => {
              if (typeof value === 'object' && value.label) {
                return value.label;
              }
              return value;
            })
            .join(", ");
        }

        // Formater la date et l'heure
        const date = new Date(submission.createdAt);
        const formattedDate = date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const formattedTime = date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        // Préparer les données de l'agent
        const agentName = submission.agent ? submission.agent.name : "";
        const referralCode = submission.agent ? submission.agent.referralCode : (submission.referralCode || "");

        // Retourner une ligne CSV
        return [
          submission.id,
          submission.formType === 'carDamage' ? 'Dommage vitre' : submission.formType,
          formattedDate,
          formattedTime,
          clientInfo.firstName || "",
          clientInfo.lastName || "",
          clientInfo.email || "",
          clientInfo.phone || "",
          clientInfo.licensePlate || "",
          clientInfo.insurance || "",
          clientInfo.address || "",
          clientInfo.postalCode || "",
          clientInfo.city || "",
          glassType,
          damageDetails,
          agentName,
          referralCode
        ];
      });

      // Fonction pour échapper les valeurs CSV
      const escapeCSV = (value: string) => {
        // Si la valeur contient des virgules, des guillemets ou des sauts de ligne, l'entourer de guillemets
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
          // Échapper les guillemets en les doublant
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      // Convertir les données en format CSV
      const csvContent = [
        // Ajouter l'en-tête
        headers.join(','),
        // Ajouter les lignes de données
        ...rows.map(row => row.map(value => escapeCSV(String(value))).join(','))
      ].join('\n');

      // Ajouter le BOM (Byte Order Mark) pour que Excel reconnaisse correctement l'UTF-8
      const BOM = '\uFEFF';
      const csvContentWithBOM = BOM + csvContent;

      // Créer un blob avec le contenu CSV
      const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8' });

      // Créer une URL pour le blob
      const url = URL.createObjectURL(blob);

      // Créer un lien pour télécharger le fichier
      const exportFileDefaultName = `submissions-export-${new Date().toISOString().slice(0, 10)}.csv`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      // Libérer l'URL
      URL.revokeObjectURL(url);

      toast.success('Données exportées avec succès au format CSV');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erreur lors de l\'exportation des données');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Soumissions de formulaires</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez les soumissions de formulaires
          </p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubmissions}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Actualiser</span>
            <span className="sm:hidden">Actu.</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={loading || filteredSubmissions.length === 0}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exporter</span>
            <span className="sm:hidden">Exp.</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="space-y-2 w-full md:w-1/3">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2 w-full md:w-1/4">
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
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="whitespace-nowrap">Utilisateur</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Référence</TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="default">
                      {submission.formType === 'carDamage' ? 'Dommage vitre' : submission.formType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {submission.user ? (
                      <div>
                        <p className="font-medium truncate max-w-[150px] sm:max-w-none">
                          {submission.user.firstName} {submission.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                          {submission.user.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Anonyme</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
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
                  <TableCell className="whitespace-nowrap hidden sm:table-cell">
                    {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewDialogWithSubmission(submission)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialogWithSubmission(submission)}
                        title="Supprimer"
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
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la soumission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Type de formulaire</h3>
                  <Badge variant="default">
                    {selectedSubmission.formType === 'carDamage' ? 'Dommage vitre' : selectedSubmission.formType}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date de soumission</h3>
                  <p className="break-words">{new Date(selectedSubmission.createdAt).toLocaleDateString()} {new Date(selectedSubmission.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              {selectedSubmission.user && (
                <div>
                  <h3 className="font-semibold mb-1">Utilisateur</h3>
                  <p className="break-words">Nom: {selectedSubmission.user.firstName} {selectedSubmission.user.lastName}</p>
                  <p className="break-words">Email: {selectedSubmission.user.email}</p>
                </div>
              )}

              {(selectedSubmission.agent || selectedSubmission.referralCode) && (
                <div className={selectedSubmission.agent ? "border p-4 rounded-md bg-green-50" : "border p-4 rounded-md bg-yellow-50"}>
                  <h3 className="font-semibold mb-2">
                    {selectedSubmission.agent ? "Agent Référent" : "Code de Référence"}
                  </h3>
                  {selectedSubmission.agent ? (
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-24">Nom:</span>
                        <span className="break-words">{selectedSubmission.agent.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium sm:w-24">Code:</span>
                        <span className="break-words">{selectedSubmission.agent.referralCode}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-medium sm:w-24">Code:</span>
                      <span className="break-words">{selectedSubmission.referralCode}</span>
                      <span className="mt-1 sm:mt-0 sm:ml-2 text-yellow-600 text-sm">(Agent non identifié)</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-1">Données du formulaire</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                    {JSON.stringify(JSON.parse(selectedSubmission.formData), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpenViewDialog(false)} className="w-full sm:w-auto">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la soumission</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer cette soumission ?
            Cette action est irréversible.
          </p>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={deleteSubmission} className="w-full sm:w-auto">Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
