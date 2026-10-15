import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { sendAuthorNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

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
    const { targetEmail } = body;

    const emailToSend = targetEmail && targetEmail.trim() ? targetEmail.trim() : session.user.email;

    if (!emailToSend) {
      return NextResponse.json({ error: 'Recipient email address is required' }, { status: 400 });
    }

    const result = await sendAuthorNotification('TEST', {
      title: 'Testing JHSSI Email Notification System',
      authorName: session.user.name || 'Editorial Administrator',
      authorEmail: emailToSend,
      manuscriptNo: 'JHSSI-26-0001',
      articleType: 'System Verification',
    });

    return NextResponse.json({
      message: result.message,
      status: result.status,
      recipient: emailToSend,
      success: result.success,
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send test email' }, { status: 500 });
  }
}
