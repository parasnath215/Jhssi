import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { sendAuthorNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permissions required to return manuscript to author' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { submissionId, comments } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    if (!comments || !comments.trim()) {
      return NextResponse.json(
        { error: 'Editorial comments and revision instructions are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        author: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'REVISION_REQUESTED',
        editorialComments: comments.trim(),
      },
      include: {
        author: true,
        assignedReviewer: true,
        assignedReviewer2: true,
      },
    });

    // Send email notification with editorial comments
    try {
      await sendAuthorNotification('REVISION_REQUESTED', {
        title: updatedSubmission.title,
        authorName: updatedSubmission.author.name,
        authorEmail: updatedSubmission.author.email,
        manuscriptNo: updatedSubmission.manuscriptNo || 'JHSSI-Pending',
        articleType: updatedSubmission.category || 'Research Article',
        comments: comments.trim(),
        submissionId: updatedSubmission.id,
      });
    } catch (emailErr) {
      console.error('Non-blocking: Failed to send revision email to author:', emailErr);
    }

    return NextResponse.json({
      message: `Manuscript ${updatedSubmission.manuscriptNo || ''} returned to author with editorial comments.`,
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Error sending paper back to author:', error);
    return NextResponse.json(
      { error: 'Failed to return manuscript to author' },
      { status: 500 }
    );
  }
}
