import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getService(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateService(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    let slug = existingService.slug;
    if (titleEn && titleEn !== existingService.titleEn) {
      const baseSlug = slugify(titleEn);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.service.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const service = await prisma.service.update({
      where: { id },
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
        featured,
        displayOrder,
        isActive,
        metaTitleAr,
        metaTitleEn,
        metaDescriptionAr,
        metaDescriptionEn,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteService(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getService;
export const PUT = requireAuth(updateService);
export const DELETE = requireAuth(deleteService);