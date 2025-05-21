import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateReferralCode } from '@/lib/referral';
import { z } from 'zod';

// Schéma de validation pour la création d'un agent
const createAgentSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
});

// Schéma de validation pour la mise à jour d'un agent
const updateAgentSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).optional(),
  email: z.string().email({ message: "Email invalide" }).optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
});

// GET - Récupérer tous les agents
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

    // Récupérer tous les agents
    const agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des agents',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel agent
export async function POST(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est administrateur
    const user = getCurrentUser(request);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Valider les données
    const body = await request.json();
    const result = createAgentSchema.safeParse(body);

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

    // Vérifier si l'email existe déjà
    const existingAgent = await prisma.agent.findUnique({
      where: { email: result.data.email },
    });

    if (existingAgent) {
      return NextResponse.json(
        { success: false, message: 'Un agent avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Générer un code de référence unique
    const referralCode = await generateReferralCode();

    // Créer l'agent
    const agent = await prisma.agent.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        referralCode,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Agent créé avec succès',
      agent,
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la création de l\'agent',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
