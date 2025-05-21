import { NextRequest, NextResponse } from 'next/server';
import { loginSchema, getUserByEmail, comparePasswords, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = loginSchema.safeParse(body);

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

    // Get user by email
    const user = await getUserByEmail(result.data.email);

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = comparePasswords(result.data.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

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
      message: 'Connexion réussie',
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
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
