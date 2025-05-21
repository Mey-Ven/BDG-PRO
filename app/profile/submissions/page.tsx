"use client"

import { useAuth } from "@/components/auth/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type FormSubmission = {
  id: string
  formType: string
  formData: string
  createdAt: string
  updatedAt: string
}

export default function SubmissionsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch user's submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return
      
      try {
        setIsLoadingSubmissions(true)
        const response = await fetch('/api/form-submissions/user')
        
        if (response.ok) {
          const data = await response.json()
          setSubmissions(data.submissions)
        } else {
          console.error('Failed to fetch submissions')
        }
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setIsLoadingSubmissions(false)
      }
    }

    if (user) {
      fetchSubmissions()
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getFormTypeLabel = (type: string) => {
    switch (type) {
      case 'carDamage':
        return 'Dommage de vitre'
      case 'partner':
        return 'Demande de partenariat'
      default:
        return type
    }
  }

  const formatSubmissionData = (submission: FormSubmission) => {
    try {
      const data = JSON.parse(submission.formData)
      
      if (submission.formType === 'carDamage') {
        return (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Type de vitre:</span> {data.glassType?.label || 'Non spécifié'}</p>
            <p><span className="font-medium">Plaque d'immatriculation:</span> {data.licensePlate || 'Non spécifiée'}</p>
            <p><span className="font-medium">Assurance:</span> {data.insurance || 'Non spécifiée'}</p>
          </div>
        )
      }
      
      return <p className="text-sm text-muted-foreground">Détails non disponibles</p>
    } catch (error) {
      return <p className="text-sm text-muted-foreground">Erreur lors du chargement des détails</p>
    }
  }

  return (
    <div className="flex min-h-screen flex-col p-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-6">
          <Link href="/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour au profil
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Mes demandes</h1>
        
        {isLoadingSubmissions ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Vous n'avez pas encore envoyé de demandes.</p>
              <Button className="mt-4" asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{getFormTypeLabel(submission.formType)}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(submission.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {formatSubmissionData(submission)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
