import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getMessages(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isRead = searchParams.get('isRead');
    const isReplied = searchParams.get('isReplied');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isRead !== null) where.isRead = isRead === 'true';
    if (isReplied !== null) where.isReplied = isReplied === 'true';

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          repliedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    const unreadCount = await prisma.contactMessage.count({ where: { isRead: false } });

    return NextResponse.json({ data: messages, total, page, limit, totalPages: Math.ceil(total / limit), unreadCount });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createMessage(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        company,
        subject,
        message,
      },
    });

    return NextResponse.json({ data: contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateMessage(request: NextRequest, user: { id: string }) {
  try {
    const body = await request.json();
    const { id, isRead, isReplied, assignedToId } = body;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        isRead,
        isReplied,
        assignedToId,
        repliedAt: isReplied ? new Date() : null,
        repliedById: isReplied ? user.id : null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        repliedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ data: message });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireAuth(getMessages);
export const POST = createMessage;
export const PUT = requireAuth(updateMessage);