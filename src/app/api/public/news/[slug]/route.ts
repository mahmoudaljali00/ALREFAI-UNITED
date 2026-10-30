import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    const post = await prisma.post.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, nameAr: true, nameEn: true, slug: true, color: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Get public news by slug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}