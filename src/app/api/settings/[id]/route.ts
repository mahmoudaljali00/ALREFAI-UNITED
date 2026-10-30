import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getSetting(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const setting = await prisma.siteSetting.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    return NextResponse.json({ data: setting });
  } catch (error) {
    console.error('Get setting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateSetting(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { value, type, group, labelAr, labelEn, descriptionAr, descriptionEn, isPublic } = body;

    const existingSetting = await prisma.siteSetting.findUnique({ where: { id } });
    if (!existingSetting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    const setting = await prisma.siteSetting.update({
      where: { id },
      data: {
        value,
        type,
        group,
        labelAr,
        labelEn,
        descriptionAr,
        descriptionEn,
        isPublic,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: setting });
  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteSetting(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingSetting = await prisma.siteSetting.findUnique({ where: { id } });
    if (!existingSetting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    await prisma.siteSetting.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete setting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getSetting;
export const PUT = requireAuth(updateSetting);
export const DELETE = requireAuth(deleteSetting);