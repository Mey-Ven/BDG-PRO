import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer une soumission par ID
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
    
    // Récupérer la soumission
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            referralCode: true,
          }
        }
      }
    });
    
    if (!submission) {
      return NextResponse.json(
        { success: false, message: 'Soumission non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération de la soumission',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une soumission
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
    
    // Vérifier si la soumission existe
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: { id },
    });
    
    if (!existingSubmission) {
      return NextResponse.json(
        { success: false, message: 'Soumission non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la soumission
    await prisma.formSubmission.delete({
      where: { id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Soumission supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la suppression de la soumission',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
