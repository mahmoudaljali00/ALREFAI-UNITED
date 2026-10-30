import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ hasUsers: count > 0 });
  } catch (error) {
    console.error('Has-users check error:', error);
    // Fail closed: report that users exist so setup surfaces cannot be abused
    return NextResponse.json({ hasUsers: true }, { status: 500 });
  }
}
