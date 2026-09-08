import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getFolderStats(folderPath: string): { fileCount: number; totalSizeBytes: number } {
  let fileCount = 0;
  let totalSizeBytes = 0;

  function traverse(currentPath: string) {
    if (!fs.existsSync(currentPath)) return;
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          traverse(fullPath);
        } else {
          fileCount++;
          try {
            totalSizeBytes += fs.statSync(fullPath).size;
          } catch {}
        }
      }
    } catch {}
  }

  traverse(folderPath);
  return { fileCount, totalSizeBytes };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Super Admin authority required' },
        { status: 403 }
      );
    }

    // 1. SQLite Database stats
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    let dbSizeBytes = 0;
    if (fs.existsSync(dbPath)) {
      try {
        dbSizeBytes = fs.statSync(dbPath).size;
      } catch {}
    }

    // 2. Storage / Uploads stats
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const uploadsStats = getFolderStats(uploadsPath);

    // 3. Runtime & Node telemetry
    const mem = process.memoryUsage();
    const runtime = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: (mem.rss / 1024 / 1024).toFixed(2),
        heapTotalMb: (mem.heapTotal / 1024 / 1024).toFixed(2),
        heapUsedMb: (mem.heapUsed / 1024 / 1024).toFixed(2),
      },
    };

    // 4. Database Entities Telemetry
    const [
      totalUsers,
      authorsCount,
      reviewersCount,
      adminsCount,
      superAdminsCount,
      submissionsTotal,
      publishedCount,
      underReviewCount,
      revisionsCount,
      pendingCount,
      reviewsCount,
      logsCount,
      maintenanceSetting,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'AUTHOR' } }),
      prisma.user.count({ where: { role: 'REVIEWER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'SUPER_ADMIN' } }),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: 'PUBLISHED' } }),
      prisma.submission.count({ where: { status: { in: ['UNDER_REVIEW', 'RESUBMITTED'] } } }),
      prisma.submission.count({ where: { status: 'REVISION_REQUESTED' } }),
      prisma.submission.count({ where: { status: 'PENDING' } }),
      prisma.review.count(),
      prisma.systemLog.count(),
      prisma.systemSetting.findUnique({ where: { key: 'site_disabled' } }),
    ]);

    return NextResponse.json({
      db: {
        type: 'SQLite Relational Engine',
        status: 'ONLINE & HEALTHY',
        sizeBytes: dbSizeBytes,
        sizeFormatted: (dbSizeBytes / 1024 / 1024).toFixed(2) + ' MB',
      },
      storage: {
        uploadsPath: 'public/uploads',
        filesCount: uploadsStats.fileCount,
        sizeBytes: uploadsStats.totalSizeBytes,
        sizeFormatted: (uploadsStats.totalSizeBytes / 1024 / 1024).toFixed(2) + ' MB',
      },
      runtime,
      counts: {
        users: {
          total: totalUsers,
          authors: authorsCount,
          reviewers: reviewersCount,
          admins: adminsCount,
          superAdmins: superAdminsCount,
        },
        submissions: {
          total: submissionsTotal,
          published: publishedCount,
          underReview: underReviewCount,
          revisionsRequired: revisionsCount,
          pendingAssignment: pendingCount,
        },
        reviewsTotal: reviewsCount,
        systemLogsTotal: logsCount,
      },
      siteStatus: {
        isSiteDisabled: maintenanceSetting?.value === 'true',
        statusText: maintenanceSetting?.value === 'true' ? 'MAINTENANCE_MODE_ACTIVE' : 'OPERATIONAL',
      },
    });
  } catch (error: any) {
    console.error('Error fetching system stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch telemetry' },
      { status: 500 }
    );
  }
}
