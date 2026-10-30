import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getProjects(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (featured !== null) where.featured = featured === 'true';
    if (status) where.status = status;
    if (isActive !== null) where.isActive = isActive === 'true';

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          gallery: { orderBy: { displayOrder: 'asc' } },
          createdBy: { select: { id: true, name: true, email: true } },
          updatedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createProject(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const {
      titleAr,
      titleEn,
      category,
      locationAr,
      locationEn,
      descriptionAr,
      descriptionEn,
      shortDescriptionAr,
      shortDescriptionEn,
      completionDate,
      startDate,
      budget,
      area,
      clientAr,
      clientEn,
      status,
      featured,
      displayOrder,
      isActive,
      mainImage,
      gallery,
      metaTitleAr,
      metaTitleEn,
      metaDescriptionAr,
      metaDescriptionEn,
    } = body;

    if (!titleAr || !titleEn || !category) {
      return NextResponse.json({ error: 'Title (both languages) and category are required' }, { status: 400 });
    }

    const baseSlug = slugify(titleEn);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const project = await prisma.project.create({
      data: {
        titleAr,
        titleEn,
        slug,
        category,
        locationAr,
        locationEn,
        descriptionAr,
        descriptionEn,
        shortDescriptionAr,
        shortDescriptionEn,
        completionDate: completionDate ? new Date(completionDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        budget,
        area,
        clientAr,
        clientEn,
        status: status || 'COMPLETED',
        featured: featured || false,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
        mainImage,
        metaTitleAr,
        metaTitleEn,
        metaDescriptionAr,
        metaDescriptionEn,
        createdById: user.id,
        updatedById: user.id,
        gallery: gallery?.length ? {
          create: gallery.map((img: any, index: number) => ({
            url: img.url,
            altAr: img.altAr,
            altEn: img.altEn,
            captionAr: img.captionAr,
            captionEn: img.captionEn,
            displayOrder: img.displayOrder ?? index,
          })),
        } : undefined,
      },
      include: { gallery: true },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getProjects;
export const POST = requireAuth(createProject);