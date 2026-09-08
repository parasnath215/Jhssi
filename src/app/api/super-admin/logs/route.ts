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
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (level && level !== 'ALL') {
      whereClause.level = level;
    }

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (search && search.trim()) {
      whereClause.OR = [
        { message: { contains: search.trim() } },
        { userName: { contains: search.trim() } },
        { details: { contains: search.trim() } },
        { ipAddress: { contains: search.trim() } },
      ];
    }

    const [logs, totalCount] = await Promise.all([
      prisma.systemLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.systemLog.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      logs,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    console.error('Error querying system logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs' },
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
    const level = searchParams.get('level');

    if (level && level !== 'ALL') {
      await prisma.systemLog.deleteMany({
        where: { level },
      });
    } else {
      await prisma.systemLog.deleteMany({});
    }

    await logSystemEvent({
      level: 'SECURITY',
      category: 'MAINTENANCE',
      message: `System logs purged by ${session.user.name || session.user.email}`,
      details: { filteredLevel: level || 'ALL' },
      userId: session.user.id,
      userName: session.user.name || 'Super Admin',
    });

    return NextResponse.json({ success: true, message: 'Logs cleared successfully' });
  } catch (error: any) {
    console.error('Error clearing system logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear logs' },
      { status: 500 }
    );
  }
}
