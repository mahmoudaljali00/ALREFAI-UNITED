import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = { status: 'PUBLISHED' };
    if (category) where.category = { slug: category };
    if (featured !== null) where.featured = featured === 'true';

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, nameAr: true, nameEn: true, slug: true, color: true } },
          author: { select: { id: true, name: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ data: posts, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get public news error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}