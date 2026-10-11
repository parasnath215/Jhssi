'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Download,
  Award,
  Send,
  Shield,
  ExternalLink,
  LogOut,
  User,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  X
} from 'lucide-react';

interface Review {
  id: string;
  recommendation: string;
  commentsForAuthor: string;
  originalityScore?: number;
  methodologyScore?: number;
  clarityScore?: number;
  significanceScore?: number;
  versionReviewed: number;
  createdAt: string;
}

interface RevisionHistory {
  id: string;
  version: number;
  fileWithAuthor: string;
  fileWithoutAuthor: string;
  responseLetter?: string;
  submittedAt: string;
}

interface Submission {
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
  assignedReviewer?: {
    id: string;
    name: string;
    institution?: string;
  };
  reviews: Review[];
  revisionHistories: RevisionHistory[];
}

export default function AuthorDashboardClient() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'REVISIONS' | 'PUBLISHED' | 'ALL'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Submit Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newCategory, setNewCategory] = useState('Humanities & Social Sciences');
  const [identifiedFileUrl, setIdentifiedFileUrl] = useState('');
  const [identifiedFileName, setIdentifiedFileName] = useState('');
  const [anonymizedFileUrl, setAnonymizedFileUrl] = useState('');
  const [anonymizedFileName, setAnonymizedFileName] = useState('');
  const [uploadingIdentified, setUploadingIdentified] = useState(false);
  const [uploadingAnonymized, setUploadingAnonymized] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Revision Modal
  const [revisionPaper, setRevisionPaper] = useState<Submission | null>(null);
  const [revisedIdentifiedUrl, setRevisedIdentifiedUrl] = useState('');
  const [revisedIdentifiedName, setRevisedIdentifiedName] = useState('');
  const [revisedAnonymizedUrl, setRevisedAnonymizedUrl] = useState('');
  const [revisedAnonymizedName, setRevisedAnonymizedName] = useState('');
  const [responseLetter, setResponseLetter] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);
  const [revUploadingIdentified, setRevUploadingIdentified] = useState(false);
  const [revUploadingAnonymized, setRevUploadingAnonymized] = useState(false);
  const [revisionError, setRevisionError] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const identifiedInputRef = useRef<HTMLInputElement>(null);
  const anonymizedInputRef = useRef<HTMLInputElement>(null);
  const revIdentifiedInputRef = useRef<HTMLInputElement>(null);
  const revAnonymizedInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/submission/my');
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: 'identified' | 'anonymized',
    isRevision: boolean = false
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', type);

    if (isRevision) {
      if (type === 'identified') setRevUploadingIdentified(true);
      else setRevUploadingAnonymized(true);
    } else {
      if (type === 'identified') setUploadingIdentified(true);
      else setUploadingAnonymized(true);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (isRevision) {
        if (type === 'identified') {
          setRevisedIdentifiedUrl(data.url);
          setRevisedIdentifiedName(data.originalName || file.name);
        } else {
          setRevisedAnonymizedUrl(data.url);
          setRevisedAnonymizedName(data.originalName || file.name);
        }
      } else {
        if (type === 'identified') {
          setIdentifiedFileUrl(data.url);
          setIdentifiedFileName(data.originalName || file.name);
        } else {
          setAnonymizedFileUrl(data.url);
          setAnonymizedFileName(data.originalName || file.name);
        }
      }
    } catch (err: any) {
      alert(err.message || 'File upload error');
    } finally {
      if (isRevision) {
        if (type === 'identified') setRevUploadingIdentified(false);
        else setRevUploadingAnonymized(false);
      } else {
        if (type === 'identified') setUploadingIdentified(false);
        else setUploadingAnonymized(false);
      }
    }
  };

  const handleSubmitManuscript = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newTitle.trim()) {
      setFormError('Please enter manuscript title.');
      return;
    }
    if (!newAbstract.trim()) {
      setFormError('Please enter abstract.');
      return;
    }
    if (!identifiedFileUrl) {
      setFormError('Please upload Marked Manuscript.');
      return;
    }
    if (!anonymizedFileUrl) {
      setFormError('Please upload Unmarked Manuscript (with detailed name and address of author).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submission/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          abstract: newAbstract,
          keywords: newKeywords,
          category: newCategory,
          fileWithAuthor: identifiedFileUrl,
          fileWithoutAuthor: anonymizedFileUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setFormSuccess('Paper submitted successfully!');
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setNewTitle('');
        setNewAbstract('');
        setNewKeywords('');
        setIdentifiedFileUrl('');
        setIdentifiedFileName('');
        setAnonymizedFileUrl('');
        setAnonymizedFileName('');
        setFormSuccess('');
        fetchSubmissions();
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit manuscript');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionPaper) return;
    setRevisionError('');

    if (!revisedIdentifiedUrl || !revisedAnonymizedUrl) {
      setRevisionError('Please upload both the updated Identified and Anonymized files.');
      return;
    }

    setSubmittingRevision(true);
    try {
      const res = await fetch('/api/submission/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: revisionPaper.id,
          fileWithAuthor: revisedIdentifiedUrl,
          fileWithoutAuthor: revisedAnonymizedUrl,
          responseLetter,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Revision failed');

      alert('Revised manuscript submitted successfully to reviewer!');
      setRevisionPaper(null);
      setRevisedIdentifiedUrl('');
      setRevisedAnonymizedUrl('');
      setResponseLetter('');
      fetchSubmissions();
    } catch (err: any) {
      setRevisionError(err.message || 'Failed to submit revision');
    } finally {
      setSubmittingRevision(false);
    }
  };

  const handleCopyCitation = (paper: Submission) => {
    const year = paper.publishedAt ? new Date(paper.publishedAt).getFullYear() : '2026';
    const citation = `${session?.user?.name || 'Author'} (${year}). "${paper.title}." Journal of Humanities & Social Sciences Invention (JHSSI), Vol. ${paper.volume || '6'}, No. ${paper.issue || '1'}. DOI: ${paper.doi || '10.32456/jhssi'}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Submitted', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Eye };
      case 'REVISION_REQUESTED':
        return { label: 'Action Required: Revision Needed', color: 'bg-orange-100 text-orange-900 border-orange-300 font-bold', icon: AlertCircle };
      case 'RESUBMITTED':
        return { label: 'Resubmitted (In Review)', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: RefreshCw };
      case 'REVIEWER_APPROVED':
        return { label: 'Reviewer Approved (Pending Admin)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      case 'PUBLISHED':
        return { label: 'Published', color: 'bg-emerald-700 text-white border-emerald-800 font-bold', icon: Award };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  // Filter based on active tab
  const activeSubmissions = submissions.filter(s => s.status !== 'PUBLISHED' && s.status !== 'REJECTED');
  const revisionSubmissions = submissions.filter(s => s.status === 'REVISION_REQUESTED');
  const publishedSubmissions = submissions.filter(s => s.status === 'PUBLISHED');

  const displayedSubmissions = (() => {
    let list = submissions;
    if (activeTab === 'ACTIVE') list = activeSubmissions;
    else if (activeTab === 'REVISIONS') list = revisionSubmissions;
    else if (activeTab === 'PUBLISHED') list = publishedSubmissions;

    if (!searchQuery.trim()) return list;
    return list.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  })();

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#3F2A1D] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E6DDCF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F6F1E8] border border-[#E6DDCF] flex items-center justify-center font-serif font-bold text-[#6B4A2E]">
                J
              </div>
              <span className="font-serif font-bold text-[#3F2A1D] text-base">JHSSI Author Desk</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Manuscript</span>
            </button>

            <div className="h-4 w-px bg-[#E6DDCF]" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#3F2A1D] hidden sm:inline">
                {session?.user?.name || 'Author'}
              </span>
              <button
                onClick={async () => {
                  try {
                    await signOut({ redirect: false, callbackUrl: '/' });
                  } catch {}
                  window.location.href = '/';
                }}
                title="Sign Out"
                className="p-1.5 text-[#6B4A2E] hover:text-red-700 hover:bg-red-50 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Streamlined Header & Stat Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#3F2A1D]">
              Manuscripts Workspace
            </h1>
            <p className="text-xs text-[#6B4A2E] mt-0.5">
              Manage your submissions through double-blind review and publication.
            </p>
          </div>

          {/* Compact Stat Pills */}
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1 bg-white border border-[#E6DDCF] rounded-full text-[#6B4A2E]">
              Total: <strong className="text-[#3F2A1D]">{submissions.length}</strong>
            </div>
            {revisionSubmissions.length > 0 && (
              <div className="px-3 py-1 bg-orange-100 border border-orange-300 rounded-full text-orange-950 font-bold animate-pulse">
                Action Needed: {revisionSubmissions.length}
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
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ACTIVE'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Active Papers ({activeSubmissions.length})
            </button>

            {revisionSubmissions.length > 0 && (
              <button
                onClick={() => setActiveTab('REVISIONS')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'REVISIONS'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-orange-800 hover:text-orange-950'
                }`}
              >
                Revisions Required ({revisionSubmissions.length})
              </button>
            )}

            <button
              onClick={() => setActiveTab('PUBLISHED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'PUBLISHED'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Published ({publishedSubmissions.length})
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
              placeholder="Search papers..."
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
            Loading papers...
          </div>
        ) : displayedSubmissions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E6DDCF]">
            <FileText className="w-10 h-10 text-[#C8A45D] mx-auto mb-2.5 opacity-60" />
            <h3 className="font-serif font-bold text-base text-[#3F2A1D]">No manuscripts in this view</h3>
            <p className="text-xs text-[#6B4A2E] max-w-sm mx-auto mt-1 mb-4">
              Submit your research paper with both Identified and Blind copies to start double-blind peer review.
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 bg-[#6B4A2E] text-white rounded-full text-xs font-semibold hover:bg-[#523720] transition"
            >
              + Submit New Manuscript
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedSubmissions.map(paper => {
              const badge = getStatusBadge(paper.status);
              const isExpanded = expandedId === paper.id;
              const isRevision = paper.status === 'REVISION_REQUESTED';
              const isPublished = paper.status === 'PUBLISHED';

              return (
                <div
                  key={paper.id}
                  className={`bg-white border rounded-2xl transition shadow-2xs ${
                    isRevision ? 'border-orange-300 ring-1 ring-orange-200' : 'border-[#E6DDCF] hover:border-[#C8A45D]'
                  }`}
                >
                  {/* Card Main Row */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">v{paper.version}</span>
                        {paper.category && (
                          <span className="text-[11px] text-gray-400">• {paper.category}</span>
                        )}
                        <span className="text-[11px] text-gray-400">
                          • {new Date(paper.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#3F2A1D] leading-snug truncate">
                        {paper.title}
                      </h3>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isRevision && (
                        <button
                          onClick={() => setRevisionPaper(paper)}
                          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Submit Revision</span>
                        </button>
                      )}

                      {isPublished && (
                        <button
                          onClick={() => handleCopyCitation(paper)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-medium transition flex items-center gap-1"
                        >
                          {copiedId === paper.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === paper.id ? 'Copied' : 'Cite'}</span>
                        </button>
                      )}

                      <a
                        href={paper.fileWithAuthor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-lg transition"
                        title="Download Manuscript PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                        className="px-2.5 py-1.5 text-xs text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-xl flex items-center gap-1 font-medium transition"
                      >
                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#E6DDCF]/60 bg-[#FBF9F5]/40 rounded-b-2xl space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-[#3F2A1D] block mb-1">Abstract:</span>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{paper.abstract}</p>
                      </div>

                      {/* Reviewer Feedback if present */}
                      {paper.reviews && paper.reviews.length > 0 && (
                        <div className="p-3 bg-white border border-orange-200 rounded-xl">
                          <span className="font-bold text-orange-950 block mb-1">
                            Latest Reviewer Feedback (v{paper.reviews[0].versionReviewed}):
                          </span>
                          <p className="italic text-gray-800">{paper.reviews[0].commentsForAuthor}</p>
                        </div>
                      )}

                      {/* Publication metadata if published */}
                      {isPublished && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-emerald-950">
                          <div>
                            <strong>DOI:</strong> <span className="font-mono text-xs">{paper.doi}</span> • Vol. {paper.volume}, Issue {paper.issue}
                          </div>
                          <Link href="/current" className="text-emerald-800 font-bold hover:underline flex items-center gap-1">
                            <span>View in Current Issue</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}

                      {/* Download links */}
                      <div className="flex items-center gap-4 text-gray-500 pt-1">
                        <span>Files:</span>
                        <a href={paper.fileWithAuthor} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6B4A2E]">
                          Marked PDF
                        </a>
                        <a href={paper.fileWithoutAuthor} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6B4A2E]">
                          Unmarked PDF
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* SUBMIT MANUSCRIPT MODAL (CLEAN & MINIMAL) */}
      {/* ============================================================ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-[#3F2A1D]">Submit Research Paper</h3>
              <p className="text-xs text-[#6B4A2E] mt-0.5">
                Provide manuscript details and upload both Identified and Anonymized files.
              </p>
            </div>

            {formError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitManuscript} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Socio-Economic Dimensions of Cultural Memory"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                  >
                    <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                    <option value="Cultural Studies & Anthropology">Cultural Studies & Anthropology</option>
                    <option value="Sociology & Urban Ecology">Sociology & Urban Ecology</option>
                    <option value="Philosophy & Applied Ethics">Philosophy & Applied Ethics</option>
                    <option value="Economics & Public Policy">Economics & Public Policy</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g. Culture, Ethics, Memory"
                    value={newKeywords}
                    onChange={e => setNewKeywords(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Abstract *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Concise scholarly abstract (150-300 words)..."
                  value={newAbstract}
                  onChange={e => setNewAbstract(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                />
              </div>

              {/* Uploads */}
              <div className="p-3 bg-[#F6F1E8]/50 border border-[#E6DDCF] rounded-xl space-y-2.5">
                <span className="font-bold text-[#3F2A1D] block">Required Dual Files (PDF, DOCX)</span>

                {/* Marked file */}
                <div>
                  <input
                    type="file"
                    ref={identifiedInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'identified', false)}
                  />
                  {identifiedFileUrl ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
                      <span className="truncate">✓ Marked Manuscript: {identifiedFileName}</span>
                      <button type="button" onClick={() => identifiedInputRef.current?.click()} className="underline font-bold ml-2">
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={uploadingIdentified}
                      onClick={() => identifiedInputRef.current?.click()}
                      className="w-full py-2.5 px-3 border border-dashed border-[#6B4A2E]/60 bg-white rounded-xl text-center hover:bg-gray-50 transition font-medium text-[#3F2A1D]"
                    >
                      {uploadingIdentified ? 'Uploading...' : 'Upload Marked Manuscript'}
                    </button>
                  )}
                </div>

                {/* Unmarked file */}
                <div>
                  <input
                    type="file"
                    ref={anonymizedInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'anonymized', false)}
                  />
                  {anonymizedFileUrl ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
                      <span className="truncate">✓ Unmarked Manuscript: {anonymizedFileName}</span>
                      <button type="button" onClick={() => anonymizedInputRef.current?.click()} className="underline font-bold ml-2">
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={uploadingAnonymized}
                      onClick={() => anonymizedInputRef.current?.click()}
                      className="w-full py-2.5 px-3 border border-dashed border-[#6B4A2E]/60 bg-white rounded-xl text-center hover:bg-gray-50 transition font-medium text-[#3F2A1D]"
                    >
                      {uploadingAnonymized ? (
                        'Uploading...'
                      ) : (
                        <div>
                          <span>Upload Unmarked Manuscript</span>
                          <span className="block text-[11px] text-gray-500 font-normal mt-0.5">
                            With detailed name and address of author
                          </span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingIdentified || uploadingAnonymized}
                  className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-5 py-2 rounded-xl font-bold shadow-xs transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Manuscript'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REVISION MODAL */}
      {/* ============================================================ */}
      {revisionPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-orange-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setRevisionPaper(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-bold">
                Resubmission (v{revisionPaper.version + 1})
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1 truncate">
                {revisionPaper.title}
              </h3>
            </div>

            {revisionError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {revisionError}
              </div>
            )}

            <form onSubmit={handleSubmitRevision} className="space-y-3">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Author Response Letter</label>
                <textarea
                  rows={3}
                  placeholder="Explain how reviewer comments were addressed..."
                  value={responseLetter}
                  onChange={e => setResponseLetter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Uploads */}
              <div>
                <input
                  type="file"
                  ref={revIdentifiedInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'identified', true)}
                />
                <button
                  type="button"
                  onClick={() => revIdentifiedInputRef.current?.click()}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg bg-[#FBF9F5] text-left px-3 text-gray-700 truncate"
                >
                  {revisedIdentifiedUrl ? `✓ Marked: ${revisedIdentifiedName}` : '+ Upload Updated Marked Manuscript'}
                </button>
              </div>

              <div>
                <input
                  type="file"
                  ref={revAnonymizedInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'anonymized', true)}
                />
                <button
                  type="button"
                  onClick={() => revAnonymizedInputRef.current?.click()}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg bg-[#FBF9F5] text-left px-3 text-gray-700 truncate"
                >
                  {revisedAnonymizedUrl ? `✓ Unmarked: ${revisedAnonymizedName}` : '+ Upload Updated Unmarked Manuscript'}
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevisionPaper(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRevision || revUploadingIdentified || revUploadingAnonymized}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {submittingRevision ? 'Sending...' : 'Send to Reviewer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}