"use client"

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
  BarChart3
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

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

  return (
    <div className={cn("pb-12 w-64 border-r min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Administration
            </h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-10rem)]">
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
      </div>
      <div className="px-3 absolute bottom-4 w-64 pr-8">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={() => logout()}
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
}
