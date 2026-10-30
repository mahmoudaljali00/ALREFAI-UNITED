import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getPosts(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');

    const where: any = {};
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          author: { select: { id: true, name: true, email: true } },
          updater: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ data: posts, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createPost(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { titleAr, titleEn, excerptAr, excerptEn, contentAr, contentEn, featuredImage, status, categoryId, metaTitleAr, metaTitleEn, metaDescriptionAr, metaDescriptionEn, ogImage } = body;

    if (!titleAr || !titleEn || !contentAr || !contentEn) {
      return NextResponse.json({ error: 'Title and content in both languages are required' }, { status: 400 });
    }

    const baseSlug = slugify(titleEn);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        titleAr, titleEn, slug,
        excerptAr, excerptEn,
        contentAr, contentEn,
        featuredImage,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        categoryId,
        metaTitleAr, metaTitleEn,
        metaDescriptionAr, metaDescriptionEn,
        ogImage,
        authorId: user.id,
        updaterId: user.id,
      },
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getPosts;
export const POST = requireAuth(createPost);