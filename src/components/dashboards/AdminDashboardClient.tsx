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
  Copy
} from 'lucide-react';

interface Reviewer {
  id: string;
  name: string;
  email: string;
  institution?: string;
  fieldOfStudy?: string;
}

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
  createdAt: string;
  updatedAt: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publishedAt?: string;
  author: {
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
  };
  reviews: Review[];
}

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'CONFIRMATION' | 'PUBLISHED' | 'ALL'>('PIPELINE');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Assign Reviewer Modal
  const [assigningPaper, setAssigningPaper] = useState<AdminSubmission | null>(null);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [assigning, setAssigning] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, revsRes] = await Promise.all([
        fetch('/api/submission/all'),
        fetch('/api/users/reviewers'),
      ]);
      const subsData = await subsRes.json();
      const revsData = await revsRes.json();

      if (subsData.submissions) setSubmissions(subsData.submissions);
      if (revsData.reviewers) setReviewers(revsData.reviewers);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningPaper || !selectedReviewerId) return;

    setAssigning(true);
    try {
      const res = await fetch('/api/submission/all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: assigningPaper.id,
          reviewerId: selectedReviewerId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Assignment failed');

      alert(data.message || 'Reviewer assigned successfully!');
      setAssigningPaper(null);
      setSelectedReviewerId('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error assigning reviewer');
    } finally {
      setAssigning(false);
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
    return list.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.doi && s.doi.toLowerCase().includes(searchQuery.toLowerCase()))
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
              href="/current"
              className="text-xs text-[#6B4A2E] hover:underline flex items-center gap-1 hidden sm:flex"
            >
              <span>Current Issue</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-px bg-[#E6DDCF]" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#3F2A1D] hidden sm:inline">
                {session?.user?.name || 'Editor-in-Chief'}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
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
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B4A2E]/60" />
            <input
              type="text"
              placeholder="Search title, author, DOI..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Papers List */}
        {loading ? (
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

                        <span className="text-[11px] text-gray-600 font-medium">
                          Author: <strong>{paper.author.name}</strong>
                        </span>

                        {isPublished && paper.publishedAt && (
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Date: {new Date(paper.publishedAt).toLocaleDateString()}
                          </span>
                        )}

                        {paper.assignedReviewer && !isPublished && (
                          <span className="text-[11px] text-blue-800 font-medium">
                            Reviewer: {paper.assignedReviewer.name}
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
                        <button
                          onClick={() => {
                            setAssigningPaper(paper);
                            setSelectedReviewerId(paper.assignedReviewer?.id || (reviewers[0]?.id || ''));
                          }}
                          className="px-3 py-1.5 bg-[#F6F1E8] hover:bg-[#E6DDCF] text-[#6B4A2E] border border-[#E6DDCF] rounded-xl text-xs font-medium transition flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{paper.assignedReviewer ? 'Reassign' : 'Assign'}</span>
                        </button>
                      )}

                      <a
                        href={paper.fileWithAuthor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-lg transition"
                        title="Download Full PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>

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
                      <div className="flex flex-wrap gap-4 text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                        <span><strong>Author Email:</strong> {paper.author.email}</span>
                        {paper.author.institution && <span><strong>Institution:</strong> {paper.author.institution}</span>}
                        {paper.category && <span><strong>Category:</strong> {paper.category}</span>}
                      </div>

                      {/* Reviewer feedback if available */}
                      {paper.reviews && paper.reviews.length > 0 && (
                        <div className="p-3 bg-white border border-emerald-200 rounded-xl">
                          <span className="font-bold text-emerald-950 block mb-1">
                            Reviewer Feedback ({paper.reviews[0].reviewer.name} &mdash; {paper.reviews[0].recommendation}):
                          </span>
                          <p className="text-gray-800 italic">"{paper.reviews[0].commentsForAuthor}"</p>
                          {paper.reviews[0].confidentialNotes && (
                            <p className="text-gray-500 text-[11px] mt-1">
                              <strong>Confidential Editor Note:</strong> {paper.reviews[0].confidentialNotes}
                            </p>
                          )}
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
      {/* MODAL 1: ASSIGN REVIEWER */}
      {/* ============================================================ */}
      {assigningPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setAssigningPaper(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F6F1E8] text-[#6B4A2E] font-bold">
                Assign Reviewer
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1 truncate">
                {assigningPaper.title}
              </h3>
            </div>

            <form onSubmit={handleAssignReviewer} className="space-y-3">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Select Peer Reviewer</label>
                <select
                  required
                  value={selectedReviewerId}
                  onChange={e => setSelectedReviewerId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                >
                  <option value="">-- Choose Reviewer --</option>
                  {reviewers.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.institution || 'Scholar'})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-gray-500">
                The reviewer will receive strictly the anonymized blind copy. Author details are hidden.
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
                  disabled={assigning || !selectedReviewerId}
                  className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
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
              <p className="text-gray-500 mt-0.5">Author: {confirmPaper.author.name}</p>
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