import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch all submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const submissions = await prisma.submission.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            institution: true,
            fieldOfStudy: true,
          },
        },
        assignedReviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            institution: true,
            fieldOfStudy: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
    console.error('Error fetching submissions for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// PATCH - Assign reviewer to submission (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { submissionId, reviewerId } = body;

    if (!submissionId || !reviewerId) {
      return NextResponse.json(
        { error: 'Submission ID and Reviewer ID are required' },
        { status: 400 }
      );
    }

    // Verify reviewer exists
    const reviewer = await prisma.user.findFirst({
      where: {
        id: reviewerId,
        role: { in: ['REVIEWER', 'ADMIN'] },
      },
    });

    if (!reviewer) {
      return NextResponse.json(
        { error: 'Invalid reviewer ID or user is not a reviewer' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        assignedReviewerId: reviewerId,
        status: 'UNDER_REVIEW',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedReviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: `Manuscript successfully assigned to reviewer ${reviewer.name}`,
      submission,
    });
  } catch (error) {
    console.error('Error assigning submission:', error);
    return NextResponse.json(
      { error: 'Failed to assign submission' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a paper from database (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    await prisma.review.deleteMany({ where: { submissionId: id } });
    await prisma.revisionHistory.deleteMany({ where: { submissionId: id } });
    await prisma.submission.delete({ where: { id } });

    return NextResponse.json({ message: 'Manuscript removed successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete manuscript' },
      { status: 500 }
    );
  }
}