import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      submissionId,
      fileWithAuthor,
      fileWithoutAuthor,
      responseLetter,
    } = body;

    if (!submissionId || !fileWithAuthor || !fileWithoutAuthor) {
      return NextResponse.json(
        { error: 'Submission ID, updated Identified file, and updated Anonymized file are required' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }

    // Verify ownership
    if (submission.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You are not authorized to update this submission' },
        { status: 403 }
      );
    }

    // 1. Archive current version into RevisionHistory
    await prisma.revisionHistory.create({
      data: {
        submissionId: submission.id,
        version: submission.version,
        fileWithAuthor: submission.fileWithAuthor,
        fileWithoutAuthor: submission.fileWithoutAuthor,
        responseLetter: responseLetter || null,
      },
    });

    // 2. Update Submission to new version and set status to RESUBMITTED (back to reviewer)
    const newVersion = submission.version + 1;
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        fileWithAuthor,
        fileWithoutAuthor,
        version: newVersion,
        status: submission.assignedReviewerId ? 'RESUBMITTED' : 'PENDING',
      },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
        revisionHistories: {
          orderBy: { version: 'desc' },
        },
      },
    });

    return NextResponse.json({
      message: `Revised manuscript (v${newVersion}) submitted successfully and forwarded to the reviewer.`,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Submission revision error:', error);
    return NextResponse.json(
      { error: 'Failed to submit revision' },
      { status: 500 }
    );
  }
}
