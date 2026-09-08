import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { logSystemEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Super Admin authority required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (role && role !== 'ALL') {
      whereClause.role = role;
    }
    if (search && search.trim()) {
      whereClause.OR = [
        { name: { contains: search.trim() } },
        { email: { contains: search.trim() } },
        { institution: { contains: search.trim() } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institution: true,
        fieldOfStudy: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true,
            assignedReviews: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Super Admin authority required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role, name, institution } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (institution !== undefined) updateData.institution = institution;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await logSystemEvent({
      level: 'SECURITY',
      category: 'AUTH',
      message: `User ${updatedUser.email} modified by Super Admin ${session.user.name || session.user.email}`,
      details: { targetUserId: userId, changes: updateData },
      userId: session.user.id,
      userName: session.user.name || 'Super Admin',
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.name} updated successfully`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Super Admin authority required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Protect self-deletion
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own Super Admin account' },
        { status: 400 }
      );
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    await logSystemEvent({
      level: 'WARN',
      category: 'AUTH',
      message: `User account ${deletedUser.email} (${deletedUser.role}) permanently deleted by Super Admin`,
      details: { deletedUserId: userId, userEmail: deletedUser.email },
      userId: session.user.id,
      userName: session.user.name || 'Super Admin',
    });

    return NextResponse.json({
      success: true,
      message: `User ${deletedUser.email} has been permanently deleted`,
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
