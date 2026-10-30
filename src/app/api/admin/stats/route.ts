import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function getAdminStats() {
  try {
    const [
      totalProjects,
      totalServices,
      totalClients,
      unreadMessages,
      publishedArticles,
      activeTeamMembers,
    ] = await Promise.all([
      prisma.project.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.client.count({ where: { isActive: true } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.teamMember.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      data: {
        totalProjects,
        totalServices,
        totalClients,
        unreadMessages,
        publishedArticles,
        activeTeamMembers,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireAuth(getAdminStats);