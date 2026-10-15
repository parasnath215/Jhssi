import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { DEFAULT_EMAIL_TEMPLATES, EmailTemplateType } from '@/lib/notifications';
import { logSystemEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 1. Fetch system settings
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            'smtp_host',
            'smtp_port',
            'smtp_user',
            'smtp_pass',
            'smtp_from_name',
            'smtp_from_email',
            'email_notifications_enabled',
            'manuscript_prefix',
            'manuscript_counter_26',
            'email_template_submission_confirmation',
            'email_subject_submission_confirmation',
            'email_template_revision_requested',
            'email_subject_revision_requested',
            'email_template_rejected',
            'email_subject_rejected',
            'email_template_published',
            'email_subject_published',
          ],
        },
      },
    });

    const configMap: Record<string, string> = {};
    for (const s of settings) {
      configMap[s.key] = s.value;
    }

    const currentYearCode = new Date().getFullYear().toString().slice(-2);
    const counterKey = `manuscript_counter_${currentYearCode}`;
    const currentCounterVal = parseInt(configMap[counterKey] || '0', 10);
    const nextPreviewSeq = String(currentCounterVal + 1).padStart(4, '0');
    const manuscriptPrefix = configMap['manuscript_prefix'] || 'JHSSI';

    // 2. Templates with defaults
    const templates = {
      SUBMISSION_CONFIRMATION: {
        subject: configMap['email_subject_submission_confirmation'] || DEFAULT_EMAIL_TEMPLATES.SUBMISSION_CONFIRMATION.subject,
        body: configMap['email_template_submission_confirmation'] || DEFAULT_EMAIL_TEMPLATES.SUBMISSION_CONFIRMATION.body,
      },
      REVISION_REQUESTED: {
        subject: configMap['email_subject_revision_requested'] || DEFAULT_EMAIL_TEMPLATES.REVISION_REQUESTED.subject,
        body: configMap['email_template_revision_requested'] || DEFAULT_EMAIL_TEMPLATES.REVISION_REQUESTED.body,
      },
      REJECTED: {
        subject: configMap['email_subject_rejected'] || DEFAULT_EMAIL_TEMPLATES.REJECTED.subject,
        body: configMap['email_template_rejected'] || DEFAULT_EMAIL_TEMPLATES.REJECTED.body,
      },
      PUBLISHED: {
        subject: configMap['email_subject_published'] || DEFAULT_EMAIL_TEMPLATES.PUBLISHED.subject,
        body: configMap['email_template_published'] || DEFAULT_EMAIL_TEMPLATES.PUBLISHED.body,
      },
    };

    // 3. Recent email logs
    const recentLogs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json({
      smtp: {
        host: configMap['smtp_host'] || process.env.SMTP_HOST || 'smtp.gmail.com',
        port: configMap['smtp_port'] || process.env.SMTP_PORT || '587',
        user: configMap['smtp_user'] || process.env.SMTP_USER || '',
        hasPassword: Boolean(configMap['smtp_pass'] || process.env.SMTP_PASS),
        fromName: configMap['smtp_from_name'] || 'Journal of Humanities and Social Sciences Inventions',
        fromEmail: configMap['smtp_from_email'] || process.env.SMTP_FROM_EMAIL || 'journalofhssi@gmail.com',
        enabled: configMap['email_notifications_enabled'] !== 'false',
      },
      manuscript: {
        prefix: manuscriptPrefix,
        yearCode: currentYearCode,
        currentCounter: currentCounterVal,
        nextPreview: `${manuscriptPrefix}-${currentYearCode}-${nextPreviewSeq}`,
      },
      templates,
      defaultTemplates: DEFAULT_EMAIL_TEMPLATES,
      recentLogs,
    });
  } catch (error) {
    console.error('Error fetching admin email settings:', error);
    return NextResponse.json({ error: 'Failed to fetch email settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, smtp, templates, manuscript } = body;

    const updates: { key: string; value: string }[] = [];

    // Save SMTP settings
    if (smtp) {
      if (smtp.host !== undefined) updates.push({ key: 'smtp_host', value: String(smtp.host).trim() });
      if (smtp.port !== undefined) updates.push({ key: 'smtp_port', value: String(smtp.port).trim() });
      if (smtp.user !== undefined) updates.push({ key: 'smtp_user', value: String(smtp.user).trim() });
      if (smtp.pass !== undefined && smtp.pass !== '') updates.push({ key: 'smtp_pass', value: String(smtp.pass).trim() });
      if (smtp.fromName !== undefined) updates.push({ key: 'smtp_from_name', value: String(smtp.fromName).trim() });
      if (smtp.fromEmail !== undefined) updates.push({ key: 'smtp_from_email', value: String(smtp.fromEmail).trim() });
      if (smtp.enabled !== undefined) updates.push({ key: 'email_notifications_enabled', value: String(smtp.enabled) });
    }

    // Save Manuscript numbering config
    if (manuscript) {
      if (manuscript.prefix) updates.push({ key: 'manuscript_prefix', value: String(manuscript.prefix).trim() });
      if (manuscript.counter !== undefined) {
        const yearCode = new Date().getFullYear().toString().slice(-2);
        updates.push({ key: `manuscript_counter_${yearCode}`, value: String(manuscript.counter) });
      }
    }

    // Save Templates
    if (templates) {
      for (const [key, tpl] of Object.entries(templates) as [EmailTemplateType, { subject: string; body: string }][]) {
        if (tpl?.body) {
          updates.push({ key: `email_template_${key.toLowerCase()}`, value: tpl.body });
        }
        if (tpl?.subject) {
          updates.push({ key: `email_subject_${key.toLowerCase()}`, value: tpl.subject });
        }
      }
    }

    // Execute upserts
    await Promise.all(
      updates.map(u =>
        prisma.systemSetting.upsert({
          where: { key: u.key },
          update: { value: u.value, updatedBy: session.user.email || session.user.name },
          create: { key: u.key, value: u.value, updatedBy: session.user.email || session.user.name },
        })
      )
    );

    await logSystemEvent({
      level: 'INFO',
      category: 'SYSTEM',
      message: `Admin ${session.user.name || session.user.email} updated email & manuscript settings`,
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Admin',
    });

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error updating admin email settings:', error);
    return NextResponse.json({ error: 'Failed to update email settings' }, { status: 500 });
  }
}
