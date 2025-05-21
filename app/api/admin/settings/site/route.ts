import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour les paramètres du site
const siteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "Le nom du site est requis" }),
  contactEmail: z.string().email({ message: "Email invalide" }),
  contactPhone: z.string().min(1, { message: "Le téléphone de contact est requis" }),
  enableRegistration: z.boolean(),
  enableAgentReferrals: z.boolean(),
});

// GET - Récupérer les paramètres du site
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching site settings...');
    
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);
    console.log('API: User authenticated:', user ? 'yes' : 'no', user?.isAdmin ? '(admin)' : '');
    
    if (!user || !user.isAdmin) {
      console.log('API: Access denied - not an admin');
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    // Récupérer les paramètres du site
    // Note: Dans une application réelle, ces paramètres seraient stockés dans la base de données
    // Pour cette démonstration, nous retournons des valeurs par défaut
    
    const siteSettings = {
      siteName: "Bris De Glace",
      contactEmail: "contact@brisdeglace.com",
      contactPhone: "+33123456789",
      enableRegistration: true,
      enableAgentReferrals: true,
    };
    
    return NextResponse.json({
      success: true,
      settings: siteSettings,
    });
  } catch (error) {
    console.error('API: Error fetching site settings:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des paramètres du site',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder les paramètres du site
export async function POST(request: NextRequest) {
  try {
    console.log('API: Saving site settings...');
    
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);
    console.log('API: User authenticated:', user ? 'yes' : 'no', user?.isAdmin ? '(admin)' : '');
    
    if (!user || !user.isAdmin) {
      console.log('API: Access denied - not an admin');
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    // Valider les données
    const body = await request.json();
    const result = siteSettingsSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: result.error.errors 
        }, 
        { status: 400 }
      );
    }
    
    // Dans une application réelle, ces paramètres seraient sauvegardés dans la base de données
    // Pour cette démonstration, nous simulons simplement une sauvegarde réussie
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      message: 'Paramètres du site sauvegardés avec succès',
      settings: result.data,
    });
  } catch (error) {
    console.error('API: Error saving site settings:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la sauvegarde des paramètres du site',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
