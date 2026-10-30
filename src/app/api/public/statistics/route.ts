import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    const statistics = await prisma.statistic.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        labelAr: true,
        labelEn: true,
        value: true,
        suffix: true,
        prefix: true,
        icon: true,
        displayOrder: true,
        animate: true,
      },
    });

    return NextResponse.json({ data: statistics });
  } catch (error) {
    console.error('Get public statistics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}