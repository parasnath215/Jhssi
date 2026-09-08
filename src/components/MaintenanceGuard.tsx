'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Wrench, Clock, Lock, ArrowRight } from 'lucide-react';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [siteDisabled, setSiteDisabled] = useState<boolean>(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('');
  const [estimatedUptime, setEstimatedUptime] = useState<string>('');
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  useEffect(() => {
    checkMaintenanceStatus();
    // Poll status periodically (every 15 seconds) so changes take effect quickly
    const interval = setInterval(checkMaintenanceStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const res = await fetch('/api/super-admin/maintenance', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSiteDisabled(data.isSiteDisabled === true);
        if (data.maintenanceMessage) setMaintenanceMessage(data.maintenanceMessage);
        if (data.estimatedUptime) setEstimatedUptime(data.estimatedUptime);
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoadingStatus(false);
    }
  };

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
  const isSuperAdminRoute = pathname?.startsWith('/super-admin');
  const isLoginRoute = pathname === '/login' || pathname?.startsWith('/auth');

  // If site is disabled and viewer is NOT a Super Admin, block all public and regular portal routes (except /login so Super Admin can log in!)
  if (siteDisabled && !isSuperAdmin && !isSuperAdminRoute && !isLoginRoute) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-between items-center p-6 md:p-12 text-[#3F2A1D] selection:bg-[#C8A45D]/30">
        {/* Top Header */}
        <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-[#E6DDCF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3F2A1D] text-[#C8A45D] flex items-center justify-center font-serif text-xl font-bold">
              J
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#3F2A1D] tracking-wide">
                JHSSI JOURNAL
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#6B4A2E]">
                Journal of Humanities & Social Sciences Invention
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" /> Maintenance Mode
          </span>
        </header>

        {/* Center Content */}
        <main className="max-w-2xl text-center py-12 px-4 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 shadow-sm text-amber-700 mx-auto mb-2 animate-pulse">
            <Wrench className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <div className="inline-block px-3 py-1 bg-[#F6F1E8] text-[#6B4A2E] border border-[#E6DDCF] rounded-full text-xs font-bold uppercase tracking-wider">
              Temporary Editorial Suspension
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3F2A1D] leading-tight">
              Scheduled System Upgrades & Maintenance
            </h2>
            <div className="w-16 h-1 bg-[#C8A45D] mx-auto my-3" />
          </div>

          <p className="text-sm md:text-base text-[#6B4A2E] leading-relaxed bg-white p-6 rounded-2xl border border-[#E6DDCF] shadow-xs">
            {maintenanceMessage ||
              'The Journal of Humanities and Social Sciences Invention is temporarily undergoing scheduled maintenance and system upgrades. Editorial operations and manuscript submissions are paused. Please check back shortly.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#6B4A2E]/80 pt-2">
            <div className="flex items-center gap-1.5 bg-[#F6F1E8] px-3 py-1.5 rounded-lg border border-[#E6DDCF]">
              <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>
                Estimated Uptime: <strong>{estimatedUptime || 'Shortly'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F6F1E8] px-3 py-1.5 rounded-lg border border-[#E6DDCF]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Data Integrity & Manuscripts Preserved</span>
            </div>
          </div>
        </main>

        {/* Footer with Discreet Staff Access */}
        <footer className="w-full max-w-4xl py-4 border-t border-[#E6DDCF] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B4A2E]/70 gap-3">
          <p>© {new Date().getFullYear()} JHSSI Journal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 hover:text-[#3F2A1D] font-medium transition text-[11px]"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Login</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  // Normal view (or Super Admin view)
  return (
    <>
      {/* Super Admin Persistent Alert Banner when site is disabled */}
      {siteDisabled && isSuperAdmin && (
        <div className="sticky top-0 z-[100] bg-red-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>
              🔴 SYSTEM ALERT: Website is currently DISABLED (Maintenance Mode). Only Super Admin has bypass access.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/super-admin/dashboard"
              className="px-2.5 py-1 bg-white text-red-700 rounded-md font-extrabold hover:bg-red-50 transition"
            >
              Open Super Admin Console
            </Link>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
