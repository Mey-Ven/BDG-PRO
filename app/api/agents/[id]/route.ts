import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour la mise à jour d'un agent
const updateAgentSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).optional(),
  email: z.string().email({ message: "Email invalide" }).optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
});

// GET - Récupérer un agent par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Récupérer l'agent
    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent,
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération de l\'agent',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Valider les données
    const body = await request.json();
    const result = updateAgentSchema.safeParse(body);

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

    // Vérifier si l'agent existe
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, message: 'Agent non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email existe déjà (si l'email est modifié)
    if (result.data.email && result.data.email !== existingAgent.email) {
      const emailExists = await prisma.agent.findUnique({
        where: { email: result.data.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Un agent avec cet email existe déjà' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'agent
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({
      success: true,
      message: 'Agent mis à jour avec succès',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la mise à jour de l\'agent',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Vérifier si l'agent existe
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, message: 'Agent non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'agent
    await prisma.agent.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Agent supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la suppression de l\'agent',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
