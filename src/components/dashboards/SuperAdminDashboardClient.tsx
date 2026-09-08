'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  ShieldAlert,
  Server,
  Activity,
  Users,
  FileText,
  Wrench,
  RefreshCw,
  Power,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Database,
  HardDrive,
  Cpu,
  Clock,
  LogOut,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ShieldCheck,
  Eye,
  Settings,
  ExternalLink
} from 'lucide-react';

interface SystemLogItem {
  id: string;
  level: string;
  category: string;
  message: string;
  details?: string | null;
  ipAddress?: string | null;
  userId?: string | null;
  userName?: string | null;
  createdAt: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: string | null;
  createdAt: string;
  _count: {
    submissions: number;
    assignedReviews: number;
    reviews: number;
  };
}

interface SubmissionItem {
  id: string;
  title: string;
  status: string;
  version: number;
  doi?: string | null;
  volume?: string | null;
  issue?: string | null;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
  assignedReviewer?: {
    name: string;
    email: string;
  } | null;
}

interface SystemStats {
  db: {
    type: string;
    status: string;
    sizeFormatted: string;
  };
  storage: {
    uploadsPath: string;
    filesCount: number;
    sizeFormatted: string;
  };
  runtime: {
    nodeVersion: string;
    platform: string;
    arch: string;
    uptimeSeconds: number;
    memory: {
      rssMb: string;
      heapTotalMb: string;
      heapUsedMb: string;
    };
  };
  counts: {
    users: {
      total: number;
      authors: number;
      reviewers: number;
      admins: number;
      superAdmins: number;
    };
    submissions: {
      total: number;
      published: number;
      underReview: number;
      revisionsRequired: number;
      pendingAssignment: number;
    };
    reviewsTotal: number;
    systemLogsTotal: number;
  };
  siteStatus: {
    isSiteDisabled: boolean;
    statusText: string;
  };
}

export default function SuperAdminDashboardClient() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'LOGS' | 'TELEMETRY' | 'USERS' | 'SUBMISSIONS' | 'SETTINGS'>('LOGS');

  // Killswitch / Maintenance state
  const [siteDisabled, setSiteDisabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [estimatedUptime, setEstimatedUptime] = useState('Shortly');
  const [togglingKillswitch, setTogglingKillswitch] = useState(false);
  const [isKillswitchModalOpen, setIsKillswitchModalOpen] = useState(false);

  // Telemetry & Stats
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Technical Logs state
  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logLevelFilter, setLogLevelFilter] = useState('ALL');
  const [logCategoryFilter, setLogCategoryFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Users state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Submissions state
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subSearch, setSubSearch] = useState('');

  useEffect(() => {
    fetchMaintenanceState();
    fetchStats();
    fetchLogs();
    fetchUsers();
    fetchSubmissions();
  }, []);

  // 1. Fetch Maintenance state
  const fetchMaintenanceState = async () => {
    try {
      const res = await fetch('/api/super-admin/maintenance', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSiteDisabled(data.isSiteDisabled === true);
        if (data.maintenanceMessage) setMaintenanceMessage(data.maintenanceMessage);
        if (data.estimatedUptime) setEstimatedUptime(data.estimatedUptime);
      }
    } catch (err) {
      console.error('Error fetching maintenance:', err);
    }
  };

  // 2. Fetch Telemetry
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/super-admin/system-stats', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.siteStatus) setSiteDisabled(data.siteStatus.isSiteDisabled);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // 3. Fetch Logs
  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const params = new URLSearchParams();
      if (logLevelFilter !== 'ALL') params.append('level', logLevelFilter);
      if (logCategoryFilter !== 'ALL') params.append('category', logCategoryFilter);
      if (logSearch.trim()) params.append('search', logSearch.trim());
      params.append('limit', '80');

      const res = await fetch(`/api/super-admin/logs?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // 4. Fetch Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      if (userRoleFilter !== 'ALL') params.append('role', userRoleFilter);
      if (userSearch.trim()) params.append('search', userSearch.trim());

      const res = await fetch(`/api/super-admin/users?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // 5. Fetch Submissions
  const fetchSubmissions = async () => {
    try {
      setSubsLoading(true);
      const res = await fetch('/api/submission/all', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setSubsLoading(false);
    }
  };

  // Toggle Maintenance Killswitch
  const handleToggleKillswitch = async (newDisabledState: boolean) => {
    setTogglingKillswitch(true);
    try {
      const res = await fetch('/api/super-admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteDisabled: newDisabledState,
          message: maintenanceMessage,
          estimatedUptime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle killswitch');

      setSiteDisabled(newDisabledState);
      setIsKillswitchModalOpen(false);
      alert(data.message || (newDisabledState ? 'Website disabled' : 'Website restored online'));
      fetchLogs();
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Error updating killswitch');
    } finally {
      setTogglingKillswitch(false);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to purge technical logs? This action will be audited.')) return;
    try {
      const res = await fetch('/api/super-admin/logs', { method: 'DELETE' });
      if (res.ok) {
        alert('Technical logs cleared successfully.');
        fetchLogs();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to clear logs');
    }
  };

  // Change User Role
  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      alert(`Role successfully updated to ${newRole}`);
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      alert(err.message || 'Failed to change role');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to permanently delete user ${userEmail}?`)) return;
    try {
      const res = await fetch(`/api/super-admin/users?userId=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      alert(data.message || 'User deleted');
      fetchUsers();
      fetchLogs();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    }
  };

  // Format uptime
  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d > 0 ? `${d}d ` : ''}${h}h ${m}m ${s}s`;
  };

  // Guard access
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#6B4A2E] animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#6B4A2E]">Initializing Super Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-200 shadow-sm text-center">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-xs text-red-700 mb-6">
            This console is restricted strictly to Chief Systems Administrators. Elevated credentials required.
          </p>
          <Link
            href="/login"
            className="inline-block px-5 py-2.5 bg-[#6B4A2E] text-white text-xs font-bold rounded-xl"
          >
            Authenticate with Authorized Credentials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#3F2A1D] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E6DDCF] sticky top-0 z-40 px-4 md:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F2A1D] to-[#1A120B] text-[#C8A45D] flex items-center justify-center font-serif text-xl font-bold shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-[#3F2A1D]">Super Admin Command Center</h1>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-extrabold rounded-full border border-purple-200">
                  SYSTEM OVERLORD
                </span>
              </div>
              <p className="text-[11px] text-[#6B4A2E]">
                JHSSI Operations, Technical Telemetry, Audit Logs & Global Killswitch
              </p>
            </div>
          </div>

          {/* Master Killswitch Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F6F1E8] rounded-xl border border-[#E6DDCF]">
              <span className={`w-2.5 h-2.5 rounded-full ${siteDisabled ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-xs font-bold">
                {siteDisabled ? 'WEBSITE DISABLED' : 'WEBSITE ONLINE'}
              </span>
            </div>

            <button
              onClick={() => setIsKillswitchModalOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                siteDisabled
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{siteDisabled ? 'Enable Website' : 'Disable Website'}</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 border-t border-[#E6DDCF]/60 pt-3 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('LOGS'); fetchLogs(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'LOGS'
                ? 'bg-[#6B4A2E] text-white shadow-xs'
                : 'text-[#6B4A2E] hover:bg-[#F6F1E8]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Technical Logs ({logs.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('TELEMETRY'); fetchStats(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'TELEMETRY'
                ? 'bg-[#6B4A2E] text-white shadow-xs'
                : 'text-[#6B4A2E] hover:bg-[#F6F1E8]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>System Telemetry & Health</span>
          </button>

          <button
            onClick={() => { setActiveTab('USERS'); fetchUsers(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'USERS'
                ? 'bg-[#6B4A2E] text-white shadow-xs'
                : 'text-[#6B4A2E] hover:bg-[#F6F1E8]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Directory & Roles ({users.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('SUBMISSIONS'); fetchSubmissions(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'SUBMISSIONS'
                ? 'bg-[#6B4A2E] text-white shadow-xs'
                : 'text-[#6B4A2E] hover:bg-[#F6F1E8]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Publishing Pipeline ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'SETTINGS'
                ? 'bg-[#6B4A2E] text-white shadow-xs'
                : 'text-[#6B4A2E] hover:bg-[#F6F1E8]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Killswitch & Maintenance Config</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-1">
        {/* TAB 1: TECHNICAL LOGS */}
        {activeTab === 'LOGS' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6DDCF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search logs by message, user..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl outline-hidden focus:ring-1 focus:ring-[#C8A45D]"
                  />
                </div>

                <select
                  value={logLevelFilter}
                  onChange={(e) => { setLogLevelFilter(e.target.value); }}
                  className="px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl text-[#3F2A1D]"
                >
                  <option value="ALL">All Levels</option>
                  <option value="ERROR">ERROR</option>
                  <option value="WARN">WARN</option>
                  <option value="SECURITY">SECURITY</option>
                  <option value="SYSTEM">SYSTEM</option>
                  <option value="INFO">INFO</option>
                </select>

                <select
                  value={logCategoryFilter}
                  onChange={(e) => { setLogCategoryFilter(e.target.value); }}
                  className="px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl text-[#3F2A1D]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="AUTH">AUTH</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="SUBMISSION">SUBMISSION</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="PUBLISH">PUBLISH</option>
                  <option value="API">API</option>
                  <option value="SYSTEM">SYSTEM</option>
                </select>

                <button
                  onClick={fetchLogs}
                  className="px-3 py-1.5 bg-[#F6F1E8] hover:bg-[#E6DDCF] text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${logsLoading ? 'animate-spin' : ''}`} />
                  <span>Filter</span>
                </button>
              </div>

              <button
                onClick={handleClearLogs}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Purge Logs</span>
              </button>
            </div>

            {/* Logs Stream */}
            <div className="bg-white rounded-2xl border border-[#E6DDCF] shadow-xs overflow-hidden">
              <div className="px-4 py-3 bg-[#FBF9F5] border-b border-[#E6DDCF] flex items-center justify-between text-xs font-bold text-[#6B4A2E]">
                <span>Timestamp & Event Log</span>
                <span>Category / Severity</span>
              </div>

              {logsLoading ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#6B4A2E]" />
                  Querying SQLite system_logs...
                </div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No technical logs match the selected filter.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 font-mono text-xs">
                  {logs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    const levelColors: { [key: string]: string } = {
                      ERROR: 'bg-red-100 text-red-800 border-red-200',
                      WARN: 'bg-amber-100 text-amber-800 border-amber-200',
                      SECURITY: 'bg-purple-100 text-purple-800 border-purple-200',
                      SYSTEM: 'bg-blue-100 text-blue-800 border-blue-200',
                      INFO: 'bg-gray-100 text-gray-800 border-gray-200',
                    };

                    return (
                      <div
                        key={log.id}
                        className="p-3 hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                                levelColors[log.level] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {log.level}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                            <span className="font-sans font-semibold text-[#3F2A1D] text-xs">
                              {log.message}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="px-2 py-0.5 bg-[#F6F1E8] text-[#6B4A2E] rounded-md text-[10px] font-bold">
                              {log.category}
                            </span>
                            {log.userName && (
                              <span className="text-[10px] text-gray-500">
                                by {log.userName}
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && log.details && (
                          <div className="mt-2.5 p-3 bg-gray-900 text-emerald-400 rounded-xl text-[11px] overflow-x-auto">
                            <pre>{typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}</pre>
                            {log.ipAddress && (
                              <p className="text-gray-400 mt-2 text-[10px]">Client IP: {log.ipAddress}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM TELEMETRY & HEALTH */}
        {activeTab === 'TELEMETRY' && stats && (
          <div className="space-y-6">
            {/* Top Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Database */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DDCF] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    {stats.db.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Database Size</h3>
                <p className="font-serif text-2xl font-bold text-[#3F2A1D] mt-1">{stats.db.sizeFormatted}</p>
                <p className="text-[10px] text-gray-500 mt-1">{stats.db.type}</p>
              </div>

              {/* Card 2: Storage */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DDCF] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{stats.storage.filesCount} Files</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uploads Disk Usage</h3>
                <p className="font-serif text-2xl font-bold text-[#3F2A1D] mt-1">{stats.storage.sizeFormatted}</p>
                <p className="text-[10px] text-gray-500 mt-1">Directory: {stats.storage.uploadsPath}</p>
              </div>

              {/* Card 3: Node Runtime */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DDCF] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-purple-50 text-purple-800 rounded-xl">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-600">{stats.runtime.nodeVersion}</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Node.js Engine</h3>
                <p className="font-serif text-2xl font-bold text-[#3F2A1D] mt-1">
                  {stats.runtime.platform} ({stats.runtime.arch})
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Uptime: {formatUptime(stats.runtime.uptimeSeconds)}
                </p>
              </div>

              {/* Card 4: Memory */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DDCF] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">Heap Used</span>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Memory Allocation</h3>
                <p className="font-serif text-2xl font-bold text-[#3F2A1D] mt-1">{stats.runtime.memory.heapUsedMb} MB</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  RSS: {stats.runtime.memory.rssMb} MB | Total: {stats.runtime.memory.heapTotalMb} MB
                </p>
              </div>
            </div>

            {/* Counts & Entity Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User distribution */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6DDCF] shadow-xs">
                <h3 className="text-sm font-bold text-[#3F2A1D] mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6B4A2E]" />
                  <span>Registered Platform Users ({stats.counts.users.total})</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Authors (Publishing Researchers)</span>
                    <strong className="text-[#3F2A1D]">{stats.counts.users.authors}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Peer Reviewers (Double-Blind Evaluators)</span>
                    <strong className="text-blue-800">{stats.counts.users.reviewers}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Managing Editors & Admins</span>
                    <strong className="text-emerald-800">{stats.counts.users.admins}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600">Super Administrators</span>
                    <strong className="text-purple-800">{stats.counts.users.superAdmins}</strong>
                  </div>
                </div>
              </div>

              {/* Submissions pipeline */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6DDCF] shadow-xs">
                <h3 className="text-sm font-bold text-[#3F2A1D] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6B4A2E]" />
                  <span>Publishing Lifecycle Breakdown ({stats.counts.submissions.total})</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Officially Published Research Papers</span>
                    <strong className="text-emerald-800">{stats.counts.submissions.published}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Active in Double-Blind Peer Review</span>
                    <strong className="text-blue-800">{stats.counts.submissions.underReview}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Revisions Required from Author</span>
                    <strong className="text-amber-800">{stats.counts.submissions.revisionsRequired}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600">Pending Reviewer Assignment</span>
                    <strong className="text-gray-700">{stats.counts.submissions.pendingAssignment}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER DIRECTORY & ROLE MANAGEMENT */}
        {activeTab === 'USERS' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6DDCF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search users by name, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl outline-hidden focus:ring-1 focus:ring-[#C8A45D]"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => { setUserRoleFilter(e.target.value); }}
                  className="px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl text-[#3F2A1D]"
                >
                  <option value="ALL">All Roles</option>
                  <option value="AUTHOR">AUTHOR</option>
                  <option value="REVIEWER">REVIEWER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>

                <button
                  onClick={fetchUsers}
                  className="px-3 py-1.5 bg-[#F6F1E8] hover:bg-[#E6DDCF] text-xs font-bold rounded-xl"
                >
                  Filter
                </button>
              </div>

              <span className="text-xs text-gray-500 font-medium">{users.length} Users Listed</span>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-[#E6DDCF] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FBF9F5] border-b border-[#E6DDCF] text-[#6B4A2E] font-bold">
                    <th className="p-3.5">Name & Email</th>
                    <th className="p-3.5">Current Role</th>
                    <th className="p-3.5">Institution</th>
                    <th className="p-3.5">Activity</th>
                    <th className="p-3.5">Role Elevation</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => {
                    const isSelf = session?.user?.id === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="p-3.5">
                          <p className="font-bold text-[#3F2A1D]">{u.name}</p>
                          <p className="text-[11px] text-gray-500">{u.email}</p>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                : u.role === 'ADMIN'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : u.role === 'REVIEWER'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="p-3.5 text-gray-600">
                          {u.institution || '—'}
                        </td>

                        <td className="p-3.5 text-gray-500 text-[11px]">
                          {u._count.submissions > 0 && `${u._count.submissions} submissions `}
                          {u._count.reviews > 0 && `${u._count.reviews} reviews`}
                          {u._count.submissions === 0 && u._count.reviews === 0 && 'None'}
                        </td>

                        <td className="p-3.5">
                          {isSelf ? (
                            <span className="text-[10px] text-purple-800 font-bold">Active Super Admin</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              className="px-2 py-1 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-lg text-[#3F2A1D]"
                            >
                              <option value="AUTHOR">AUTHOR</option>
                              <option value="REVIEWER">REVIEWER</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            </select>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          {!isSelf && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                              title="Delete User Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PUBLISHING PIPELINE OVERSIGHT */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E6DDCF] shadow-xs flex items-center justify-between">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter papers by title, author..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl outline-hidden focus:ring-1 focus:ring-[#C8A45D]"
                />
              </div>

              <span className="text-xs text-gray-500 font-medium">
                {submissions.length} Manuscripts Total
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6DDCF] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FBF9F5] border-b border-[#E6DDCF] text-[#6B4A2E] font-bold">
                    <th className="p-3.5">Manuscript Title</th>
                    <th className="p-3.5">Author</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Reviewer</th>
                    <th className="p-3.5">Published Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions
                    .filter((s) => !subSearch.trim() || s.title.toLowerCase().includes(subSearch.toLowerCase()))
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="p-3.5 max-w-xs">
                          <p className="font-bold text-[#3F2A1D] truncate">{s.title}</p>
                          <p className="text-[10px] text-gray-400">ID: {s.id.slice(0, 8)} | v{s.version}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-[#3F2A1D]">{s.author?.name}</p>
                          <p className="text-[10px] text-gray-400">{s.author?.email}</p>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              s.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.status === 'UNDER_REVIEW'
                                ? 'bg-blue-100 text-blue-800'
                                : s.status === 'REVISION_REQUESTED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-600">
                          {s.assignedReviewer?.name || 'Unassigned'}
                        </td>
                        <td className="p-3.5 text-gray-500 text-[11px]">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: KILLSWITCH & MAINTENANCE CONFIG */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-2xl bg-white p-6 md:p-8 rounded-2xl border border-[#E6DDCF] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3F2A1D] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#6B4A2E]" />
                <span>Global Killswitch & Maintenance Settings</span>
              </h2>
              <p className="text-xs text-[#6B4A2E] mt-1">
                Control the operational availability of the journal website.
              </p>
            </div>

            {/* Status box */}
            <div className={`p-4 rounded-xl border ${siteDisabled ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Website State</p>
                  <p className={`text-base font-bold ${siteDisabled ? 'text-red-800' : 'text-emerald-800'}`}>
                    {siteDisabled ? '🔴 Website is DISABLED (Maintenance Mode Active)' : '🟢 Website is ONLINE and Operational'}
                  </p>
                </div>
                <button
                  onClick={() => setIsKillswitchModalOpen(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 ${
                    siteDisabled ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {siteDisabled ? 'Restore Website Online' : 'Disable Website Now'}
                </button>
              </div>
            </div>

            {/* Custom Maintenance Message Form */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                  Public Maintenance Notice Message
                </label>
                <textarea
                  rows={3}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Explain why the journal is undergoing maintenance..."
                  className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl outline-hidden focus:ring-1 focus:ring-[#C8A45D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] uppercase tracking-wider mb-1">
                  Estimated Downtime / Uptime Notice
                </label>
                <input
                  type="text"
                  value={estimatedUptime}
                  onChange={(e) => setEstimatedUptime(e.target.value)}
                  placeholder="e.g. 2 hours, Shortly, 6:00 PM EST"
                  className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl outline-hidden focus:ring-1 focus:ring-[#C8A45D]"
                />
              </div>

              <button
                onClick={() => handleToggleKillswitch(siteDisabled)}
                disabled={togglingKillswitch}
                className="px-4 py-2.5 bg-[#6B4A2E] hover:bg-[#523720] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
              >
                {togglingKillswitch ? 'Saving Configuration...' : 'Update Maintenance Configuration'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* KILLSWITCH CONFIRMATION MODAL */}
      {isKillswitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${siteDisabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3F2A1D]">
                  {siteDisabled ? 'Restore Website Online' : 'Disable Journal Website?'}
                </h3>
                <p className="text-xs text-gray-500">
                  {siteDisabled
                    ? 'Re-enable public access to the journal for all visitors.'
                    : 'Activate emergency maintenance mode across the entire site.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {siteDisabled
                ? 'All public pages, manuscript submissions, and author/reviewer dashboards will resume normal service immediately.'
                : 'All non-super-admin users and visitors will be blocked with the Maintenance screen. Only Super Admin can access the system.'}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsKillswitchModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleKillswitch(!siteDisabled)}
                disabled={togglingKillswitch}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition shadow-xs ${
                  siteDisabled
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {togglingKillswitch
                  ? 'Executing...'
                  : siteDisabled
                  ? 'Confirm: Restore Website Online'
                  : 'Confirm: Disable Website'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
