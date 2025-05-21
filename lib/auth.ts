import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from './prisma';

// Schema for user registration
export const registerSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  phone: z.string().optional(),
});

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

// Type for JWT payload
export type JWTPayload = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
};

// Function to hash password using native crypto
export function hashPassword(password: string): string {
  // Générer un sel aléatoire
  const salt = crypto.randomBytes(16).toString('hex');
  // Hacher le mot de passe avec le sel
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  // Retourner le sel et le hachage séparés par un deux-points
  return `${salt}:${hash}`;
}

// Function to compare password with hash
export function comparePasswords(password: string, storedHash: string): boolean {
  // Séparer le sel et le hachage
  const [salt, hash] = storedHash.split(':');
  // Hacher le mot de passe fourni avec le même sel
  const calculatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  // Comparer les hachages
  return hash === calculatedHash;
}

// Function to create a simple token (base64 encoded)
export function createToken(payload: JWTPayload): string {
  // Ajouter une date d'expiration (7 jours)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const tokenData = {
    ...payload,
    exp: expiresAt.getTime(),
    iat: Date.now()
  };

  // Convertir en JSON puis encoder en base64
  const jsonData = JSON.stringify(tokenData);
  return Buffer.from(jsonData).toString('base64');
}

// Function to verify token
export function verifyToken(token: string): JWTPayload | null {
  try {
    // Décoder le token
    const jsonData = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(jsonData);

    // Vérifier l'expiration
    if (data.exp && data.exp < Date.now()) {
      return null; // Token expiré
    }

    // Retourner les données du payload
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isAdmin: data.isAdmin
    };
  } catch (error) {
    return null;
  }
}

// Function to set auth cookie
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Function to get current user from request
export function getCurrentUser(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;

  return verifyToken(token);
}

// Function to get current user from cookies (for server components)
export function getCurrentUserFromCookies(): JWTPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;

  return verifyToken(token);
}

// Function to get user by email
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Function to create a new user
export async function createUser(data: z.infer<typeof registerSchema>) {
  const hashedPassword = hashPassword(data.password);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
  });
}
