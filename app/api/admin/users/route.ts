import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { checkMainAdminAuth } from '@/lib/admin-auth';

// Schéma de validation pour la création d'un utilisateur
const createUserSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  phone: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

// GET - Récupérer tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est l'administrateur principal
    const { isAuthorized, errorResponse } = checkMainAdminAuth(request);

    if (!isAuthorized) {
      return errorResponse;
    }

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est l'administrateur principal
    const { isAuthorized, errorResponse } = checkMainAdminAuth(request);

    if (!isAuthorized) {
      return errorResponse;
    }

    // Valider les données
    const body = await request.json();
    const result = createUserSchema.safeParse(body);

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
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(result.data.password);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email: result.data.email,
        password: hashedPassword,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phone: result.data.phone,
        isAdmin: result.data.isAdmin,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
