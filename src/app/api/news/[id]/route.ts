import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function getPost(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
        updater: { select: { id: true, name: true, email: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updatePost(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleEn, excerptAr, excerptEn, contentAr, contentEn, featuredImage, status, categoryId, metaTitleAr, metaTitleEn, metaDescriptionAr, metaDescriptionEn, ogImage } = body;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let slug = existingPost.slug;
    if (titleEn && titleEn !== existingPost.titleEn) {
      const baseSlug = slugify(titleEn);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.post.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        titleAr, titleEn, slug,
        excerptAr, excerptEn,
        contentAr, contentEn,
        featuredImage,
        status,
        publishedAt: status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' ? new Date() : existingPost.publishedAt,
        categoryId,
        metaTitleAr, metaTitleEn,
        metaDescriptionAr, metaDescriptionEn,
        ogImage,
        updaterId: user.id,
      },
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function deletePost(request: NextRequest, user: { id: string }, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = getPost;
export const PUT = requireAuth(updatePost);
export const DELETE = requireAuth(deletePost);