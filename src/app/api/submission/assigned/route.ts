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

    if (session.user.role !== 'REVIEWER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Reviewer credentials required' },
        { status: 403 }
      );
    }

    // Fetch assigned submissions
    const submissions = await prisma.submission.findMany({
      where: {
        assignedReviewerId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        abstract: true,
        keywords: true,
        category: true,
        // STRICT DOUBLE-BLIND ENFORCEMENT:
        // Only return anonymized manuscript. NEVER expose fileWithAuthor or Author details!
        fileWithoutAuthor: true,
        status: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        reviews: {
          where: {
            reviewerId: session.user.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        revisionHistories: {
          select: {
            id: true,
            version: true,
            fileWithoutAuthor: true, // only anonymized past files
            responseLetter: true,
            submittedAt: true,
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching reviewer assigned submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned submissions' },
      { status: 500 }
    );
  }
}