import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function updateCompany(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const {
      nameAr, nameEn, taglineAr, taglineEn,
      descriptionAr, descriptionEn, visionAr, visionEn, missionAr, missionEn,
      foundedYear, addressAr, addressEn, phone, email, whatsapp,
      workingHoursAr, workingHoursEn, mapEmbedUrl, logoLight,
    } = body;

    const existing = await prisma.company.findFirst();
    const data = {
      nameAr: nameAr || undefined,
      nameEn: nameEn || undefined,
      taglineAr: taglineAr ?? undefined,
      taglineEn: taglineEn ?? undefined,
      descriptionAr: descriptionAr ?? undefined,
      descriptionEn: descriptionEn ?? undefined,
      visionAr: visionAr ?? undefined,
      visionEn: visionEn ?? undefined,
      missionAr: missionAr ?? undefined,
      missionEn: missionEn ?? undefined,
      foundedYear: typeof foundedYear === 'number' && !Number.isNaN(foundedYear) ? foundedYear : undefined,
      addressAr: addressAr ?? undefined,
      addressEn: addressEn ?? undefined,
      phone: phone ?? undefined,
      email: email ?? undefined,
      whatsapp: whatsapp ?? undefined,
      workingHoursAr: workingHoursAr ?? undefined,
      workingHoursEn: workingHoursEn ?? undefined,
      mapEmbedUrl: mapEmbedUrl ?? undefined,
      logoLight: logoLight ?? undefined,
    };

    const company = existing
      ? await prisma.company.update({ where: { id: existing.id }, data })
      : await prisma.company.create({ data: { ...data, nameAr: nameAr || 'شركة الرفاعي المتحدة', nameEn: nameEn || 'ALREFAI UNITED COMPANY' } });

    // Touch updatedById audit on a related model only if provided; company model has no user relation.
    void user;

    return NextResponse.json({ data: company });
  } catch (error) {
    console.error('Update company error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PUT = requireAuth(updateCompany);
