import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get current user from request
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get user's form submissions
    const submissions = await prisma.formSubmission.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des formulaires',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
