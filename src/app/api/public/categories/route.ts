import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        slug: true,
        descriptionAr: true,
        descriptionEn: true,
        color: true,
        icon: true,
        _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
      },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Get public categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}