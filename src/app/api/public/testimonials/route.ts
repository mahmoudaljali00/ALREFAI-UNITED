import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = { isActive: true };
    if (featured !== null) where.featured = featured === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      take: limit,
      select: {
        id: true,
        clientNameAr: true,
        clientNameEn: true,
        positionAr: true,
        positionEn: true,
        companyAr: true,
        companyEn: true,
        contentAr: true,
        contentEn: true,
        image: true,
        rating: true,
      },
    });

    return NextResponse.json({ data: testimonials });
  } catch (error) {
    console.error('Get public testimonials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}