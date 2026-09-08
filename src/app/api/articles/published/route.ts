import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const volume = searchParams.get('volume');
    const issue = searchParams.get('issue');

    const where: any = {
      status: 'PUBLISHED',
    };

    if (volume) where.volume = volume;
    if (issue) where.issue = issue;

    const articles = await prisma.submission.findMany({
      where,
      select: {
        id: true,
        title: true,
        abstract: true,
        keywords: true,
        category: true,
        fileWithAuthor: true,
        doi: true,
        volume: true,
        issue: true,
        pages: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            institution: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching published articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch published articles' },
      { status: 500 }
    );
  }
}
