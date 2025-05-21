"use client"

import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import Link from "next/link"

export default function UserButton() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled className="rounded-full">
        <User className="size-[18px]" />
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border-gray-300 dark:border-gray-700 rounded-full"
          asChild
        >
          <Link href="/login">Connexion</Link>
        </Button>
        <Button
          className="rounded-full h-10 px-4 text-sm shadow-md font-medium"
          asChild
        >
          <Link href="/register">Créer un compte</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <User className="size-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/submissions">Mes demandes</Link>
        </DropdownMenuItem>

        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">Administration</Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
