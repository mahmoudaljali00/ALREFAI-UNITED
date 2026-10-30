import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-super-secret-key-min-32-chars-long');
const JWT_EXPIRY = '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<{ id: string; email: string; role: string } | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
    select: { id: true, email: true, role: true, isActive: true },
  });
  
  if (!user || !user.isActive) return null;
  return { id: user.id, email: user.email, role: user.role };
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Non-httpOnly presence marker so client-side guards (admin layout) can tell
  // whether a session cookie exists without ever exposing the token itself.
  response.cookies.set('auth-status', 'signed-in', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete('auth-token');
  response.cookies.delete('auth-status');
}

export function requireAuth<T extends Record<string, string> = Record<string, string>>(handler: (request: NextRequest, user: { id: string; email: string; role: string }, params: { params: Promise<T> }) => Promise<NextResponse>) {
  return async (request: NextRequest, context: { params: Promise<T> }) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, user, context);
  };
}

export function requireRole(...roles: string[]) {
  return function (handler: (request: NextRequest, user: { id: string; email: string; role: string }) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const user = await getUserFromRequest(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!roles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(request, user);
    };
  };
}