import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permissions required to manually publish research papers' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      abstract,
      authorName,
      authorEmail,
      authorInstitution,
      category,
      keywords,
      volume,
      issue,
      pages,
      doi,
      publishedAt, // Selected custom date
      fileUrl,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Manuscript title is required' }, { status: 400 });
    }

    if (!authorName || !authorName.trim()) {
      return NextResponse.json({ error: 'Author name is required' }, { status: 400 });
    }

    if (!fileUrl) {
      return NextResponse.json({ error: 'Manuscript PDF file is required' }, { status: 400 });
    }

    // Determine target publication date
    const finalPublicationDate = publishedAt ? new Date(publishedAt) : new Date();
    if (isNaN(finalPublicationDate.getTime())) {
      return NextResponse.json({ error: 'Invalid publication date format' }, { status: 400 });
    }

    // Determine or create Author account
    const emailToUse = (authorEmail && authorEmail.trim())
      ? authorEmail.toLowerCase().trim()
      : `author_${Date.now()}@jhssi.com`;

    let author = await prisma.user.findUnique({
      where: { email: emailToUse },
    });

    if (!author) {
      const defaultHash = await bcrypt.hash('password123', 10);
      author = await prisma.user.create({
        data: {
          name: authorName.trim(),
          email: emailToUse,
          password: defaultHash,
          role: 'AUTHOR',
          institution: authorInstitution ? String(authorInstitution).trim() : null,
          fieldOfStudy: category || 'Humanities & Social Sciences',
        },
      });
    }

    // Compute DOI if not manually specified
    const year = finalPublicationDate.getFullYear();
    const vol = volume || '6';
    const iss = issue || '1';
    const computedDoi = doi && doi.trim()
      ? doi.trim()
      : `10.32456/jhssi.${year}.${vol}.${iss}.${Math.floor(100 + Math.random() * 900)}`;

    // Directly create the paper with PUBLISHED status and the selected date
    const submission = await prisma.submission.create({
      data: {
        title: title.trim(),
        abstract: abstract ? abstract.trim() : 'Published research paper archived by editorial board.',
        keywords: keywords ? String(keywords).trim() : null,
        category: category ? String(category).trim() : 'General Humanities & Social Sciences',
        fileWithAuthor: fileUrl,
        fileWithoutAuthor: fileUrl,
        status: 'PUBLISHED',
        version: 1,
        authorId: author.id,
        volume: vol,
        issue: iss,
        pages: pages || '1-20',
        doi: computedDoi,
        publishedAt: finalPublicationDate,
        createdAt: finalPublicationDate, // synchronize creation with publication date for archives
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
      message: 'Research paper successfully published to JHSSI Journal on the selected date.',
      submission,
    }, { status: 201 });
  } catch (error) {
    console.error('Manual publication error:', error);
    return NextResponse.json(
      { error: 'Failed to manually publish paper. Please try again.' },
      { status: 500 }
    );
  }
}
