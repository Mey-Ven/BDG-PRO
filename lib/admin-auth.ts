import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth';

// Email de l'administrateur principal
export const ADMIN_EMAIL = 'mhmd.bdg.pro1@brisdeglacepro.com'; // Remplacez par l'email de votre administrateur principal

/**
 * Vérifie si l'utilisateur est l'administrateur principal
 * @param request La requête Next.js
 * @returns Un objet avec le statut de l'authentification et éventuellement une réponse d'erreur
 */
export function checkMainAdminAuth(request: NextRequest): { 
  isAuthorized: boolean; 
  errorResponse?: NextResponse;
  user?: any;
} {
  // Récupérer l'utilisateur actuel
  const user = getCurrentUser(request);
  
  // Vérifier si l'utilisateur est connecté, est admin et a l'email de l'administrateur principal
  if (!user || !user.isAdmin || user.email !== ADMIN_EMAIL) {
    return {
      isAuthorized: false,
      errorResponse: NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    };
  }
  
  // L'utilisateur est l'administrateur principal
  return {
    isAuthorized: true,
    user
  };
}
