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
  X,
  FileCheck2,
  RotateCcw,
  FileQuestion,
  FileX,
  Sparkles,
  Inbox
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
  manuscriptNo?: string;
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

export type QueueKey = 
  | 'ALL'
  | 'NEW_SENT_BACK'
  | 'NEW_INCOMPLETE'
  | 'NEW_WAITING_APPROVAL'
  | 'NEW_PROCESSING'
  | 'REV_NEEDING_REVISION'
  | 'REV_SENT_BACK'
  | 'REV_INCOMPLETE'
  | 'REV_WAITING_APPROVAL'
  | 'REV_PROCESSING'
  | 'REV_DECLINED';

export default function AuthorDashboardClient() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQueue, setActiveQueue] = useState<QueueKey>('ALL');
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
      setFormError('Please upload Identified Manuscript (with author details).');
      return;
    }
    if (!anonymizedFileUrl) {
      setFormError('Please upload Anonymized Blind Manuscript (without names).');
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

      setFormSuccess(`Paper submitted successfully! Assigned Manuscript No: ${data.manuscriptNo || 'JHSSI-Generated'}`);
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
      }, 2500);
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
      setRevisionError('Please upload both revised identified and blind copies.');
      return;
    }

    setSubmittingRevision(true);
    try {
      const res = await fetch('/api/submission/resubmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: revisionPaper.id,
          fileWithAuthor: revisedIdentifiedUrl,
          fileWithoutAuthor: revisedAnonymizedUrl,
          responseLetter: responseLetter,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Revision submission failed');

      setRevisionPaper(null);
      setRevisedIdentifiedUrl('');
      setRevisedIdentifiedName('');
      setRevisedAnonymizedUrl('');
      setRevisedAnonymizedName('');
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
        return { label: 'Submitted (Processing)', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Eye };
      case 'REVISION_REQUESTED':
        return { label: 'Action Required: Revision Needed', color: 'bg-orange-100 text-orange-900 border-orange-300 font-bold', icon: AlertCircle };
      case 'RESUBMITTED':
        return { label: 'Revision Being Processed', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: RefreshCw };
      case 'REVIEWER_APPROVED':
        return { label: 'Reviewer Approved (Pending Admin)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      case 'PUBLISHED':
        return { label: 'Published', color: 'bg-emerald-700 text-white border-emerald-800 font-bold', icon: Award };
      case 'REJECTED':
        return { label: 'Declined', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: FileX };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  // Queues definition based on feedback image
  // 1. New Submission categories
  const newSubSentBack = submissions.filter(s => s.status === 'SENT_BACK');
  const newSubIncomplete = submissions.filter(s => s.status === 'INCOMPLETE');
  const newSubWaitingApproval = submissions.filter(s => s.status === 'WAITING_AUTHOR_APPROVAL');
  const newSubProcessing = submissions.filter(
    s => s.version === 1 && (s.status === 'PENDING' || s.status === 'UNDER_REVIEW' || s.status === 'REVIEWER_APPROVED')
  );

  // 2. Revisions categories
  const revNeedingRevision = submissions.filter(s => s.status === 'REVISION_REQUESTED');
  const revSentBack = submissions.filter(s => s.status === 'REVISION_SENT_BACK');
  const revIncomplete = submissions.filter(s => s.status === 'REVISION_INCOMPLETE');
  const revWaitingApproval = submissions.filter(s => s.status === 'REVISION_WAITING_AUTHOR_APPROVAL');
  const revProcessing = submissions.filter(
    s => s.version > 1 && (s.status === 'RESUBMITTED' || s.status === 'UNDER_REVIEW' || s.status === 'PENDING' || s.status === 'REVIEWER_APPROVED')
  );
  const revDeclined = submissions.filter(s => s.status === 'REJECTED');

  // Active filter logic
  const getQueueSubmissions = (queue: QueueKey): Submission[] => {
    switch (queue) {
      case 'NEW_SENT_BACK':
        return newSubSentBack;
      case 'NEW_INCOMPLETE':
        return newSubIncomplete;
      case 'NEW_WAITING_APPROVAL':
        return newSubWaitingApproval;
      case 'NEW_PROCESSING':
        return newSubProcessing;
      case 'REV_NEEDING_REVISION':
        return revNeedingRevision;
      case 'REV_SENT_BACK':
        return revSentBack;
      case 'REV_INCOMPLETE':
        return revIncomplete;
      case 'REV_WAITING_APPROVAL':
        return revWaitingApproval;
      case 'REV_PROCESSING':
        return revProcessing;
      case 'REV_DECLINED':
        return revDeclined;
      case 'ALL':
      default:
        return submissions;
    }
  };

  const getQueueLabel = (queue: QueueKey): string => {
    switch (queue) {
      case 'NEW_SENT_BACK':
        return 'Submission Sent Back to Author';
      case 'NEW_INCOMPLETE':
        return 'Incomplete Submission';
      case 'NEW_WAITING_APPROVAL':
        return 'Submission Waiting for Author-Approval';
      case 'NEW_PROCESSING':
        return 'Submission Being Processed';
      case 'REV_NEEDING_REVISION':
        return 'Submissions Needing Revision';
      case 'REV_SENT_BACK':
        return 'Revisions Sent Back to Author';
      case 'REV_INCOMPLETE':
        return 'Incomplete Submission Being Revised';
      case 'REV_WAITING_APPROVAL':
        return 'Revisions Waiting for Author\'s Approval';
      case 'REV_PROCESSING':
        return 'Revision Being Processed';
      case 'REV_DECLINED':
        return 'Declined Revision';
      case 'ALL':
      default:
        return 'All Submissions';
    }
  };

  const displayedSubmissions = (() => {
    const list = getQueueSubmissions(activeQueue);
    if (!searchQuery.trim()) return list;
    return list.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.manuscriptNo && s.manuscriptNo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  })();

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#3F2A1D] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E6DDCF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#6B4A2E] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
                J
              </div>
              <div>
                <span className="font-serif font-bold text-[#3F2A1D] text-base block leading-tight">JHSSI Author Desk</span>
                <span className="text-[10px] text-[#7A6F63] block font-mono">Editorial Management System</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Manuscript</span>
            </button>

            <div className="h-5 w-px bg-[#E6DDCF]" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#3F2A1D] hidden sm:inline">
                {session?.user?.name || 'Author'}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign Out"
                className="p-1.5 text-[#6B4A2E] hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: EDITORIAL MANAGER WORKFLOW QUEUES */}
          {/* ============================================================ */}
          <aside className="lg:col-span-4 space-y-5">
            
            {/* Action Card: Submit New Manuscript */}
            <div className="bg-gradient-to-br from-[#6B4A2E] to-[#4A321E] text-white rounded-2xl p-5 shadow-sm border border-[#523720]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D]">Author Actions</span>
                <Sparkles className="w-4 h-4 text-[#C8A45D]" />
              </div>
              <h2 className="font-serif text-lg font-bold mb-1.5">New Submission</h2>
              <p className="text-xs text-[#EFE6D8]/80 mb-4 leading-relaxed">
                Submit an original manuscript with dual identified and anonymized files for double-blind peer review.
              </p>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-2.5 px-4 bg-[#C8A45D] hover:bg-[#b5924d] text-[#3F2A1D] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Submit New Manuscript</span>
              </button>
            </div>

            {/* Section 1: New Submission Queues */}
            <div className="bg-white border border-[#E6DDCF] rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2.5 mb-2">
                <h3 className="font-serif font-bold text-sm text-[#3F2A1D] uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#6B4A2E]" />
                  <span>New Submission</span>
                </h3>
              </div>

              <div className="space-y-1">
                {/* 1. Submit New Manuscript Link */}
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#6B4A2E] hover:bg-[#F6F1E8] transition text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B4A2E]" />
                    Submit New Manuscript
                  </span>
                  <Plus className="w-3.5 h-3.5 text-[#6B4A2E]" />
                </button>

                {/* 2. Submission Sent Back to Author */}
                <button
                  onClick={() => setActiveQueue('NEW_SENT_BACK')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'NEW_SENT_BACK'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Submission Sent Back to Author</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'NEW_SENT_BACK' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {newSubSentBack.length}
                  </span>
                </button>

                {/* 3. Incomplete Submission */}
                <button
                  onClick={() => setActiveQueue('NEW_INCOMPLETE')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'NEW_INCOMPLETE'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Incomplete Submission</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'NEW_INCOMPLETE' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {newSubIncomplete.length}
                  </span>
                </button>

                {/* 4. Submission Waiting for Author-Approval */}
                <button
                  onClick={() => setActiveQueue('NEW_WAITING_APPROVAL')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'NEW_WAITING_APPROVAL'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Submission Waiting for Author-Approval</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'NEW_WAITING_APPROVAL' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {newSubWaitingApproval.length}
                  </span>
                </button>

                {/* 5. Submission Being Processed */}
                <button
                  onClick={() => setActiveQueue('NEW_PROCESSING')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'NEW_PROCESSING'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Submission Being Processed</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'NEW_PROCESSING' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {newSubProcessing.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 2: Revisions Queues */}
            <div className="bg-white border border-[#E6DDCF] rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2.5 mb-2">
                <h3 className="font-serif font-bold text-sm text-[#3F2A1D] uppercase tracking-wide flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                  <span>Revisions</span>
                </h3>
              </div>

              <div className="space-y-1">
                {/* 1. Submissions Needing Revision */}
                <button
                  onClick={() => setActiveQueue('REV_NEEDING_REVISION')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'REV_NEEDING_REVISION'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'text-[#4A4036] hover:bg-orange-50/60 font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Submissions Needing Revision</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'REV_NEEDING_REVISION'
                      ? 'bg-white/20 text-white'
                      : revNeedingRevision.length > 0
                      ? 'bg-orange-100 text-orange-900 border border-orange-300 animate-pulse'
                      : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {revNeedingRevision.length}
                  </span>
                </button>

                {/* 2. Revisions Sent Back to Author */}
                <button
                  onClick={() => setActiveQueue('REV_SENT_BACK')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'REV_SENT_BACK'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Revisions Sent Back to Author</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'REV_SENT_BACK' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {revSentBack.length}
                  </span>
                </button>

                {/* 3. Incomplete Submission Being Revised */}
                <button
                  onClick={() => setActiveQueue('REV_INCOMPLETE')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'REV_INCOMPLETE'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Incomplete Submission Being Revised</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'REV_INCOMPLETE' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {revIncomplete.length}
                  </span>
                </button>

                {/* 4. Revisions Waiting for Author's Approval */}
                <button
                  onClick={() => setActiveQueue('REV_WAITING_APPROVAL')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'REV_WAITING_APPROVAL'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Revisions Waiting for Author's Approval</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'REV_WAITING_APPROVAL' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {revWaitingApproval.length}
                  </span>
                </button>

                {/* 5. Revision Being Processed */}
                <button
                  onClick={() => setActiveQueue('REV_PROCESSING')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'REV_PROCESSING'
                      ? 'bg-[#6B4A2E] text-white font-bold'
                      : 'text-[#4A4036] hover:bg-[#F6F1E8] font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Revision Being Processed</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'REV_PROCESSING' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {revProcessing.length}
                  </span>
                </button>

                {/* 6. Declined Revision */}
                <button
                  onClick={() => setActiveQueue('REV_DECLINED')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer ${
                    activeQueue === 'REV_DECLINED'
                      ? 'bg-rose-700 text-white font-bold'
                      : 'text-[#4A4036] hover:bg-rose-50/60 font-medium'
                  }`}
                >
                  <span className="truncate pr-2">Declined Revision</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeQueue === 'REV_DECLINED' ? 'bg-white/20 text-white' : 'bg-[#F0E8DC] text-[#6B4A2E]'
                  }`}>
                    {revDeclined.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick View All Button */}
            <button
              onClick={() => setActiveQueue('ALL')}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition flex items-center justify-between cursor-pointer ${
                activeQueue === 'ALL'
                  ? 'bg-white border-[#6B4A2E] text-[#6B4A2E] shadow-xs'
                  : 'bg-transparent border-[#E6DDCF] text-[#7A6F63] hover:bg-white hover:text-[#3F2A1D]'
              }`}
            >
              <span>View All Submissions</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F6F1E8] text-xs font-bold text-[#6B4A2E]">
                {submissions.length}
              </span>
            </button>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT MAIN COLUMN: QUEUE CONTENT & MANUSCRIPTS TABLE */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Queue Header & Search */}
            <div className="bg-white border border-[#E6DDCF] rounded-2xl p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F6F1E8] text-[#6B4A2E] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span>Queue</span>
                  </div>
                  <h2 className="font-serif font-bold text-xl text-[#3F2A1D]">
                    {getQueueLabel(activeQueue)}
                  </h2>
                  <p className="text-xs text-[#7A6F63] mt-0.5">
                    Showing {displayedSubmissions.length} manuscript{displayedSubmissions.length === 1 ? '' : 's'} in this status
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B4A2E]/60" />
                  <input
                    type="text"
                    placeholder="Search in this queue..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Manuscripts List */}
            {loading ? (
              <div className="p-16 text-center text-xs text-[#6B4A2E] bg-white rounded-2xl border border-[#E6DDCF]">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8A45D]" />
                Loading submissions...
              </div>
            ) : displayedSubmissions.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-2xl border border-[#E6DDCF]">
                <Inbox className="w-12 h-12 text-[#C8A45D] mx-auto mb-3 opacity-60" />
                <h3 className="font-serif font-bold text-base text-[#3F2A1D]">
                  No manuscripts in &ldquo;{getQueueLabel(activeQueue)}&rdquo;
                </h3>
                <p className="text-xs text-[#7A6F63] max-w-sm mx-auto mt-1 mb-5">
                  There are currently no items in this queue. When you submit or revise a paper, its status will be reflected here.
                </p>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-5 py-2.5 bg-[#6B4A2E] text-white rounded-xl text-xs font-semibold hover:bg-[#523720] transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit New Manuscript</span>
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
                            {paper.manuscriptNo && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F6F1E8] text-[#6B4A2E] border border-[#C8A45D]/40">
                                <FileText className="w-3 h-3 text-[#C8A45D]" />
                                {paper.manuscriptNo}
                              </span>
                            )}
                            <span className="text-[11px] text-gray-500 font-semibold bg-[#F6F1E8] px-2 py-0.5 rounded-md">
                              v{paper.version}
                            </span>
                            {paper.category && (
                              <span className="text-[11px] text-gray-500">• {paper.category}</span>
                            )}
                            <span className="text-[11px] text-gray-400">
                              • {new Date(paper.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-[#3F2A1D] leading-snug">
                            {paper.title}
                          </h3>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isRevision && (
                            <button
                              onClick={() => setRevisionPaper(paper)}
                              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Submit Revision</span>
                            </button>
                          )}

                          {isPublished && (
                            <button
                              onClick={() => handleCopyCitation(paper)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === paper.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === paper.id ? 'Copied' : 'Cite'}</span>
                            </button>
                          )}

                          <a
                            href={paper.fileWithAuthor}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-xl transition"
                            title="Download Manuscript PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                            className="px-3 py-1.5 text-xs text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-xl flex items-center gap-1 font-medium transition cursor-pointer"
                          >
                            <span>{isExpanded ? 'Less' : 'Details'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details Drawer */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-3 border-t border-[#E6DDCF]/60 bg-[#FAF7F2]/60 rounded-b-2xl space-y-3 text-xs">
                          <div className="flex flex-wrap items-center gap-4 bg-white p-2.5 rounded-xl border border-gray-200">
                            {paper.manuscriptNo && (
                              <span><strong>Manuscript No:</strong> <span className="font-mono text-[#6B4A2E] font-bold">{paper.manuscriptNo}</span></span>
                            )}
                            {paper.category && <span><strong>Category:</strong> {paper.category}</span>}
                            <span><strong>Submission Date:</strong> {new Date(paper.createdAt).toLocaleDateString()}</span>
                          </div>

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
                            <span className="font-semibold text-[#3F2A1D]">Manuscript Files:</span>
                            <a href={paper.fileWithAuthor} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6B4A2E]">
                              Identified PDF (with author info)
                            </a>
                            <span>•</span>
                            <a href={paper.fileWithoutAuthor} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6B4A2E]">
                              Blind PDF (anonymized)
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* SUBMIT MANUSCRIPT MODAL */}
      {/* ============================================================ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="inline-block px-2.5 py-0.5 bg-[#F6F1E8] text-[#6B4A2E] text-[10px] font-bold rounded-full uppercase tracking-wider mb-1">
                New Submission
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3F2A1D]">Submit New Manuscript</h3>
              <p className="text-xs text-[#7A6F63] mt-0.5">
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

            <form onSubmit={handleSubmitManuscript} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3F2A1D] mb-1">
                  Manuscript Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Socio-Economic Dimensions of Tribal Welfare in Northern India"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3F2A1D] mb-1">
                  Category / Discipline
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden text-xs"
                >
                  <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                  <option value="Political Science & International Relations">Political Science & International Relations</option>
                  <option value="Sociology & Social Anthropology">Sociology & Social Anthropology</option>
                  <option value="Economics & Development Studies">Economics & Development Studies</option>
                  <option value="History, Culture & Philosophy">History, Culture & Philosophy</option>
                  <option value="Public Policy & Governance">Public Policy & Governance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3F2A1D] mb-1">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste your 200-300 word abstract covering introduction, methodology, key findings, and conclusion..."
                  value={newAbstract}
                  onChange={e => setNewAbstract(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3F2A1D] mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Tribal policy, Social cohesion, Public health, Governance"
                  value={newKeywords}
                  onChange={e => setNewKeywords(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                />
              </div>

              {/* Dual File Uploads */}
              <div className="pt-2 border-t border-[#E6DDCF] space-y-3">
                <span className="block font-serif font-bold text-[#3F2A1D] text-xs">
                  Dual-Manuscript Double-Blind Submission
                </span>

                {/* Identified file */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#3F2A1D]">
                      1. Identified Manuscript (with author names) <span className="text-red-500">*</span>
                    </span>
                    {identifiedFileUrl && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">
                    PDF document containing author details, affiliations, and acknowledgements.
                  </p>
                  <input
                    type="file"
                    ref={identifiedInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'identified');
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={uploadingIdentified}
                      onClick={() => identifiedInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-[#E6DDCF] hover:bg-[#F6F1E8] rounded-lg text-xs font-medium text-[#6B4A2E] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingIdentified ? 'Uploading...' : 'Choose File'}</span>
                    </button>
                    {identifiedFileName && (
                      <span className="text-[11px] text-[#3F2A1D] truncate max-w-xs font-mono">
                        {identifiedFileName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Anonymized file */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#3F2A1D]">
                      2. Blind Manuscript (Anonymized) <span className="text-red-500">*</span>
                    </span>
                    {anonymizedFileUrl && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Completely stripped of author names, affiliations, or identifying references for blinded peer review.
                  </p>
                  <input
                    type="file"
                    ref={anonymizedInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'anonymized');
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={uploadingAnonymized}
                      onClick={() => anonymizedInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-[#E6DDCF] hover:bg-[#F6F1E8] rounded-lg text-xs font-medium text-[#6B4A2E] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingAnonymized ? 'Uploading...' : 'Choose File'}</span>
                    </button>
                    {anonymizedFileName && (
                      <span className="text-[11px] text-[#3F2A1D] truncate max-w-xs font-mono">
                        {anonymizedFileName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#E6DDCF] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-[#E6DDCF] text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingIdentified || uploadingAnonymized}
                  className="px-5 py-2 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-xl font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Submitting...' : 'Submit Manuscript'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBMIT REVISION MODAL */}
      {/* ============================================================ */}
      {revisionPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRevisionPaper(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="inline-block px-2.5 py-0.5 bg-orange-100 text-orange-950 text-[10px] font-bold rounded-full uppercase tracking-wider mb-1">
                Revisions
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3F2A1D]">Submit Revised Manuscript</h3>
              <p className="text-xs text-[#7A6F63] mt-0.5 truncate">
                Paper: <strong className="text-[#3F2A1D]">{revisionPaper.title}</strong> (Next: v{revisionPaper.version + 1})
              </p>
            </div>

            {/* Reviewer Feedback reminder */}
            {revisionPaper.reviews && revisionPaper.reviews.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs">
                <span className="font-bold text-orange-950 block mb-1">
                  Reviewer Recommendation & Notes:
                </span>
                <p className="italic text-gray-800 text-[11px] leading-relaxed">
                  {revisionPaper.reviews[0].commentsForAuthor}
                </p>
              </div>
            )}

            {revisionError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {revisionError}
              </div>
            )}

            <form onSubmit={handleSubmitRevision} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3F2A1D] mb-1">
                  Author Response Letter / Rebuttal Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail point-by-point responses to the reviewer's comments and outline changes made..."
                  value={responseLetter}
                  onChange={e => setResponseLetter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden resize-none leading-relaxed"
                />
              </div>

              {/* Upload revised files */}
              <div className="space-y-3 pt-2 border-t border-[#E6DDCF]">
                <span className="block font-serif font-bold text-[#3F2A1D] text-xs">
                  Upload Revised Manuscript Files
                </span>

                {/* Revised identified */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#3F2A1D]">
                      Revised Identified Copy <span className="text-red-500">*</span>
                    </span>
                    {revisedIdentifiedUrl && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <input
                    type="file"
                    ref={revIdentifiedInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'identified', true);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={revUploadingIdentified}
                      onClick={() => revIdentifiedInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-[#E6DDCF] hover:bg-[#F6F1E8] rounded-lg text-xs font-medium text-[#6B4A2E] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{revUploadingIdentified ? 'Uploading...' : 'Choose File'}</span>
                    </button>
                    {revisedIdentifiedName && (
                      <span className="text-[11px] text-[#3F2A1D] truncate max-w-xs font-mono">
                        {revisedIdentifiedName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Revised blind */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#3F2A1D]">
                      Revised Blind Copy (Anonymized) <span className="text-red-500">*</span>
                    </span>
                    {revisedAnonymizedUrl && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <input
                    type="file"
                    ref={revAnonymizedInputRef}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'anonymized', true);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={revUploadingAnonymized}
                      onClick={() => revAnonymizedInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-[#E6DDCF] hover:bg-[#F6F1E8] rounded-lg text-xs font-medium text-[#6B4A2E] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{revUploadingAnonymized ? 'Uploading...' : 'Choose File'}</span>
                    </button>
                    {revisedAnonymizedName && (
                      <span className="text-[11px] text-[#3F2A1D] truncate max-w-xs font-mono">
                        {revisedAnonymizedName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#E6DDCF] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevisionPaper(null)}
                  className="px-4 py-2 border border-[#E6DDCF] text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRevision || revUploadingIdentified || revUploadingAnonymized}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {submittingRevision ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{submittingRevision ? 'Submitting...' : 'Submit Revision (v' + (revisionPaper.version + 1) + ')'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}