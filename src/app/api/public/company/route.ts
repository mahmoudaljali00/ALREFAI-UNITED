import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const company = await prisma.company.findFirst({
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        taglineAr: true,
        taglineEn: true,
        descriptionAr: true,
        descriptionEn: true,
        visionAr: true,
        visionEn: true,
        missionAr: true,
        missionEn: true,
        foundedYear: true,
        logoLight: true,
        logoDark: true,
        favicon: true,
        ogImage: true,
        addressAr: true,
        addressEn: true,
        phone: true,
        email: true,
        whatsapp: true,
        workingHoursAr: true,
        workingHoursEn: true,
        latitude: true,
        longitude: true,
        mapEmbedUrl: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ data: company });
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}