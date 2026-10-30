import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    const featured = searchParams.get('featured');

    const where: any = { isActive: true };
    if (featured !== null) where.featured = featured === 'true';

    const industries = await prisma.industry.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        slug: true,
        descriptionAr: true,
        descriptionEn: true,
        icon: true,
        image: true,
        featured: true,
        displayOrder: true,
      },
    });

    return NextResponse.json({ data: industries });
  } catch (error) {
    console.error('Get public industries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}