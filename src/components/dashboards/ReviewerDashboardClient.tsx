'use client';

import React, { useState, useEffect } from 'react';
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
  Send,
  ThumbsUp,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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
}

interface RevisionHistory {
  id: string;
  version: number;
  fileWithoutAuthor: string;
  responseLetter?: string;
  submittedAt: string;
}

interface AssignedSubmission {
  id: string;
  title: string;
  abstract: string;
  keywords?: string;
  category?: string;
  fileWithoutAuthor: string; // Strictly blind copy
  status: string;
  version: number;
  manuscriptNo?: string;
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
  revisionHistories: RevisionHistory[];
}

export default function ReviewerDashboardClient() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<AssignedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Evaluation Modal
  const [selectedSubmission, setSelectedSubmission] = useState<AssignedSubmission | null>(null);
  const [recommendation, setRecommendation] = useState<'APPROVE' | 'REVISE'>('APPROVE');
  const [commentsForAuthor, setCommentsForAuthor] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [originalityScore, setOriginalityScore] = useState(4);
  const [methodologyScore, setMethodologyScore] = useState(4);
  const [clarityScore, setClarityScore] = useState(4);
  const [significanceScore, setSignificanceScore] = useState(4);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchAssignedSubmissions();
  }, []);

  const fetchAssignedSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/submission/assigned');
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Error fetching assigned submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (sub: AssignedSubmission) => {
    setSelectedSubmission(sub);
    setRecommendation('APPROVE');
    setCommentsForAuthor('');
    setConfidentialNotes('');
    setOriginalityScore(4);
    setMethodologyScore(4);
    setClarityScore(4);
    setSignificanceScore(4);
    setReviewError('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setReviewError('');

    if (!commentsForAuthor.trim()) {
      setReviewError('Please provide scholarly feedback for the author.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/review/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          recommendation,
          commentsForAuthor,
          confidentialNotes,
          originalityScore,
          methodologyScore,
          clarityScore,
          significanceScore,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Review submission failed');

      alert(data.message || 'Evaluation submitted successfully!');
      setSelectedSubmission(null);
      fetchAssignedSubmissions();
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return { label: 'Review Pending', color: 'bg-blue-100 text-blue-900 border-blue-200 font-bold', icon: Clock };
      case 'RESUBMITTED':
        return { label: 'Revised (Re-Review Needed)', color: 'bg-purple-100 text-purple-900 border-purple-300 font-bold', icon: RefreshCw };
      case 'REVISION_REQUESTED':
        return { label: 'Revisions Requested', color: 'bg-orange-50 text-orange-900 border-orange-200', icon: AlertCircle };
      case 'REVIEWER_APPROVED':
        return { label: 'You Approved', color: 'bg-emerald-50 text-emerald-900 border-emerald-200', icon: CheckCircle2 };
      case 'PUBLISHED':
        return { label: 'Published in Journal', color: 'bg-green-700 text-white border-green-800', icon: Award };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText };
    }
  };

  const pendingSubmissions = submissions.filter(
    s => s.status === 'UNDER_REVIEW' || s.status === 'RESUBMITTED'
  );
  const completedSubmissions = submissions.filter(
    s => s.status === 'REVIEWER_APPROVED' || s.status === 'PUBLISHED' || s.status === 'REVISION_REQUESTED'
  );

  const displayedList = (() => {
    let list = submissions;
    if (activeTab === 'PENDING') list = pendingSubmissions;
    else if (activeTab === 'COMPLETED') list = completedSubmissions;

    if (!searchQuery.trim()) return list;
    return list.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.manuscriptNo && s.manuscriptNo.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <span className="font-serif font-bold text-[#3F2A1D] text-base">JHSSI Reviewer Workspace</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Shield className="w-3 h-3 text-emerald-700" />
              Double-Blind Protected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#3F2A1D] hidden sm:inline">
              {session?.user?.name || 'Reviewer'}
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
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Streamlined Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#3F2A1D]">
              Assigned Manuscripts
            </h1>
            <p className="text-xs text-[#6B4A2E] mt-0.5">
              Author identities are strictly blinded to protect peer review neutrality.
            </p>
          </div>

          {pendingSubmissions.length > 0 && (
            <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-900 text-xs font-bold flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{pendingSubmissions.length} Manuscript{pendingSubmissions.length > 1 ? 's' : ''} Awaiting Review</span>
            </div>
          )}
        </div>

        {/* Clean Segmented Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-[#F6F1E8] p-1 rounded-xl border border-[#E6DDCF] w-fit">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'PENDING'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Pending My Review ({pendingSubmissions.length})
            </button>

            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'COMPLETED'
                  ? 'bg-white text-[#3F2A1D] shadow-xs'
                  : 'text-[#6B4A2E] hover:text-[#3F2A1D]'
              }`}
            >
              Evaluated ({completedSubmissions.length})
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
              placeholder="Search assigned papers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E6DDCF] rounded-xl focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Manuscripts List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6B4A2E] bg-white rounded-2xl border border-[#E6DDCF]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8A45D]" />
            Loading assigned manuscripts...
          </div>
        ) : displayedList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E6DDCF]">
            <Shield className="w-10 h-10 text-[#C8A45D] mx-auto mb-2.5 opacity-60" />
            <h3 className="font-serif font-bold text-base text-[#3F2A1D]">No manuscripts in this view</h3>
            <p className="text-xs text-[#6B4A2E] max-w-sm mx-auto mt-1">
              {activeTab === 'PENDING'
                ? 'Great job! You have no papers pending evaluation right now.'
                : 'No papers found matching this criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedList.map(paper => {
              const badge = getStatusBadge(paper.status);
              const isExpanded = expandedId === paper.id;
              const isPending = paper.status === 'UNDER_REVIEW' || paper.status === 'RESUBMITTED';

              return (
                <div
                  key={paper.id}
                  className={`bg-white border rounded-2xl transition shadow-2xs ${
                    isPending ? 'border-blue-300 ring-1 ring-blue-100' : 'border-[#E6DDCF]'
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
                        <span className="text-[11px] text-gray-500 font-medium">v{paper.version}</span>
                        {paper.category && (
                          <span className="text-[11px] text-gray-400">• {paper.category}</span>
                        )}
                        <span className="text-[11px] text-gray-400">
                          • Assigned {new Date(paper.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#3F2A1D] leading-snug truncate">
                        {paper.title}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/api/submission/download?id=${paper.id}&type=anonymized`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#F6F1E8] hover:bg-[#E6DDCF] text-[#6B4A2E] border border-[#E6DDCF] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Blind PDF</span>
                      </a>

                      {isPending ? (
                        <button
                          onClick={() => handleOpenReviewModal(paper)}
                          className="px-3.5 py-1.5 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Star className="w-3.5 h-3.5 text-[#C8A45D]" />
                          <span>Evaluate Paper</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReviewModal(paper)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium transition"
                        >
                          <span>Review Again</span>
                        </button>
                      )}

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

                      {/* Author response notes if resubmitted */}
                      {paper.revisionHistories && paper.revisionHistories.length > 0 && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-950">
                          <span className="font-bold block mb-1">Author Response Letter (v{paper.version}):</span>
                          <p className="italic text-gray-800">{paper.revisionHistories[0].responseLetter || 'Author addressed feedback.'}</p>
                        </div>
                      )}

                      {/* Previous review conducted */}
                      {paper.reviews && paper.reviews.length > 0 && (
                        <div className="p-3 bg-white border border-gray-200 rounded-xl">
                          <span className="font-bold text-[#3F2A1D] block mb-1">
                            Your Evaluation for v{paper.reviews[0].versionReviewed} ({paper.reviews[0].recommendation}):
                          </span>
                          <p className="text-gray-700 italic">"{paper.reviews[0].commentsForAuthor}"</p>
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
      {/* REVIEW EVALUATION MODAL */}
      {/* ============================================================ */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F6F1E8] text-[#6B4A2E] font-semibold border border-[#E6DDCF]">
                Double-Blind Peer Evaluation (v{selectedSubmission.version})
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1.5 truncate">
                {selectedSubmission.title}
              </h3>
            </div>

            {reviewError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Decision */}
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1.5">Recommendation Decision *</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRecommendation('APPROVE')}
                    className={`p-3 rounded-xl border-2 text-left transition flex items-center gap-2 ${
                      recommendation === 'APPROVE'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${recommendation === 'APPROVE' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <span className="block">Recommend Approval</span>
                      <span className="text-[10px] font-normal opacity-75">Ready for publication</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecommendation('REVISE')}
                    className={`p-3 rounded-xl border-2 text-left transition flex items-center gap-2 ${
                      recommendation === 'REVISE'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <AlertCircle className={`w-4 h-4 ${recommendation === 'REVISE' ? 'text-orange-600' : 'text-gray-400'}`} />
                    <div>
                      <span className="block">Request Revisions</span>
                      <span className="text-[10px] font-normal opacity-75">Return to Author</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Rubric Ratings */}
              <div className="p-3 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl space-y-2">
                <span className="font-bold text-[#3F2A1D] block">Rubric Scores (1 to 5)</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-600">Originality: {originalityScore}/5</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={originalityScore}
                      onChange={e => setOriginalityScore(Number(e.target.value))}
                      className="w-full accent-[#6B4A2E]"
                    />
                  </div>
                  <div>
                    <span className="text-gray-600">Methodology: {methodologyScore}/5</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={methodologyScore}
                      onChange={e => setMethodologyScore(Number(e.target.value))}
                      className="w-full accent-[#6B4A2E]"
                    />
                  </div>
                  <div>
                    <span className="text-gray-600">Clarity: {clarityScore}/5</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={clarityScore}
                      onChange={e => setClarityScore(Number(e.target.value))}
                      className="w-full accent-[#6B4A2E]"
                    />
                  </div>
                  <div>
                    <span className="text-gray-600">Significance: {significanceScore}/5</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={significanceScore}
                      onChange={e => setSignificanceScore(Number(e.target.value))}
                      className="w-full accent-[#6B4A2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">
                  Comments for Author * (Constructive Academic Feedback)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    recommendation === 'APPROVE'
                      ? 'Highlight strengths and scholarly contribution...'
                      : 'Detail the revisions required (e.g. methodology clarifications, reference updates)...'
                  }
                  value={commentsForAuthor}
                  onChange={e => setCommentsForAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E6DDCF]">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`px-5 py-2 rounded-xl font-bold text-white transition disabled:opacity-50 ${
                    recommendation === 'APPROVE' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {submittingReview ? 'Submitting...' : recommendation === 'APPROVE' ? 'Approve Manuscript' : 'Request Revisions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
