import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getIndustry(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const industry = await prisma.industry.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json({ data: industry });
  } catch (error) {
    console.error('Get industry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateIndustry(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameAr, nameEn, descriptionAr, descriptionEn, icon, image, featured, displayOrder, isActive, metaTitleAr, metaTitleEn, metaDescriptionAr, metaDescriptionEn } = body;

    const existingIndustry = await prisma.industry.findUnique({ where: { id } });
    if (!existingIndustry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    let slug = existingIndustry.slug;
    if (nameEn && nameEn !== existingIndustry.nameEn) {
      const baseSlug = slugify(nameEn);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.industry.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const industry = await prisma.industry.update({
      where: { id },
      data: {
        nameAr, nameEn, slug,
        descriptionAr, descriptionEn,
        icon, image,
        featured, displayOrder, isActive,
        metaTitleAr, metaTitleEn,
        metaDescriptionAr, metaDescriptionEn,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: industry });
  } catch (error) {
    console.error('Update industry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteIndustry(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingIndustry = await prisma.industry.findUnique({ where: { id } });
    if (!existingIndustry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    await prisma.industry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete industry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getIndustry;
export const PUT = requireAuth(updateIndustry);
export const DELETE = requireAuth(deleteIndustry);