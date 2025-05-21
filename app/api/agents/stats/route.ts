import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getGlobalReferralStats } from '@/lib/referral';

// GET - Récupérer les statistiques globales des agents
export async function GET(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les statistiques
    const stats = await getGlobalReferralStats();

    return NextResponse.json({
      success: true,
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
