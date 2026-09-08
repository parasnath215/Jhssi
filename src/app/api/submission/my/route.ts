import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        assignedReviewer: {
          select: {
            id: true,
            name: true,
            institution: true,
          },
        },
        reviews: {
          select: {
            id: true,
            recommendation: true,
            commentsForAuthor: true,
            originalityScore: true,
            methodologyScore: true,
            clarityScore: true,
            significanceScore: true,
            versionReviewed: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        revisionHistories: {
          orderBy: {
            version: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching author submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}