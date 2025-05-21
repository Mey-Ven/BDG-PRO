import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, comparePasswords } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour les paramètres de l'utilisateur
const userSettingsSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Si un nouveau mot de passe est fourni, le mot de passe actuel est requis
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Le mot de passe actuel est requis pour changer de mot de passe",
  path: ["currentPassword"],
}).refine((data) => {
  // Si un nouveau mot de passe est fourni, il doit correspondre à la confirmation
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// GET - Récupérer les paramètres de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching user settings...');
    
    // Vérifier si l'utilisateur est connecté
    const user = getCurrentUser(request);
    console.log('API: User authenticated:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('API: Access denied - not authenticated');
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    // Récupérer les informations de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      }
    });
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      settings: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error('API: Error fetching user settings:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des paramètres utilisateur',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder les paramètres de l'utilisateur
export async function POST(request: NextRequest) {
  try {
    console.log('API: Saving user settings...');
    
    // Vérifier si l'utilisateur est connecté
    const user = getCurrentUser(request);
    console.log('API: User authenticated:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('API: Access denied - not authenticated');
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    // Valider les données
    const body = await request.json();
    const result = userSettingsSchema.safeParse(body);
    
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
    
    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        password: true,
      }
    });
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier le mot de passe actuel si un nouveau mot de passe est fourni
    if (result.data.newPassword) {
      if (!result.data.currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Le mot de passe actuel est requis' },
          { status: 400 }
        );
      }
      
      const isPasswordValid = comparePasswords(result.data.currentPassword, currentUser.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Mot de passe actuel incorrect' },
          { status: 400 }
        );
      }
    }
    
    // Préparer les données à mettre à jour
    const updateData: any = {
      firstName: result.data.firstName,
      lastName: result.data.lastName,
    };
    
    // Mettre à jour le mot de passe si un nouveau est fourni
    if (result.data.newPassword) {
      updateData.password = hashPassword(result.data.newPassword);
    }
    
    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Paramètres utilisateur sauvegardés avec succès',
      user: updatedUser,
    });
  } catch (error) {
    console.error('API: Error saving user settings:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la sauvegarde des paramètres utilisateur',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
