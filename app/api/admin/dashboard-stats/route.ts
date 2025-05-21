import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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
    const [
      totalUsers,
      totalAgents,
      totalSubmissions,
      recentSubmissions
    ] = await Promise.all([
      // Nombre total d'utilisateurs
      prisma.user.count(),

      // Nombre total d'agents
      prisma.agent.count(),

      // Nombre total de soumissions
      prisma.formSubmission.count(),

      // Soumissions récentes
      prisma.formSubmission.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              email: true
            }
          },
          agent: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    // Formater les soumissions récentes
    const formattedSubmissions = recentSubmissions.map(submission => ({
      id: submission.id,
      formType: submission.formType,
      createdAt: submission.createdAt.toISOString(),
      userEmail: submission.user?.email,
      agentName: submission.agent?.name
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalAgents,
        totalSubmissions,
        recentSubmissions: formattedSubmissions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
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
