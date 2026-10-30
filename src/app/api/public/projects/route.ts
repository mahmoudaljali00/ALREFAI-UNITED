import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '6');

    const where: any = { isActive: true };
    if (category && category !== 'all') where.category = category;
    if (featured !== null) where.featured = featured === 'true';

    const projects = await prisma.project.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      take: limit,
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        slug: true,
        category: true,
        locationAr: true,
        locationEn: true,
        shortDescriptionAr: true,
        shortDescriptionEn: true,
        mainImage: true,
        completionDate: true,
        featured: true,
      },
    });

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('Get public projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}