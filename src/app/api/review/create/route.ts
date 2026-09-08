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

    if (session.user.role !== 'REVIEWER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Reviewer permissions required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      submissionId,
      recommendation,
      commentsForAuthor,
      confidentialNotes,
      originalityScore,
      methodologyScore,
      clarityScore,
      significanceScore,
    } = body;

    if (!submissionId || !recommendation || !commentsForAuthor) {
      return NextResponse.json(
        { error: 'Submission ID, recommendation, and comments for author are required' },
        { status: 400 }
      );
    }

    // Verify submission is assigned to this reviewer or user is admin
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }

    if (session.user.role !== 'ADMIN' && submission.assignedReviewerId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not assigned as reviewer for this manuscript' },
        { status: 403 }
      );
    }

    // Determine new status based on reviewer's recommendation
    let newStatus = submission.status;
    let statusMessage = '';

    if (recommendation === 'APPROVE') {
      newStatus = 'REVIEWER_APPROVED';
      statusMessage = 'Review submitted: Manuscript approved. Escalated to Editor-in-Chief for final confirmation.';
    } else if (recommendation === 'REVISE') {
      newStatus = 'REVISION_REQUESTED';
      statusMessage = 'Review submitted: Revisions requested. Returned to Author with your feedback.';
    } else if (recommendation === 'REJECT') {
      newStatus = 'REVISION_REQUESTED'; // or REJECTED depending on editorial policy, returns for revision/rebuttal
      statusMessage = 'Review submitted: Manuscript rejected in current form. Returned to Author for required modifications.';
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        submissionId,
        reviewerId: session.user.id,
        recommendation,
        commentsForAuthor,
        confidentialNotes: confidentialNotes || null,
        originalityScore: Number(originalityScore) || 4,
        methodologyScore: Number(methodologyScore) || 4,
        clarityScore: Number(clarityScore) || 4,
        significanceScore: Number(significanceScore) || 4,
        versionReviewed: submission.version,
      },
    });

    // Update submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: newStatus,
      },
    });

    return NextResponse.json({
      message: statusMessage,
      review,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}