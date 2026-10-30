import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const where: any = { isActive: true };
    if (featured !== null) where.featured = featured === 'true';

    const clients = await prisma.client.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        logo: true,
        website: true,
        featured: true,
        displayOrder: true,
      },
    });

    return NextResponse.json({ data: clients });
  } catch (error) {
    console.error('Get public clients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}