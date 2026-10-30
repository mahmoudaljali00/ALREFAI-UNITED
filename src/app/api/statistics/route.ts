import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getStatistics(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    const statistics = await prisma.statistic.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: statistics });
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createStatistic(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { labelAr, labelEn, value, suffix, prefix, icon, displayOrder, isActive, animate } = body;

    if (!labelAr || !labelEn || !value) {
      return NextResponse.json({ error: 'Label (both languages) and value are required' }, { status: 400 });
    }

    const statistic = await prisma.statistic.create({
      data: {
        labelAr,
        labelEn,
        value,
        suffix,
        prefix,
        icon,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
        animate: animate !== false,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: statistic }, { status: 201 });
  } catch (error) {
    console.error('Create statistic error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getStatistics;
export const POST = requireAuth(createStatistic);