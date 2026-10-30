import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getProject(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        gallery: { orderBy: { displayOrder: 'asc' } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateProject(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let slug = existingProject.slug;
    if (titleEn && titleEn !== existingProject.titleEn) {
      const baseSlug = slugify(titleEn);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.project.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const project = await prisma.project.update({
      where: { id },
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
        status,
        featured,
        displayOrder,
        isActive,
        mainImage,
        metaTitleAr,
        metaTitleEn,
        metaDescriptionAr,
        metaDescriptionEn,
        updatedById: user.id,
        gallery: gallery !== undefined ? {
          deleteMany: {},
          create: gallery?.map((img: any, index: number) => ({
            url: img.url,
            altAr: img.altAr,
            altEn: img.altEn,
            captionAr: img.captionAr,
            captionEn: img.captionEn,
            displayOrder: img.displayOrder ?? index,
          })) || [],
        } : undefined,
      },
      include: { gallery: true },
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteProject(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getProject;
export const PUT = requireAuth(updateProject);
export const DELETE = requireAuth(deleteProject);