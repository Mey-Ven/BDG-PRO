import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAgentReferralStats } from '@/lib/referral';
import prisma from '@/lib/prisma';

// GET - Récupérer les statistiques d'un agent spécifique
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

    // Vérifier si l'agent existe
    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les statistiques
    const stats = await getAgentReferralStats(id);

    return NextResponse.json({
      success: true,
      agent,
      stats,
    });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
