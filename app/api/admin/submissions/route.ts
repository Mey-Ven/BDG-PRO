import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Récupérer toutes les soumissions
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching submissions...');

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

    // Vérifier si la table FormSubmission existe
    try {
      console.log('API: Checking if FormSubmission table exists...');
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'FormSubmission'
        );
      `;
      console.log('API: Table exists check result:', tableExists);
    } catch (tableError) {
      console.error('API: Error checking table:', tableError);
    }

    // Récupérer toutes les soumissions
    console.log('API: Querying submissions...');
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
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

    console.log(`API: Found ${submissions.length} submissions`);

    // Compter les soumissions avec et sans agent référent
    const withAgent = submissions.filter(s => s.agent !== null).length;
    const withReferralCode = submissions.filter(s => s.referralCode !== null && s.agent === null).length;
    const withoutReferral = submissions.filter(s => s.agent === null && s.referralCode === null).length;

    console.log(`API: Submissions breakdown - With agent: ${withAgent}, With referral code only: ${withReferralCode}, Without referral: ${withoutReferral}`);

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('API: Error fetching submissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des soumissions',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
