// import DashboardLayout from '@/components/admin/DashboardLayout';

// export default function AdminDashboardPage() {
//   return <DashboardLayout />;
// }

//updated file 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/dashboards/AdminDashboardClient';


export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <AdminDashboardClient />;
}