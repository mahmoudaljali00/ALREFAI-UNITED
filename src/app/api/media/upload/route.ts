import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadImage, FOLDERS } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

async function uploadMedia(request: NextRequest, user: { id: string }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || FOLDERS.GENERAL;
    const altAr = (formData.get('altAr') as string) || '';
    const altEn = (formData.get('altEn') as string) || '';
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()) || [];

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, {
      folder,
      tags: [...tags, 'admin-upload'],
      context: { uploadedBy: user.id },
    });

    const media = await prisma.media.create({
      data: {
        filename: result.publicId,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: result.url,
        publicId: result.publicId,
        folder,
        altAr,
        altEn,
        width: result.width,
        height: result.height,
        uploadedById: user.id,
      },
    });

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (error) {
    console.error('Upload media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = requireAuth(uploadMedia);