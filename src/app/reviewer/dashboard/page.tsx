import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import ReviewerDashboardClient from '@/components/dashboards/ReviewerDashboardClient';

export default async function ReviewerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'REVIEWER' && session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <ReviewerDashboardClient />;
}
