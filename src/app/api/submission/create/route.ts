import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { generateManuscriptNo, sendAuthorNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      abstract,
      keywords,
      category,
      fileWithAuthor,
      fileWithoutAuthor,
    } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Manuscript title is required.' }, { status: 400 });
    }

    if (!abstract || !abstract.trim()) {
      return NextResponse.json({ error: 'Abstract is required.' }, { status: 400 });
    }

    if (!fileWithAuthor) {
      return NextResponse.json(
        { error: 'Marked Manuscript is required.' },
        { status: 400 }
      );
    }

    if (!fileWithoutAuthor) {
      return NextResponse.json(
        { error: 'Unmarked Manuscript (with detailed name and address of author) is required.' },
        { status: 400 }
      );
    }

    // Generate unique sequential academic manuscript number (e.g. JHSSI-26-0001)
    const manuscriptNo = await generateManuscriptNo();

    const submission = await prisma.submission.create({
      data: {
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywords ? String(keywords).trim() : null,
        category: category ? String(category).trim() : 'General Humanities & Social Sciences',
        fileWithAuthor,
        fileWithoutAuthor,
        authorId: session.user.id,
        status: 'PENDING',
        version: 1,
        manuscriptNo,
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

    // Send automated email to the author with the official template
    try {
      await sendAuthorNotification('SUBMISSION_CONFIRMATION', {
        title: submission.title,
        authorName: submission.author.name,
        authorEmail: submission.author.email,
        username: session.user.email || submission.author.email,
        articleType: submission.category || 'Research Article',
        manuscriptNo: submission.manuscriptNo || manuscriptNo,
        submissionId: submission.id,
      });
    } catch (emailErr) {
      console.error('Non-blocking: Failed to dispatch submission confirmation email:', emailErr);
    }

    return NextResponse.json({
      message: `Research paper submitted successfully. Assigned Manuscript No: ${manuscriptNo}. It will now be assigned for double-blind peer review.`,
      submission,
      manuscriptNo,
    }, { status: 201 });
  } catch (error) {
    console.error('Submission creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create submission. Please try again.' },
      { status: 500 }
    );
  }
}