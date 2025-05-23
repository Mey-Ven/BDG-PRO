import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { checkMainAdminAuth, ADMIN_EMAIL } from '@/lib/admin-auth';

// Schéma de validation pour la mise à jour d'un utilisateur
const updateUserSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }).optional(),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).optional(),
  phone: z.string().optional(),
  isAdmin: z.boolean().optional(),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }).optional(),
});

// GET - Récupérer un utilisateur par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier si l'utilisateur est l'administrateur principal
    const { isAuthorized, errorResponse } = checkMainAdminAuth(request);

    if (!isAuthorized) {
      return errorResponse;
    }

    const { id } = await params;

    // Récupérer l'utilisateur
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: targetUser,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un utilisateur
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier si l'utilisateur est l'administrateur principal
    const { isAuthorized, errorResponse, user } = checkMainAdminAuth(request);

    if (!isAuthorized) {
      return errorResponse;
    }

    const { id } = await params;

    // Valider les données
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

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

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher la modification du statut d'administrateur pour le compte administrateur principal
    if (existingUser.email === ADMIN_EMAIL && result.data.isAdmin === false) {
      return NextResponse.json(
        { success: false, message: 'Vous ne pouvez pas rétrograder le compte administrateur principal' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (result.data.firstName !== undefined) updateData.firstName = result.data.firstName;
    if (result.data.lastName !== undefined) updateData.lastName = result.data.lastName;
    if (result.data.phone !== undefined) updateData.phone = result.data.phone;
    if (result.data.isAdmin !== undefined) updateData.isAdmin = result.data.isAdmin;

    // Si un nouveau mot de passe est fourni, le hacher
    if (result.data.password) {
      updateData.password = await hashPassword(result.data.password);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier si l'utilisateur est l'administrateur principal
    const { isAuthorized, errorResponse, user } = checkMainAdminAuth(request);

    if (!isAuthorized) {
      return errorResponse;
    }

    const { id } = await params;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher la suppression de son propre compte ou du compte administrateur principal
    if (id === user.id || existingUser.email === ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, message: 'Vous ne pouvez pas supprimer ce compte administrateur' },
        { status: 400 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
