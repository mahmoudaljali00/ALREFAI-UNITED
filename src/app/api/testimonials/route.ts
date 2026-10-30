import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getTestimonials(request: NextRequest) {
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
        { clientNameAr: { contains: search, mode: 'insensitive' } },
        { clientNameEn: { contains: search, mode: 'insensitive' } },
        { companyAr: { contains: search, mode: 'insensitive' } },
        { companyEn: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (featured !== null) where.featured = featured === 'true';
    if (isActive !== null) where.isActive = isActive === 'true';

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          updatedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json({ data: testimonials, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createTestimonial(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { clientNameAr, clientNameEn, positionAr, positionEn, companyAr, companyEn, contentAr, contentEn, image, rating, isActive, featured, displayOrder } = body;

    if (!clientNameAr || !clientNameEn || !positionAr || !positionEn || !contentAr || !contentEn) {
      return NextResponse.json({ error: 'Client name, position, and content in both languages are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientNameAr,
        clientNameEn,
        positionAr,
        positionEn,
        companyAr,
        companyEn,
        contentAr,
        contentEn,
        image,
        rating: rating || 5,
        isActive: isActive !== false,
        featured: featured || false,
        displayOrder: displayOrder || 0,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getTestimonials;
export const POST = requireAuth(createTestimonial);