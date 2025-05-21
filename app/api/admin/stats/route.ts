import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer les statistiques
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching stats...');

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

    // Récupérer le paramètre de période
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'all';
    console.log('API: Time range:', timeRange);

    // Définir la date de début en fonction de la période
    let startDate: Date | null = null;
    const now = new Date();

    if (timeRange === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Condition de date pour les requêtes
    const dateCondition = startDate ? {
      createdAt: {
        gte: startDate
      }
    } : {};

    // Récupérer les statistiques
    console.log('API: Querying database...');

    // Récupérer les statistiques générales
    let totalSubmissions = 0;
    let totalUsers = 0;
    let totalAgents = 0;
    let agents = [];
    let submissions = [];

    try {
      // Nombre total de soumissions
      totalSubmissions = await prisma.formSubmission.count({
        where: dateCondition
      });
      console.log(`API: Found ${totalSubmissions} submissions`);
    } catch (error) {
      console.error('API: Error counting submissions:', error);
      totalSubmissions = 0;
    }

    try {
      // Nombre total d'utilisateurs
      totalUsers = await prisma.user.count();
      console.log(`API: Found ${totalUsers} users`);
    } catch (error) {
      console.error('API: Error counting users:', error);
      totalUsers = 0;
    }

    try {
      // Nombre total d'agents
      totalAgents = await prisma.agent.count();
      console.log(`API: Found ${totalAgents} agents`);
    } catch (error) {
      console.error('API: Error counting agents:', error);
      totalAgents = 0;
    }

    try {
      // Agents avec leur nombre de soumissions
      agents = await prisma.agent.findMany({
        select: {
          id: true,
          name: true,
          referralCode: true,
          _count: {
            select: {
              formSubmissions: {
                where: dateCondition
              }
            }
          }
        }
      });
      console.log(`API: Found ${agents.length} agents with submission counts`);
    } catch (error) {
      console.error('API: Error fetching agents:', error);
      agents = [];
    }

    try {
      // Soumissions pour les statistiques par type et par mois
      submissions = await prisma.formSubmission.findMany({
        where: dateCondition,
        select: {
          id: true,
          formType: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
      console.log(`API: Found ${submissions.length} submissions for detailed stats`);
    } catch (error) {
      console.error('API: Error fetching submissions:', error);
      submissions = [];
    }

    // Résumé des statistiques récupérées
    console.log(`API: Stats summary - ${totalSubmissions} submissions, ${totalUsers} users, ${totalAgents} agents, ${agents.length} agents with counts, ${submissions.length} detailed submissions`);

    // Formater les statistiques des agents
    const agentStats = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      referralCode: agent.referralCode,
      submissionCount: agent._count.formSubmissions
    }));

    // Calculer les statistiques par type de formulaire
    const formTypeCounts: Record<string, number> = {};
    submissions.forEach(submission => {
      if (submission.formType === 'carDamage') {
        formTypeCounts['Dommage vitre'] = (formTypeCounts['Dommage vitre'] || 0) + 1;
      }
    });

    const formTypeStats = Object.entries(formTypeCounts).map(([type, count]) => ({
      type,
      count
    }));

    // Calculer les statistiques mensuelles
    const monthlyData: Record<string, { carDamage: number, total: number }> = {};

    submissions.forEach(submission => {
      const date = new Date(submission.createdAt);
      const monthYear = `${date.toLocaleString('fr-FR', { month: 'short' })}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { carDamage: 0, total: 0 };
      }

      if (submission.formType === 'carDamage') {
        monthlyData[monthYear].carDamage += 1;
      }

      monthlyData[monthYear].total += 1;
    });

    const monthlyStats = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));

    // Retourner les statistiques
    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions,
        totalUsers,
        totalAgents,
        agentStats,
        formTypeStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('API: Error fetching stats:', error);
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


