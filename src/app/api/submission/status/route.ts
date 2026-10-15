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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permissions required to modify manuscript status directly' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { submissionId, status } = body;

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: 'Submission ID and new status are required' },
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

    // Ensure manuscriptNo exists
    let manuscriptNo = existing.manuscriptNo;
    if (!manuscriptNo) {
      const { generateManuscriptNo } = await import('@/lib/notifications');
      manuscriptNo = await generateManuscriptNo();
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status,
        manuscriptNo,
      },
      include: {
        author: true,
      },
    });

    // Send corresponding author notification
    const { sendAuthorNotification } = await import('@/lib/notifications');
    try {
      if (status === 'REVISION_REQUESTED') {
        await sendAuthorNotification('REVISION_REQUESTED', {
          title: submission.title,
          authorName: submission.author.name,
          authorEmail: submission.author.email,
          manuscriptNo: submission.manuscriptNo || 'JHSSI-Pending',
          articleType: submission.category || 'Research Article',
          comments: body.comments || 'Editorial board has requested revisions for your manuscript.',
          submissionId: submission.id,
        });
      } else if (status === 'REJECTED') {
        await sendAuthorNotification('REJECTED', {
          title: submission.title,
          authorName: submission.author.name,
          authorEmail: submission.author.email,
          manuscriptNo: submission.manuscriptNo || 'JHSSI-Pending',
          comments: body.comments || 'Manuscript does not meet current publication criteria.',
          submissionId: submission.id,
        });
      } else if (status === 'PUBLISHED') {
        await sendAuthorNotification('PUBLISHED', {
          title: submission.title,
          authorName: submission.author.name,
          authorEmail: submission.author.email,
          manuscriptNo: submission.manuscriptNo || 'JHSSI-Pending',
          doi: submission.doi || undefined,
          volume: submission.volume || undefined,
          issue: submission.issue || undefined,
          submissionId: submission.id,
        });
      }
    } catch (notifyErr) {
      console.error('Non-blocking: Failed to dispatch status notification:', notifyErr);
    }

    return NextResponse.json({
      message: `Manuscript status updated to ${status}`,
      submission,
    });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update manuscript status' },
      { status: 500 }
    );
  }
}