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
        { error: 'Admin access required for publication confirmation' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { submissionId, doi, volume, issue, pages, action } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { author: true },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (action === 'REJECT') {
      const updated = await prisma.submission.update({
        where: { id: submissionId },
        data: { status: 'REJECTED' },
      });
      return NextResponse.json({
        message: 'Manuscript has been rejected by editorial decision.',
        submission: updated,
      });
    }

    // Default or PUBLISH action:
    const autoDoi = doi || `10.32456/jhssi.${new Date().getFullYear()}.${volume || '6'}.${issue || '1'}.${Math.floor(100 + Math.random() * 900)}`;

    const publishedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'PUBLISHED',
        doi: autoDoi,
        volume: volume || '6',
        issue: issue || '1',
        pages: pages || '1-24',
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            institution: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Manuscript approved and officially published to JHSSI Journal!',
      submission: publishedSubmission,
    });
  } catch (error) {
    console.error('Publication confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm publication' },
      { status: 500 }
    );
  }
}
