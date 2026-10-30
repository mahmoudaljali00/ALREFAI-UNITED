import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getClients(request: NextRequest) {
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
      ];
    }
    if (featured !== null) where.featured = featured === 'true';
    if (isActive !== null) where.isActive = isActive === 'true';

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          updatedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({ data: clients, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createClient(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, logo, website, descriptionAr, descriptionEn, isActive, featured, displayOrder } = body;

    if (!nameAr || !nameEn || !logo) {
      return NextResponse.json({ error: 'Name (both languages) and logo are required' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        nameAr,
        nameEn,
        logo,
        website,
        descriptionAr,
        descriptionEn,
        isActive: isActive !== false,
        featured: featured || false,
        displayOrder: displayOrder || 0,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: client }, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getClients;
export const POST = requireAuth(createClient);