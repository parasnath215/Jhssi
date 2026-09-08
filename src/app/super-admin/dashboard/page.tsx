import { Metadata } from 'next';
import SuperAdminDashboardClient from '@/components/dashboards/SuperAdminDashboardClient';

export const metadata: Metadata = {
  title: 'Super Admin Console | JHSSI Journal Operations',
  description: 'Global control center, system logs, telemetry, and site management for JHSSI.',
};

export default function SuperAdminDashboardPage() {
  return <SuperAdminDashboardClient />;
}
