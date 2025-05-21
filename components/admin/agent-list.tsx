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
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Copy, Edit, Trash2, Plus, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Type pour un agent
type Agent = {
  id: string
  name: string
  email: string
  phone?: string
  referralCode: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// Schéma de validation pour la création d'un agent
const createAgentSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
})

// Schéma de validation pour la mise à jour d'un agent
const updateAgentSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  active: z.boolean(),
})

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  // Formulaire de création
  const createForm = useForm<z.infer<typeof createAgentSchema>>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  // Formulaire de mise à jour
  const updateForm = useForm<z.infer<typeof updateAgentSchema>>({
    resolver: zodResolver(updateAgentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      active: true,
    },
  })

  // Charger les agents
  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents')
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des agents')
      }
      
      const data = await response.json()
      setAgents(data.agents)
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Erreur lors de la récupération des agents')
    } finally {
      setLoading(false)
    }
  }

  // Charger les agents au chargement du composant
  useEffect(() => {
    fetchAgents()
  }, [])

  // Créer un agent
  const createAgent = async (data: z.infer<typeof createAgentSchema>) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création de l\'agent')
      }
      
      toast.success('Agent créé avec succès')
      setOpenCreateDialog(false)
      createForm.reset()
      fetchAgents()
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de l\'agent')
    }
  }

  // Mettre à jour un agent
  const updateAgent = async (data: z.infer<typeof updateAgentSchema>) => {
    if (!selectedAgent) return
    
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'agent')
      }
      
      toast.success('Agent mis à jour avec succès')
      setOpenEditDialog(false)
      updateForm.reset()
      fetchAgents()
    } catch (error) {
      console.error('Error updating agent:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'agent')
    }
  }

  // Supprimer un agent
  const deleteAgent = async () => {
    if (!selectedAgent) return
    
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'agent')
      }
      
      toast.success('Agent supprimé avec succès')
      setOpenDeleteDialog(false)
      fetchAgents()
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'agent')
    }
  }

  // Copier le lien de référence
  const copyReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin
    const referralLink = `${baseUrl}/?ref=${referralCode}`
    
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Lien de référence copié dans le presse-papier'))
      .catch(() => toast.error('Erreur lors de la copie du lien'))
  }

  // Ouvrir le dialogue de modification
  const openEditDialogWithAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    updateForm.reset({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      active: agent.active,
    })
    setOpenEditDialog(true)
  }

  // Ouvrir le dialogue de suppression
  const openDeleteDialogWithAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setOpenDeleteDialog(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des agents</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAgents}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouvel agent</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(createAgent)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'agent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="06 12 34 56 78" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Créer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Aucun agent trouvé</p>
          <Button 
            variant="link" 
            onClick={() => setOpenCreateDialog(true)}
            className="mt-2"
          >
            Créer un agent
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Code de référence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">{agent.referralCode}</code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyReferralLink(agent.referralCode)}
                        title="Copier le lien de référence"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={agent.active ? "default" : "secondary"}>
                      {agent.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialogWithAgent(agent)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialogWithAgent(agent)}
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

      {/* Dialogue de modification */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'agent</DialogTitle>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(updateAgent)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'agent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="06 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Agent actif
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Les agents inactifs ne peuvent pas être utilisés pour le référencement
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'agent</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer l'agent <strong>{selectedAgent?.name}</strong> ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={deleteAgent}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
