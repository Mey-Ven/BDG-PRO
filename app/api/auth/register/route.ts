import { NextRequest, NextResponse } from 'next/server';
import { registerSchema, createUser, createToken, setAuthCookie } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await createUser(result.data);

    // Create token
    const token = createToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      isAdmin: user.isAdmin,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
    });

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
