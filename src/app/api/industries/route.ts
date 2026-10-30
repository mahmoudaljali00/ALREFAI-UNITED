import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getIndustries(request: NextRequest) {
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
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (featured !== null) where.featured = featured === 'true';
    if (isActive !== null) where.isActive = isActive === 'true';

    const [industries, total] = await Promise.all([
      prisma.industry.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          updatedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.industry.count({ where }),
    ]);

    return NextResponse.json({ data: industries, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get industries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createIndustry(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, descriptionAr, descriptionEn, icon, image, featured, displayOrder, isActive, metaTitleAr, metaTitleEn, metaDescriptionAr, metaDescriptionEn } = body;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: 'Name in both languages is required' }, { status: 400 });
    }

    const baseSlug = slugify(nameEn);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.industry.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const industry = await prisma.industry.create({
      data: {
        nameAr, nameEn, slug,
        descriptionAr, descriptionEn,
        icon, image,
        featured: featured || false,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
        metaTitleAr, metaTitleEn,
        metaDescriptionAr, metaDescriptionEn,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: industry }, { status: 201 });
  } catch (error) {
    console.error('Create industry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getIndustries;
export const POST = requireAuth(createIndustry);