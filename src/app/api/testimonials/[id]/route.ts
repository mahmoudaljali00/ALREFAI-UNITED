import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getTestimonial(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ data: testimonial });
  } catch (error) {
    console.error('Get testimonial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateTestimonial(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { clientNameAr, clientNameEn, positionAr, positionEn, companyAr, companyEn, contentAr, contentEn, image, rating, isActive, featured, displayOrder } = body;

    const existingTestimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        clientNameAr, clientNameEn,
        positionAr, positionEn,
        companyAr, companyEn,
        contentAr, contentEn,
        image, rating,
        isActive, featured, displayOrder,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteTestimonial(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingTestimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getTestimonial;
export const PUT = requireAuth(updateTestimonial);
export const DELETE = requireAuth(deleteTestimonial);