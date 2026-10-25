import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Retrieve the 5 latest submitted papers in real-time, ordered chronologically descending
    const submissions = await prisma.submission.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
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
      },
    });

    return NextResponse.json({
      success: true,
      papers: submissions,
      count: submissions.length,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching current issue latest submissions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve current issue papers' },
      { status: 500 }
    );
  }
}
