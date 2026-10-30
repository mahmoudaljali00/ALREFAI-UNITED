import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        platform: true,
        nameAr: true,
        nameEn: true,
        url: true,
        icon: true,
        openInNewTab: true,
      },
    });

    return NextResponse.json({ data: socialLinks });
  } catch (error) {
    console.error('Get public social links error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}