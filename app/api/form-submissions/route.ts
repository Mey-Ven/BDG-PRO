import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get current user from request
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Save form submission to database
    const formSubmission = await prisma.formSubmission.create({
      data: {
        userId: user.id,
        formType: 'carDamage',
        formData: JSON.stringify(data),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Formulaire enregistré avec succès',
      submissionId: formSubmission.id,
    });
  } catch (error) {
    console.error('Error saving form submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de l\'enregistrement du formulaire',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
