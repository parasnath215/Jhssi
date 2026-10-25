'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Shield,
  Star,
  RefreshCw,
  LogOut,
  User,
  Search,
  Check,
  X,
  UserCheck,
  Award,
  BookOpen,
  ExternalLink,
  Plus,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  Copy,
  Mail,
  Users,
  UserPlus,
  RotateCcw,
  MessageSquare,
  Key
} from 'lucide-react';
import AdminEmailSettingsTab from '@/components/dashboards/AdminEmailSettingsTab';
import AdminReviewersTab, { ReviewerData } from '@/components/dashboards/AdminReviewersTab';

interface Review {
  id: string;
  recommendation: string;
  commentsForAuthor: string;
  confidentialNotes?: string;
  originalityScore?: number;
  methodologyScore?: number;
  clarityScore?: number;
  significanceScore?: number;
  versionReviewed: number;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdminSubmission {
  id: string;
  title: string;
  abstract: string;
  keywords?: string;
  category?: string;
  fileWithAuthor: string;
  fileWithoutAuthor: string;
  status: string;
  version: number;
  manuscriptNo?: string;
  createdAt: string;
  updatedAt: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publishedAt?: string;
  editorialComments?: string | null;
  author?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
  };
  assignedReviewer?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
  } | null;
  assignedReviewer2?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
  } | null;
  reviews: Review[];
}

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [reviewers, setReviewers] = useState<ReviewerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'CONFIRMATION' | 'PUBLISHED' | 'ALL' | 'REVIEWERS' | 'EMAIL_SETUP'>('PIPELINE');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Assign Reviewer Modal (Dual Reviewers + Quick Add)
  const [assigningPaper, setAssigningPaper] = useState<AdminSubmission | null>(null);
  const [selectedReviewer1Id, setSelectedReviewer1Id] = useState('');
  const [selectedReviewer2Id, setSelectedReviewer2Id] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Quick Add Reviewer inside modal
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickSlot, setQuickSlot] = useState<1 | 2>(1);
  const [quickName, setQuickName] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickInstitution, setQuickInstitution] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState('');

  // Send Back to Author Modal
  const [sendBackPaper, setSendBackPaper] = useState<AdminSubmission | null>(null);
  const [sendBackComments, setSendBackComments] = useState('');
  const [sendingBack, setSendingBack] = useState(false);
  const [sendBackError, setSendBackError] = useState('');

  // Final Confirmation Publish Modal
  const [confirmPaper, setConfirmPaper] = useState<AdminSubmission | null>(null);
  const [confVolume, setConfVolume] = useState('6');
  const [confIssue, setConfIssue] = useState('1');
  const [confPages, setConfPages] = useState('1-24');
  const [confDoi, setConfDoi] = useState('');
  const [confirming, setConfirming] = useState(false);

  // Manual Publish Paper Modal (with selected date)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualAbstract, setManualAbstract] = useState('');
  const [manualAuthorName, setManualAuthorName] = useState('');
  const [manualAuthorEmail, setManualAuthorEmail] = useState('');
  const [manualAuthorInstitution, setManualAuthorInstitution] = useState('');
  const [manualCategory, setManualCategory] = useState('Humanities & Social Sciences');
  const [manualKeywords, setManualKeywords] = useState('');
  const [manualVolume, setManualVolume] = useState('6');
  const [manualIssue, setManualIssue] = useState('1');
  const [manualPages, setManualPages] = useState('1-20');
  const [manualDoi, setManualDoi] = useState('');
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualPdfUrl, setManualPdfUrl] = useState('');
  const [manualPdfName, setManualPdfName] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [publishingManual, setPublishingManual] = useState(false);
  const [manualError, setManualError] = useState('');

  const [copiedDoiId, setCopiedDoiId] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/' });
    } catch {
      // fallback
    }
    window.location.href = '/';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const [subsRes, revsRes] = await Promise.all([
        fetch('/api/submission/all'),
        fetch('/api/users/reviewers'),
      ]);
      const subsData = await subsRes.json();
      const revsData = await revsRes.json();

      if (!subsRes.ok) {
        throw new Error(subsData.error || 'Failed to fetch editorial manuscripts');
      }

      if (subsData.submissions) setSubmissions(subsData.submissions);
      if (revsData.reviewers) setReviewers(revsData.reviewers);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setFetchError(err.message || 'Error loading manuscripts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (paper: AdminSubmission) => {
    setAssigningPaper(paper);
    setSelectedReviewer1Id(paper.assignedReviewer?.id || '');
    setSelectedReviewer2Id(paper.assignedReviewer2?.id || '');
    setIsQuickAdding(false);
    setQuickError('');
  };

  const handleAssignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningPaper) return;

    setAssigning(true);
    try {
      const res = await fetch('/api/submission/all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: assigningPaper.id,
          reviewerId: selectedReviewer1Id || null,
          reviewer2Id: selectedReviewer2Id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Assignment failed');

      alert(data.message || 'Reviewers assigned successfully!');
      setAssigningPaper(null);
      setSelectedReviewer1Id('');
      setSelectedReviewer2Id('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error assigning reviewers');
    } finally {
      setAssigning(false);
    }
  };

  const handleQuickAddReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError('');
    if (!quickName.trim() || !quickEmail.trim() || !quickPassword) {
      setQuickError('Name, Email (ID), and Password are required.');
      return;
    }

    setQuickLoading(true);
    try {
      const res = await fetch('/api/users/reviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quickName.trim(),
          email: quickEmail.trim(),
          password: quickPassword,
          institution: quickInstitution.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create reviewer account');

      const created = data.reviewer;
      setReviewers(prev => [...prev, created]);
      if (quickSlot === 1) {
        setSelectedReviewer1Id(created.id);
      } else {
        setSelectedReviewer2Id(created.id);
      }

      setQuickName('');
      setQuickEmail('');
      setQuickPassword('');
      setQuickInstitution('');
      setIsQuickAdding(false);
      alert(`Reviewer "${created.name}" created and assigned to Slot ${quickSlot}!`);
    } catch (err: any) {
      setQuickError(err.message || 'Error creating reviewer');
    } finally {
      setQuickLoading(false);
    }
  };

  const handleOpenSendBackModal = (paper: AdminSubmission) => {
    setSendBackPaper(paper);
    setSendBackComments(paper.editorialComments || '');
    setSendBackError('');
  };

  const handleSendBackToAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendBackPaper || !sendBackComments.trim()) {
      setSendBackError('Please enter revision comments or instructions for the author.');
      return;
    }

    setSendingBack(true);
    setSendBackError('');
    try {
      const res = await fetch('/api/submission/send-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: sendBackPaper.id,
          comments: sendBackComments.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send back paper');

      alert(data.message || 'Paper sent back to author with revision instructions.');
      setSendBackPaper(null);
      setSendBackComments('');
      fetchData();
    } catch (err: any) {
      setSendBackError(err.message || 'Error sending back manuscript');
    } finally {
      setSendingBack(false);
    }
  };

  const handleOpenConfirmModal = (paper: AdminSubmission) => {
    setConfirmPaper(paper);
    setConfVolume(paper.volume || '6');
    setConfIssue(paper.issue || '1');
    setConfPages(paper.pages || '1-24');
    setConfDoi(paper.doi || `10.32456/jhssi.2026.6.1.${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleConfirmPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPaper) return;

    setConfirming(true);
    try {
      const res = await fetch('/api/submission/confirm-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: confirmPaper.id,
          volume: confVolume,
          issue: confIssue,
          pages: confPages,
          doi: confDoi,
          action: 'PUBLISH',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Confirmation failed');

      alert(data.message || 'Paper published officially to JHSSI Journal!');
      setConfirmPaper(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error publishing paper');
    } finally {
      setConfirming(false);
    }
  };

  const handleManualFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', 'published_paper');

    setUploadingPdf(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setManualPdfUrl(data.url);
      setManualPdfName(data.originalName || file.name);
    } catch (err: any) {
      alert(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleManualPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    if (!manualTitle.trim()) {
      setManualError('Please enter manuscript title.');
      return;
    }
    if (!manualAuthorName.trim()) {
      setManualError('Please enter primary author name.');
      return;
    }
    if (!manualPdfUrl) {
      setManualError('Please upload the research paper PDF.');
      return;
    }

    setPublishingManual(true);
    try {
      const res = await fetch('/api/submission/manual-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: manualTitle,
          abstract: manualAbstract,
          authorName: manualAuthorName,
          authorEmail: manualAuthorEmail,
          authorInstitution: manualAuthorInstitution,
          category: manualCategory,
          keywords: manualKeywords,
          volume: manualVolume,
          issue: manualIssue,
          pages: manualPages,
          doi: manualDoi,
          publishedAt: manualDate,
          fileUrl: manualPdfUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Manual publish failed');

      alert('Research paper published successfully on ' + manualDate + '!');
      setIsManualModalOpen(false);
      setManualTitle('');
      setManualAbstract('');
      setManualAuthorName('');
      setManualAuthorEmail('');
      setManualAuthorInstitution('');
      setManualKeywords('');
      setManualPdfUrl('');
      setManualPdfName('');
      setActiveTab('PUBLISHED');
      fetchData();
    } catch (err: any) {
      setManualError(err.message || 'Failed to publish paper');
    } finally {
      setPublishingManual(false);
    }
  };

  const handleDeletePaper = async (paperId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/submission/all?id=${paperId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      alert('Paper removed successfully');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting paper');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Unassigned', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', color: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'REVISION_REQUESTED':
        return { label: 'Revisions Requested', color: 'bg-orange-100 text-orange-900 border-orange-200' };
      case 'RESUBMITTED':
        return { label: 'Resubmitted (v2+)', color: 'bg-purple-100 text-purple-900 border-purple-200' };
      case 'REVIEWER_APPROVED':
        return { label: 'Approved (Awaiting Confirmation)', color: 'bg-emerald-600 text-white font-bold border-emerald-700 animate-pulse' };
      case 'PUBLISHED':
        return { label: 'Published', color: 'bg-emerald-800 text-white font-bold' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const pipelineSubmissions = submissions.filter(
    s => s.status === 'PENDING' || s.status === 'UNDER_REVIEW' || s.status === 'RESUBMITTED' || s.status === 'REVISION_REQUESTED'
  );
  const confirmationSubmissions = submissions.filter(s => s.status === 'REVIEWER_APPROVED');
  const publishedSubmissions = submissions.filter(s => s.status === 'PUBLISHED');

  const displayedList = (() => {
    let list = submissions;
    if (activeTab === 'PIPELINE') list = pipelineSubmissions;
    else if (activeTab === 'CONFIRMATION') list = confirmationSubmissions;
    else if (activeTab === 'PUBLISHED') list = publishedSubmissions;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.author?.name?.toLowerCase().includes(q) ||
      s.author?.email?.toLowerCase().includes(q) ||
      (s.doi && s.doi.toLowerCase().includes(q)) ||
      (s.manuscriptNo && s.manuscriptNo.toLowerCase().includes(q))
    );
  })();

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#3F2A1D] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E6DDCF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6B4A2E] text-white flex items-center justify-center font-bold text-sm">
                E
              </div>
              <span className="font-serif font-bold text-[#3F2A1D] text-base">JHSSI Editorial Directorate</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setManualDate(new Date().toISOString().split('T')[0]);
                setIsManualModalOpen(true);
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manually Publish Paper</span>
            </button>

            <Link
              href="/admin/archives"
              className="text-xs text-[#6B4A2E] hover:underline flex items-center gap-1 hidden sm:flex font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manage Archives</span>
            </Link>

            <Link
              href="/current"
              className="text-xs text-[#6B4A2E] hover:underline flex items-center gap-1 hidden sm:flex"
            >
              <span>Current Issue</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-px bg-[#E6DDCF]" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#3F2A1D] hidden sm:inline">
                {session?.user?.name || 'Prof. Ripu Sudan Singh (Editor-in-Chief)'}
              </span>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-[#6B4A2E] hover:text-red-700 hover:bg-red-50 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Streamlined Header & Summary Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#3F2A1D]">
              Editorial Control Center
            </h1>
            <p className="text-xs text-[#6B4A2E] mt-0.5">
              Review pipeline, assign peer reviewers, confirm approvals, and manage published papers.
            </p>
          </div>

          {/* Compact Stat Pills */}
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1 bg-white border border-[#E6DDCF] rounded-full text-[#6B4A2E]">
              Total: <strong className="text-[#3F2A1D]">{submissions.length}</strong>
            </div>
            {confirmationSubmissions.length > 0 && (
              <div className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-950 font-bold animate-pulse">
                Ready to Publish: {confirmationSubmissions.length}
              </div>
            )}
            <div className="px-3 py-1 bg-white border border-[#E6DDCF] rounded-full text-[#6B4A2E]">
              Published: <strong className="text-emerald-800">{publishedSubmissions.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Segmented Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-[#F6F1E8] p-1 rounded-xl border border-[#E6DDCF] w-fit">
            <button
              onClick={() => setActiveTab('PIPELINE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'PIPELINE'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Review Pipeline ({pipelineSubmissions.length})
            </button>

            <button
              onClick={() => setActiveTab('CONFIRMATION')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'CONFIRMATION'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : confirmationSubmissions.length > 0
                  ? 'text-emerald-800 font-bold'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Awaiting Confirmation ({confirmationSubmissions.length})
            </button>

            <button
              onClick={() => setActiveTab('PUBLISHED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'PUBLISHED'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Published Papers ({publishedSubmissions.length})
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ALL'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              All ({submissions.length})
            </button>

            <button
              onClick={() => setActiveTab('REVIEWERS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'REVIEWERS'
                  ? 'bg-[#6B4A2E] text-white shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Reviewers ({reviewers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('EMAIL_SETUP')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'EMAIL_SETUP'
                  ? 'bg-[#6B4A2E] text-white shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Manuscript Setup</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== 'EMAIL_SETUP' && activeTab !== 'REVIEWERS' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B4A2E]/60" />
              <input
                type="text"
                placeholder="Search title, author, manuscript no, DOI..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchData}
              className="px-3 py-1 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Papers List, Reviewers Tab, or Email Setup */}
        {activeTab === 'EMAIL_SETUP' ? (
          <AdminEmailSettingsTab />
        ) : activeTab === 'REVIEWERS' ? (
          <AdminReviewersTab reviewers={reviewers} onRefresh={fetchData} />
        ) : loading ? (
          <div className="p-12 text-center text-xs text-[#6B4A2E] bg-white rounded-2xl border border-[#E6DDCF]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8A45D]" />
            Loading editorial database...
          </div>
        ) : displayedList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E6DDCF]">
            <BookOpen className="w-10 h-10 text-[#C8A45D] mx-auto mb-2.5 opacity-60" />
            <h3 className="font-serif font-bold text-base text-[#3F2A1D]">No papers in this section</h3>
            <p className="text-xs text-[#6B4A2E] max-w-sm mx-auto mt-1 mb-4">
              {activeTab === 'CONFIRMATION'
                ? 'No manuscripts currently awaiting final confirmation. When peer reviewers approve papers, they will appear here.'
                : activeTab === 'PUBLISHED'
                ? 'No research papers published yet. You can manually publish a paper or wait for peer review approvals.'
                : 'No manuscripts found matching this view.'}
            </p>
            {activeTab === 'PUBLISHED' && (
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-full text-xs font-semibold hover:bg-emerald-800 transition"
              >
                + Manually Publish Paper on Selected Date
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedList.map(paper => {
              const badge = getStatusBadge(paper.status);
              const isExpanded = expandedId === paper.id;
              const isAwaitingConfirm = paper.status === 'REVIEWER_APPROVED';
              const isPublished = paper.status === 'PUBLISHED';

              return (
                <div
                  key={paper.id}
                  className={`bg-white border rounded-2xl transition shadow-2xs ${
                    isAwaitingConfirm
                      ? 'border-emerald-400 ring-2 ring-emerald-100'
                      : 'border-[#E6DDCF] hover:border-[#C8A45D]'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${badge.color}`}>
                          {badge.label}
                        </span>

                        {paper.manuscriptNo && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F6F1E8] text-[#6B4A2E] border border-[#C8A45D]/40">
                            <FileText className="w-3 h-3 text-[#C8A45D]" />
                            {paper.manuscriptNo}
                          </span>
                        )}

                        <span className="text-[11px] text-gray-600 font-medium">
                          Author: <strong>{paper.author?.name || 'Unknown Author'}</strong>
                        </span>

                        {isPublished && paper.publishedAt && (
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Date: {new Date(paper.publishedAt).toLocaleDateString()}
                          </span>
                        )}

                        {!isPublished && (paper.assignedReviewer || paper.assignedReviewer2) && (
                          <span className="text-[11px] text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            {paper.assignedReviewer ? `R1: ${paper.assignedReviewer.name}` : ''}
                            {paper.assignedReviewer && paper.assignedReviewer2 ? ' • ' : ''}
                            {paper.assignedReviewer2 ? `R2: ${paper.assignedReviewer2.name}` : ''}
                          </span>
                        )}

                        {paper.editorialComments && (
                          <span className="text-[10px] text-amber-950 font-bold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                            Revisions Requested
                          </span>
                        )}

                        <span className="text-[11px] text-gray-400">
                          • v{paper.version}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#3F2A1D] leading-snug truncate">
                        {paper.title}
                      </h3>

                      {isPublished && paper.doi && (
                        <p className="text-[11px] text-emerald-900 font-mono mt-0.5">
                          DOI: {paper.doi} • Vol. {paper.volume}, Issue {paper.issue}
                        </p>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isAwaitingConfirm && (
                        <button
                          onClick={() => handleOpenConfirmModal(paper)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Confirm & Publish</span>
                        </button>
                      )}

                      {!isPublished && (
                        <>
                          <button
                            onClick={() => handleOpenAssignModal(paper)}
                            className="px-3 py-1.5 bg-[#F6F1E8] hover:bg-[#E6DDCF] text-[#6B4A2E] border border-[#E6DDCF] rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                            title="Assign up to 2 Peer Reviewers"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{paper.assignedReviewer || paper.assignedReviewer2 ? 'Reviewers' : 'Assign'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenSendBackModal(paper)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                            title="Send back paper to author with revision instructions"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                            <span>Send Back</span>
                          </button>
                        </>
                      )}

                      {(paper.fileWithAuthor || paper.id) && (
                        <a
                          href={`/api/submission/download?id=${paper.id}&type=identified`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-lg transition"
                          title="Download Full PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => handleDeletePaper(paper.id, paper.title)}
                        className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Remove Paper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                        className="px-2.5 py-1.5 text-xs text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-xl flex items-center gap-1 font-medium transition"
                      >
                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#E6DDCF]/60 bg-[#FBF9F5]/40 rounded-b-2xl space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-[#3F2A1D] block mb-1">Abstract:</span>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{paper.abstract}</p>
                      </div>

                      {/* Author Details */}
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                        {paper.manuscriptNo && (
                          <span><strong>Manuscript No:</strong> <span className="font-mono text-[#6B4A2E] font-bold">{paper.manuscriptNo}</span></span>
                        )}
                        <span><strong>Author Email:</strong> {paper.author?.email || 'N/A'}</span>
                        {paper.author?.institution && <span><strong>Institution:</strong> {paper.author.institution}</span>}
                        {paper.category && <span><strong>Category:</strong> {paper.category}</span>}
                      </div>

                      {/* Assigned Reviewers (Up to 2) */}
                      <div className="bg-white p-3 rounded-xl border border-[#E6DDCF] space-y-2">
                        <span className="font-bold text-[#3F2A1D] block">Assigned Peer Reviewers (Up to 2):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs">
                            <span className="font-bold text-blue-950 block mb-0.5">Reviewer 1 (Primary):</span>
                            {paper.assignedReviewer ? (
                              <div>
                                <span className="font-semibold text-[#3F2A1D]">{paper.assignedReviewer.name}</span>
                                <span className="text-gray-500 block text-[11px]">{paper.assignedReviewer.email}</span>
                                {paper.assignedReviewer.institution && (
                                  <span className="text-gray-500 block text-[11px]">{paper.assignedReviewer.institution}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                            )}
                          </div>
                          <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs">
                            <span className="font-bold text-blue-950 block mb-0.5">Reviewer 2 (Secondary):</span>
                            {paper.assignedReviewer2 ? (
                              <div>
                                <span className="font-semibold text-[#3F2A1D]">{paper.assignedReviewer2.name}</span>
                                <span className="text-gray-500 block text-[11px]">{paper.assignedReviewer2.email}</span>
                                {paper.assignedReviewer2.institution && (
                                  <span className="text-gray-500 block text-[11px]">{paper.assignedReviewer2.institution}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Editorial Send-Back Instructions */}
                      {paper.editorialComments && (
                        <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                            <span>Editorial Board Send-Back Notes / Revision Instructions:</span>
                          </div>
                          <p className="text-amber-900 leading-relaxed whitespace-pre-wrap">{paper.editorialComments}</p>
                        </div>
                      )}

                      {/* Manuscript Files */}
                      <div className="bg-white p-3 rounded-xl border border-[#E6DDCF] space-y-2">
                        <span className="font-bold text-[#3F2A1D] block">Submitted Manuscripts:</span>
                        <div className="flex flex-wrap items-center gap-3">
                          {paper.fileWithAuthor || paper.id ? (
                            <a
                              href={`/api/submission/download?id=${paper.id}&type=identified`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F1E8] hover:bg-[#E6DDCF] text-[#6B4A2E] border border-[#C8A45D]/40 rounded-xl font-medium transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#C8A45D]" />
                              <span>Marked Manuscript (with Author)</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No marked manuscript</span>
                          )}

                          {paper.fileWithoutAuthor || paper.id ? (
                            <a
                              href={`/api/submission/download?id=${paper.id}&type=anonymized`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl font-medium transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-gray-500" />
                              <span>Blind Manuscript (Anonymized)</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No blind manuscript</span>
                          )}
                        </div>
                      </div>

                      {/* Reviewer feedback if available */}
                      {paper.reviews && paper.reviews.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-bold text-[#3F2A1D] block">Peer Reviewer Evaluations:</span>
                          {paper.reviews.map((rev, idx) => (
                            <div key={rev.id || idx} className="p-3 bg-white border border-emerald-200 rounded-xl space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="font-bold text-emerald-950">
                                  Evaluation by {rev.reviewer?.name || 'Reviewer'} &mdash; {rev.recommendation}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  v{rev.versionReviewed} • {new Date(rev.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {rev.commentsForAuthor && (
                                <p className="text-gray-800 italic text-xs leading-relaxed">
                                  "{rev.commentsForAuthor}"
                                </p>
                              )}
                              {rev.confidentialNotes && (
                                <p className="text-amber-950 bg-amber-50/80 p-2 rounded-lg text-[11px] mt-1 border border-amber-200">
                                  <strong>Confidential Note for Editor:</strong> {rev.confidentialNotes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: ASSIGN UP TO 2 REVIEWERS (WITH INLINE QUICK ADD) */}
      {/* ============================================================ */}
      {assigningPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAssigningPaper(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F6F1E8] text-[#6B4A2E] font-bold">
                Assign Reviewers (Up to 2)
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1">
                {assigningPaper.title}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Author: {assigningPaper.author?.name || 'Author'} • Manuscript: {assigningPaper.manuscriptNo || 'N/A'}
              </p>
            </div>

            <form onSubmit={handleAssignReviewer} className="space-y-4">
              {/* Reviewer 1 (Primary) */}
              <div className="p-3 bg-[#FAF7F2] border border-[#E6DDCF] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#3F2A1D] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#6B4A2E]" />
                    <span>Reviewer 1 (Primary Reviewer)</span>
                  </label>
                  {selectedReviewer1Id && (
                    <button
                      type="button"
                      onClick={() => setSelectedReviewer1Id('')}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Clear / Unassign
                    </button>
                  )}
                </div>
                <select
                  value={selectedReviewer1Id}
                  onChange={e => setSelectedReviewer1Id(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                >
                  <option value="">-- No Reviewer Assigned --</option>
                  {reviewers.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.institution || r.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reviewer 2 (Secondary) */}
              <div className="p-3 bg-[#FAF7F2] border border-[#E6DDCF] rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#3F2A1D] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Reviewer 2 (Secondary Reviewer - Optional)</span>
                  </label>
                  {selectedReviewer2Id && (
                    <button
                      type="button"
                      onClick={() => setSelectedReviewer2Id('')}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Clear / Unassign
                    </button>
                  )}
                </div>
                <select
                  value={selectedReviewer2Id}
                  onChange={e => setSelectedReviewer2Id(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                >
                  <option value="">-- No Reviewer Assigned --</option>
                  {reviewers.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.institution || r.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Quick Add Inline Form */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-gray-500">
                  Need a reviewer not listed above?
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuickAdding(!isQuickAdding)}
                  className="text-xs font-bold text-[#6B4A2E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isQuickAdding ? 'Hide Quick Add' : '+ Add New Reviewer Here'}</span>
                </button>
              </div>

              {/* Quick Add Form */}
              {isQuickAdding && (
                <div className="p-3.5 bg-white border-2 border-dashed border-[#C8A45D] rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3F2A1D] flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>Create New Reviewer Account with ID & Password</span>
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span>Assign to:</span>
                      <label className="flex items-center gap-1 font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="slot"
                          checked={quickSlot === 1}
                          onChange={() => setQuickSlot(1)}
                        />
                        <span>R1</span>
                      </label>
                      <label className="flex items-center gap-1 font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="slot"
                          checked={quickSlot === 2}
                          onChange={() => setQuickSlot(2)}
                        />
                        <span>R2</span>
                      </label>
                    </div>
                  </div>

                  {quickError && (
                    <div className="p-2 bg-red-50 text-red-700 rounded-lg text-[11px] border border-red-200">
                      {quickError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name (e.g. Dr. Jane)"
                      value={quickName}
                      onChange={e => setQuickName(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E6DDCF] rounded-lg text-xs"
                    />
                    <input
                      type="email"
                      placeholder="Email / Login ID"
                      value={quickEmail}
                      onChange={e => setQuickEmail(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E6DDCF] rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Password (min 6 chars)"
                      value={quickPassword}
                      onChange={e => setQuickPassword(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E6DDCF] rounded-lg text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Institution (optional)"
                      value={quickInstitution}
                      onChange={e => setQuickInstitution(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E6DDCF] rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={quickLoading}
                    onClick={handleQuickAddReviewer}
                    className="w-full py-1.5 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    {quickLoading ? 'Creating Reviewer...' : `Create & Select as Reviewer ${quickSlot}`}
                  </button>
                </div>
              )}

              <p className="text-[11px] text-gray-500 italic">
                Note: Reviewers will only receive the blind manuscript stamped with the JHSSI confidential watermark.
              </p>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAssigningPaper(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {assigning ? 'Saving Assignments...' : 'Save Reviewer Assignments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: SEND BACK TO AUTHOR WITH REVISION COMMENTS */}
      {/* ============================================================ */}
      {sendBackPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border-2 border-amber-400 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setSendBackPaper(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold">
                Editorial Send-Back / Revisions
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1">
                Send Back Manuscript to Author
              </h3>
              <p className="text-gray-600 mt-0.5 truncate">
                Paper: <strong>{sendBackPaper.title}</strong>
              </p>
              <p className="text-[11px] text-gray-500">
                Author: {sendBackPaper.author?.name || 'Author'} ({sendBackPaper.author?.email || 'N/A'})
              </p>
            </div>

            {sendBackError && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {sendBackError}
              </div>
            )}

            <form onSubmit={handleSendBackToAuthor} className="space-y-3">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">
                  Revision Instructions & Editorial Feedback for Author *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail the necessary changes, formatting fixes, or peer-review adjustments required from the author..."
                  value={sendBackComments}
                  onChange={e => setSendBackComments(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1">
                <p className="font-bold">What happens next?</p>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-900">
                  <li>The paper status will change to <strong>Revision Requested</strong>.</li>
                  <li>An automated notification email with your instructions will be sent to the author.</li>
                  <li>The author will be prompted to submit a revised manuscript and response letter in their dashboard.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSendBackPaper(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingBack}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{sendingBack ? 'Sending Back...' : 'Send Back with Instructions'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: FINAL CONFIRMATION & PUBLISH */}
      {/* ============================================================ */}
      {confirmPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border-2 border-emerald-400 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setConfirmPaper(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                Final Editorial Confirmation
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1 truncate">
                {confirmPaper.title}
              </h3>
              <p className="text-gray-500 mt-0.5">Author: {confirmPaper.author?.name || 'Author'}</p>
            </div>

            <form onSubmit={handleConfirmPublication} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Volume</label>
                  <input
                    type="text"
                    required
                    value={confVolume}
                    onChange={e => setConfVolume(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Issue</label>
                  <input
                    type="text"
                    required
                    value={confIssue}
                    onChange={e => setConfIssue(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Pages</label>
                <input
                  type="text"
                  value={confPages}
                  onChange={e => setConfPages(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">DOI Identifier</label>
                <input
                  type="text"
                  required
                  value={confDoi}
                  onChange={e => setConfDoi(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl font-mono text-[11px] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setConfirmPaper(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={confirming}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {confirming ? 'Publishing...' : 'Grant Confirmation & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: MANUALLY PUBLISH PAPER ON SELECTED DATE */}
      {/* ============================================================ */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                Admin Publishing Tool
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3F2A1D] mt-1">
                Manually Publish Research Paper
              </h3>
              <p className="text-xs text-[#6B4A2E] mt-0.5">
                Upload and publish papers directly with a custom publication date.
              </p>
            </div>

            {manualError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {manualError}
              </div>
            )}

            <form onSubmit={handleManualPublish} className="space-y-3">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cultural Hermeneutics in Digital Media"
                  value={manualTitle}
                  onChange={e => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. David Miller"
                    value={manualAuthorName}
                    onChange={e => setManualAuthorName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Author Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. Cambridge University"
                    value={manualAuthorInstitution}
                    onChange={e => setManualAuthorInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Date & DOI */}
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#F6F1E8]/40 border border-[#E6DDCF] rounded-xl">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#6B4A2E]" />
                    <span>Publication Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E6DDCF] rounded-lg focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Custom DOI (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty to auto-generate"
                    value={manualDoi}
                    onChange={e => setManualDoi(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E6DDCF] rounded-lg font-mono text-[11px] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Issue & Volume */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Volume</label>
                  <input
                    type="text"
                    value={manualVolume}
                    onChange={e => setManualVolume(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Issue</label>
                  <input
                    type="text"
                    value={manualIssue}
                    onChange={e => setManualIssue(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Pages</label>
                  <input
                    type="text"
                    value={manualPages}
                    onChange={e => setManualPages(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Abstract</label>
                <textarea
                  rows={2}
                  placeholder="Paper abstract summary..."
                  value={manualAbstract}
                  onChange={e => setManualAbstract(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Manuscript PDF File *</label>
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => e.target.files && handleManualFileUpload(e.target.files[0])}
                />
                {manualPdfUrl ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
                    <span className="truncate font-medium">✓ File: {manualPdfName}</span>
                    <button type="button" onClick={() => pdfInputRef.current?.click()} className="underline font-bold ml-2">
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingPdf}
                    onClick={() => pdfInputRef.current?.click()}
                    className="w-full py-2.5 border border-dashed border-emerald-600 bg-emerald-50/50 rounded-xl text-center text-emerald-900 font-semibold hover:bg-emerald-100 transition"
                  >
                    {uploadingPdf ? 'Uploading PDF...' : '+ Select Research Paper PDF to Upload'}
                  </button>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishingManual || uploadingPdf}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {publishingManual ? 'Publishing...' : 'Publish Paper on Selected Date'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}