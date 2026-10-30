import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/auth';

async function getSettings(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const isPublic = searchParams.get('isPublic');

    const where: any = {};
    if (group) where.group = group;
    if (isPublic !== null) where.isPublic = isPublic === 'true';

    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createSetting(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { key, value, type, group, labelAr, labelEn, descriptionAr, descriptionEn, isPublic } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json({ error: 'Setting with this key already exists' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.create({
      data: {
        key,
        value,
        type: type || 'string',
        group: group || 'general',
        labelAr,
        labelEn,
        descriptionAr,
        descriptionEn,
        isPublic: isPublic || false,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: setting }, { status: 201 });
  } catch (error) {
    console.error('Create setting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getSettings;
export const POST = requireAuth(createSetting);