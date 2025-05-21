import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
import { ADMIN_EMAIL } from './lib/admin-auth'

// Middleware pour protéger les routes d'administration
export function middleware(request: NextRequest) {
  // Vérifier si la route commence par /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Récupérer le token d'authentification
    const token = request.cookies.get('auth-token')?.value

    // Si pas de token, rediriger vers la page de connexion
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }

    // Vérifier le token
    const payload = verifyToken(token)

    // Si le token est invalide, l'utilisateur n'est pas admin, ou ce n'est pas l'administrateur principal,
    // rediriger vers la page d'accueil
    if (!payload || !payload.isAdmin || payload.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Continuer la requête normalement
  return NextResponse.next()
}

// Configurer les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: ['/admin/:path*'],
}
