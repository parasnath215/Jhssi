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
        assignedReviewer2: {
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

// PATCH - Assign up to 2 reviewers to submission (admin only)
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
    const { submissionId, reviewerId, reviewer2Id } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    if (reviewerId && reviewer2Id && reviewerId === reviewer2Id) {
      return NextResponse.json(
        { error: 'Reviewer 1 and Reviewer 2 must be different reviewers' },
        { status: 400 }
      );
    }

    // Verify Reviewer 1 if provided
    let reviewer1Name = '';
    if (reviewerId) {
      const r1 = await prisma.user.findFirst({
        where: { id: reviewerId, role: { in: ['REVIEWER', 'ADMIN'] } },
      });
      if (!r1) {
        return NextResponse.json({ error: 'Invalid Reviewer 1 ID' }, { status: 400 });
      }
      reviewer1Name = r1.name;
    }

    // Verify Reviewer 2 if provided
    let reviewer2Name = '';
    if (reviewer2Id) {
      const r2 = await prisma.user.findFirst({
        where: { id: reviewer2Id, role: { in: ['REVIEWER', 'ADMIN'] } },
      });
      if (!r2) {
        return NextResponse.json({ error: 'Invalid Reviewer 2 ID' }, { status: 400 });
      }
      reviewer2Name = r2.name;
    }

    const hasAnyReviewer = !!(reviewerId || reviewer2Id);

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        assignedReviewerId: reviewerId || null,
        assignedReviewer2Id: reviewer2Id || null,
        status: hasAnyReviewer ? 'UNDER_REVIEW' : 'PENDING',
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
            institution: true,
          },
        },
        assignedReviewer2: {
          select: {
            id: true,
            name: true,
            email: true,
            institution: true,
          },
        },
      },
    });

    const assignedNames = [reviewer1Name, reviewer2Name].filter(Boolean).join(' & ');

    return NextResponse.json({
      message: assignedNames
        ? `Manuscript assigned to ${assignedNames} for peer review.`
        : 'Reviewers unassigned.',
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