"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // État pour les paramètres du site
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Bris De Glace",
    contactEmail: "contact@brisdeglace.com",
    contactPhone: "+33123456789",
    enableRegistration: true,
    enableAgentReferrals: true,
  })

  // Charger les paramètres du site
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/site')

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des paramètres du site')
        }

        const data = await response.json()

        if (data.success && data.settings) {
          setSiteSettings(data.settings)
        }
      } catch (error) {
        console.error('Error fetching site settings:', error)
        toast.error('Erreur lors de la récupération des paramètres du site')
      }
    }

    fetchSiteSettings()
  }, [])

  // État pour les paramètres de l'utilisateur
  const [userSettings, setUserSettings] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Charger les paramètres de l'utilisateur
  useEffect(() => {
    if (user) {
      setUserSettings(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }))
    }
  }, [user])

  // Gérer les changements dans les paramètres du site
  const handleSiteSettingChange = (key: string, value: any) => {
    setSiteSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Gérer les changements dans les paramètres de l'utilisateur
  const handleUserSettingChange = (key: string, value: string) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Sauvegarder les paramètres du site
  const saveSiteSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteSettings),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde des paramètres du site')
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Paramètres du site sauvegardés avec succès")
      } else {
        throw new Error(data.message || 'Erreur lors de la sauvegarde des paramètres du site')
      }
    } catch (error) {
      console.error("Error saving site settings:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde des paramètres du site")
    } finally {
      setLoading(false)
    }
  }

  // Sauvegarder les paramètres de l'utilisateur
  const saveUserSettings = async () => {
    setLoading(true)
    try {
      // Vérifier si les mots de passe correspondent
      if (userSettings.newPassword && userSettings.newPassword !== userSettings.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas")
        return
      }

      const response = await fetch('/api/admin/settings/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSettings),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde des paramètres utilisateur')
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Paramètres utilisateur sauvegardés avec succès")

        // Réinitialiser les champs de mot de passe
        setUserSettings(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      } else {
        throw new Error(data.message || 'Erreur lors de la sauvegarde des paramètres utilisateur')
      }
    } catch (error) {
      console.error("Error saving user settings:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde des paramètres utilisateur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les paramètres de votre application
        </p>
      </div>

      <Tabs defaultValue="site" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="site">Paramètres du site</TabsTrigger>
          <TabsTrigger value="account">Paramètres du compte</TabsTrigger>
        </TabsList>

        {/* Paramètres du site */}
        <TabsContent value="site" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Configurez les informations générales de votre site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={siteSettings.siteName}
                  onChange={(e) => handleSiteSettingChange("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => handleSiteSettingChange("contactEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Téléphone de contact</Label>
                <Input
                  id="contactPhone"
                  value={siteSettings.contactPhone}
                  onChange={(e) => handleSiteSettingChange("contactPhone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle>
              <CardDescription>
                Activez ou désactivez les fonctionnalités du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableRegistration">Inscription des utilisateurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux visiteurs de créer un compte
                  </p>
                </div>
                <Switch
                  id="enableRegistration"
                  checked={siteSettings.enableRegistration}
                  onCheckedChange={(checked) => handleSiteSettingChange("enableRegistration", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAgentReferrals">Système de référencement d'agents</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le système de codes de référence pour les agents
                  </p>
                </div>
                <Switch
                  id="enableAgentReferrals"
                  checked={siteSettings.enableAgentReferrals}
                  onCheckedChange={(checked) => handleSiteSettingChange("enableAgentReferrals", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSiteSettings} disabled={loading}>
                {loading ? "Sauvegarde en cours..." : "Sauvegarder les paramètres"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Paramètres du compte */}
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={userSettings.firstName}
                    onChange={(e) => handleUserSettingChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={userSettings.lastName}
                    onChange={(e) => handleUserSettingChange("lastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => handleUserSettingChange("email", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={userSettings.currentPassword}
                  onChange={(e) => handleUserSettingChange("currentPassword", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={userSettings.newPassword}
                  onChange={(e) => handleUserSettingChange("newPassword", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={userSettings.confirmPassword}
                  onChange={(e) => handleUserSettingChange("confirmPassword", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveUserSettings} disabled={loading}>
                {loading ? "Sauvegarde en cours..." : "Sauvegarder les paramètres"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
