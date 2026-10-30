import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getStatistic(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const statistic = await prisma.statistic.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    if (!statistic) {
      return NextResponse.json({ error: 'Statistic not found' }, { status: 404 });
    }

    return NextResponse.json({ data: statistic });
  } catch (error) {
    console.error('Get statistic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateStatistic(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { labelAr, labelEn, value, suffix, prefix, icon, displayOrder, isActive, animate } = body;

    const existingStatistic = await prisma.statistic.findUnique({ where: { id } });
    if (!existingStatistic) {
      return NextResponse.json({ error: 'Statistic not found' }, { status: 404 });
    }

    const statistic = await prisma.statistic.update({
      where: { id },
      data: {
        labelAr,
        labelEn,
        value,
        suffix,
        prefix,
        icon,
        displayOrder,
        isActive,
        animate,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: statistic });
  } catch (error) {
    console.error('Update statistic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteStatistic(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingStatistic = await prisma.statistic.findUnique({ where: { id } });
    if (!existingStatistic) {
      return NextResponse.json({ error: 'Statistic not found' }, { status: 404 });
    }

    await prisma.statistic.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete statistic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getStatistic;
export const PUT = requireAuth(updateStatistic);
export const DELETE = requireAuth(deleteStatistic);