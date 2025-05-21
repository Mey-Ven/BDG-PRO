"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  UserCog,
  BarChart3,
  Menu,
  X
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Détecter si l'écran est petit
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 1024px correspond à lg dans Tailwind
    }

    // Vérifier au chargement
    checkIfMobile()

    // Ajouter un écouteur d'événement pour les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile)

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Fermer le menu lorsqu'on clique sur un lien (sur mobile)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const routes = [
    {
      label: "Tableau de bord",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Utilisateurs",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Agents",
      icon: UserCog,
      href: "/admin/agents",
      active: pathname === "/admin/agents",
    },
    {
      label: "Soumissions",
      icon: ClipboardList,
      href: "/admin/submissions",
      active: pathname === "/admin/submissions",
    },
    {
      label: "Statistiques",
      icon: BarChart3,
      href: "/admin/stats",
      active: pathname === "/admin/stats",
    },
    {
      label: "Paramètres",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  // Contenu du menu
  const SidebarContent = () => (
    <div className="space-y-4 py-4 h-full flex flex-col">
      <div className="px-4 py-2 flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Administration
            </h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="px-3 flex-1">
        <div className="space-y-1">
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="space-y-1 p-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={route.active ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    route.active ? "font-semibold" : "font-normal"
                  )}
                  asChild
                  onClick={handleLinkClick}
                >
                  <Link href={route.href}>
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="px-3 mt-auto pb-4 w-full pr-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={() => {
            logout()
            if (isMobile) setIsOpen(false)
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
        <div className="text-xs text-muted-foreground mt-4 text-center">
          © {new Date().getFullYear()} Bris De Glace
        </div>
      </div>
    </div>
  )

  // Version mobile (avec Sheet)
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-40 lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-64 border-r"
            title="Menu d'administration"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Version desktop
  return (
    <div className={cn("pb-12 w-64 border-r min-h-screen hidden lg:block", className)}>
      <SidebarContent />
    </div>
  )
}
