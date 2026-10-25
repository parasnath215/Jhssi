import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET - Fetch all reviewers with workload metrics (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permissions required' }, { status: 403 });
    }

    const reviewers = await prisma.user.findMany({
      where: {
        role: { in: ['REVIEWER', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        institution: true,
        fieldOfStudy: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            assignedReviews: true,
            assignedReviews2: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedReviewers = reviewers.map(r => ({
      ...r,
      totalAssigned: (r._count?.assignedReviews || 0) + (r._count?.assignedReviews2 || 0),
      completedReviews: r._count?.reviews || 0,
    }));

    return NextResponse.json({ reviewers: formattedReviewers });
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return NextResponse.json({ error: 'Failed to fetch reviewers' }, { status: 500 });
  }
}

// POST - Add a new reviewer with credentials (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permissions required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, institution, fieldOfStudy } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Reviewer name is required' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Reviewer email (login ID) is required' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: `User with email ${normalizedEmail} already exists` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newReviewer = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'REVIEWER',
        institution: institution ? institution.trim() : null,
        fieldOfStudy: fieldOfStudy ? fieldOfStudy.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        institution: true,
        fieldOfStudy: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: `Reviewer ${newReviewer.name} created successfully.`,
      reviewer: {
        ...newReviewer,
        totalAssigned: 0,
        completedReviews: 0,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reviewer:', error);
    return NextResponse.json({ error: 'Failed to create reviewer account' }, { status: 500 });
  }
}

// DELETE - Delete a reviewer (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permissions required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Reviewer ID is required' }, { status: 400 });
    }

    // Prevent deleting oneself
    if (id === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account' }, { status: 400 });
    }

    // Unassign reviewer from any submissions first
    await prisma.submission.updateMany({
      where: { assignedReviewerId: id },
      data: { assignedReviewerId: null },
    });

    await prisma.submission.updateMany({
      where: { assignedReviewer2Id: id },
      data: { assignedReviewer2Id: null },
    });

    // Delete reviews and the user
    await prisma.review.deleteMany({
      where: { reviewerId: id },
    });

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Reviewer successfully removed' });
  } catch (error) {
    console.error('Error deleting reviewer:', error);
    return NextResponse.json({ error: 'Failed to delete reviewer' }, { status: 500 });
  }
}

// PATCH - Edit reviewer profile or reset password (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permissions required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, institution, fieldOfStudy, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reviewer ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (institution !== undefined) updateData.institution = institution ? institution.trim() : null;
    if (fieldOfStudy !== undefined) updateData.fieldOfStudy = fieldOfStudy ? fieldOfStudy.trim() : null;
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedReviewer = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        institution: true,
        fieldOfStudy: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: 'Reviewer profile updated successfully',
      reviewer: updatedReviewer,
    });
  } catch (error) {
    console.error('Error updating reviewer:', error);
    return NextResponse.json({ error: 'Failed to update reviewer' }, { status: 500 });
  }
}
