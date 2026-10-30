import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    const featured = searchParams.get('featured');

    const where: any = { isActive: true };
    if (featured !== null) where.featured = featured === 'true';

    const services = await prisma.service.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        slug: true,
        shortDescriptionAr: true,
        shortDescriptionEn: true,
        icon: true,
        image: true,
        featured: true,
        displayOrder: true,
      },
    });

    return NextResponse.json({ data: services });
  } catch (error) {
    console.error('Get public services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}