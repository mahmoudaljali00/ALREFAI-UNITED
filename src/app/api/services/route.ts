import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getServices(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (featured !== null) where.featured = featured === 'true';
    if (isActive !== null) where.isActive = isActive === 'true';

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          updatedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      data: services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createService(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const {
      titleAr,
      titleEn,
      shortDescriptionAr,
      shortDescriptionEn,
      descriptionAr,
      descriptionEn,
      icon,
      image,
      featured,
      displayOrder,
      isActive,
      metaTitleAr,
      metaTitleEn,
      metaDescriptionAr,
      metaDescriptionEn,
    } = body;

    if (!titleAr || !titleEn) {
      return NextResponse.json({ error: 'Title in both languages is required' }, { status: 400 });
    }

    const baseSlug = slugify(titleEn);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.service.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const service = await prisma.service.create({
      data: {
        titleAr,
        titleEn,
        slug,
        shortDescriptionAr,
        shortDescriptionEn,
        descriptionAr,
        descriptionEn,
        icon,
        image,
        featured: featured || false,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
        metaTitleAr,
        metaTitleEn,
        metaDescriptionAr,
        metaDescriptionEn,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: service }, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getServices;
export const POST = requireAuth(createService);