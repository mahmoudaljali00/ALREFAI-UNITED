import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/cloudinary';

async function getMedia(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const folder = searchParams.get('folder');
    const mimeType = searchParams.get('mimeType');

    const where: any = {};
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } },
        { altAr: { contains: search, mode: 'insensitive' } },
        { altEn: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (folder) where.folder = folder;
    if (mimeType) where.mimeType = { startsWith: mimeType };

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({ data: media, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deleteMedia(request: NextRequest, user: { id: string }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    if (media.publicId) {
      await deleteImage(media.publicId);
    }

    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireAuth(getMedia);
export const DELETE = requireAuth(deleteMedia);