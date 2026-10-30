import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getTeamMembers(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    const [teamMembers, total] = await Promise.all([
      prisma.teamMember.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        take: limit,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          updatedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.teamMember.count({ where }),
    ]);

    return NextResponse.json({ data: teamMembers, total });
  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createTeamMember(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, positionAr, positionEn, bioAr, bioEn, image, email, phone, linkedin, twitter, featured, displayOrder, isActive } = body;

    if (!nameAr || !nameEn || !positionAr || !positionEn) {
      return NextResponse.json({ error: 'Name and position in both languages are required' }, { status: 400 });
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        nameAr, nameEn, positionAr, positionEn,
        bioAr, bioEn, image, email, phone, linkedin, twitter,
        featured: featured || false,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: teamMember }, { status: 201 });
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getTeamMembers;
export const POST = requireAuth(createTeamMember);
