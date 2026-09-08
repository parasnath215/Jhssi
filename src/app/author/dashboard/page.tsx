import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import AuthorDashboardClient from '@/components/dashboards/AuthorDashboardClient';

export default async function AuthorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'AUTHOR' && session.user.role !== 'STUDENT' && session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return <AuthorDashboardClient />;
}