import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');

    const where: any = { isPublic: true };
    if (group) where.group = group;

    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
      select: {
        id: true,
        key: true,
        value: true,
        type: true,
        group: true,
        labelAr: true,
        labelEn: true,
        descriptionAr: true,
        descriptionEn: true,
      },
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Get public settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}