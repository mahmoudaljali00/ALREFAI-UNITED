import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getTeamMember(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ data: teamMember });
  } catch (error) {
    console.error('Get team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateTeamMember(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameAr, nameEn, positionAr, positionEn, bioAr, bioEn, image, email, phone, linkedin, twitter, featured, displayOrder, isActive } = body;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        nameAr, nameEn, positionAr, positionEn,
        bioAr, bioEn, image, email, phone, linkedin, twitter,
        featured, displayOrder, isActive,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: teamMember });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteTeamMember(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getTeamMember;
export const PUT = requireAuth(updateTeamMember);
export const DELETE = requireAuth(deleteTeamMember);
