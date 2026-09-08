import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { logSystemEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * Publicly accessible GET to check if maintenance mode is enabled
 */
export async function GET() {
  try {
    const [disabledSetting, messageSetting, uptimeSetting] = await Promise.all([
      prisma.systemSetting.findUnique({ where: { key: 'site_disabled' } }),
      prisma.systemSetting.findUnique({ where: { key: 'maintenance_message' } }),
      prisma.systemSetting.findUnique({ where: { key: 'estimated_uptime' } }),
    ]);

    const isSiteDisabled = disabledSetting?.value === 'true';
    const maintenanceMessage =
      messageSetting?.value ||
      'The Journal of Humanities and Social Sciences Invention is temporarily undergoing scheduled maintenance and system upgrades. Editorial operations and manuscript submissions are paused. Please check back shortly.';
    const estimatedUptime = uptimeSetting?.value || 'Shortly';

    return NextResponse.json({
      isSiteDisabled,
      maintenanceMessage,
      estimatedUptime,
      updatedAt: disabledSetting?.updatedAt || new Date().toISOString(),
      updatedBy: disabledSetting?.updatedBy || 'System',
    });
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
    return NextResponse.json(
      { isSiteDisabled: false, maintenanceMessage: '', estimatedUptime: '' },
      { status: 200 }
    );
  }
}

/**
 * Super Admin only: Toggle maintenance mode / disable website
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin authority required to alter site status.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { siteDisabled, message, estimatedUptime } = body;

    const disabledValue = siteDisabled === true ? 'true' : 'false';

    // Update or create settings
    await prisma.systemSetting.upsert({
      where: { key: 'site_disabled' },
      update: { value: disabledValue, updatedBy: session.user.name || session.user.email || 'Super Admin' },
      create: { key: 'site_disabled', value: disabledValue, updatedBy: session.user.name || 'Super Admin' },
    });

    if (message && typeof message === 'string') {
      await prisma.systemSetting.upsert({
        where: { key: 'maintenance_message' },
        update: { value: message.trim(), updatedBy: session.user.name || 'Super Admin' },
        create: { key: 'maintenance_message', value: message.trim(), updatedBy: session.user.name || 'Super Admin' },
      });
    }

    if (estimatedUptime && typeof estimatedUptime === 'string') {
      await prisma.systemSetting.upsert({
        where: { key: 'estimated_uptime' },
        update: { value: estimatedUptime.trim(), updatedBy: session.user.name || 'Super Admin' },
        create: { key: 'estimated_uptime', value: estimatedUptime.trim(), updatedBy: session.user.name || 'Super Admin' },
      });
    }

    // Log critical action
    await logSystemEvent({
      level: siteDisabled ? 'SECURITY' : 'SYSTEM',
      category: 'MAINTENANCE',
      message: siteDisabled
        ? `WEBSITE HAS BEEN DISABLED (Maintenance mode activated) by ${session.user.name || session.user.email}`
        : `Website restored to active online status by ${session.user.name || session.user.email}`,
      details: { siteDisabled, message, estimatedUptime },
      userId: session.user.id,
      userName: session.user.name || 'Super Admin',
    });

    return NextResponse.json({
      success: true,
      isSiteDisabled: siteDisabled === true,
      message: siteDisabled
        ? 'Website is now DISABLED. Non-super-admin users are blocked with the maintenance notice.'
        : 'Website is now ONLINE and fully operational.',
    });
  } catch (error: any) {
    console.error('Error updating maintenance status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update maintenance status' },
      { status: 500 }
    );
  }
}
