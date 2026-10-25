"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";

interface Author {
  id?: string;
  name: string;
  email?: string;
  institution?: string | null;
  fieldOfStudy?: string | null;
}

interface SubmittedPaper {
  id: string;
  manuscriptNo?: string | null;
  title: string;
  abstract: string;
  keywords?: string | null;
  category?: string | null;
  fileWithAuthor?: string | null;
  fileWithoutAuthor?: string | null;
  status: string;
  version?: number;
  doi?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  createdAt: string;
  publishedAt?: string | null;
  author?: Author;
}

export default function CurrentIssuePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [papers, setPapers] = useState<SubmittedPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLatestPapers = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/articles/current-issue', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.papers && Array.isArray(data.papers)) {
        setPapers(data.papers);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error auto-updating current issue papers:', err);
    } finally {
      setLoading(false);
      if (manual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    fetchLatestPapers();

    // Auto-update polling: refresh every 15 seconds so newly submitted papers appear automatically
    intervalRef.current = setInterval(() => {
      fetchLatestPapers();
    }, 15000);

    // Also auto-refresh when tab gains focus
    const handleFocus = () => {
      fetchLatestPapers();
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        fetchLatestPapers();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchLatestPapers]);

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentYear = new Date().getFullYear();
  const currentVolume = "6";
  const currentIssueNo = "1";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Published Paper',
        };
      case 'REVIEWER_APPROVED':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-300',
          dot: 'bg-teal-500',
          label: 'Peer-Reviewed & Accepted',
        };
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'In Peer Review',
        };
      case 'REVISION_REQUESTED':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          dot: 'bg-purple-500',
          label: 'Under Revision',
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          label: 'Submitted Manuscript',
        };
    }
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        {/* Background Image with warm overlay */}
        <div className="absolute inset-0">
          <Image
            src="/photos/header2.jpeg"
            alt="Current Issue Background"
            fill
            className="object-cover object-left"
            priority
            style={{ objectPosition: "70% center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-[#FAF7F2]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-md border border-[#C8A45D] rounded-full text-xs font-bold text-[#3F2A1D] shadow-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>ISSN: 2581-8791 (Online) • Peer-Reviewed Open Access</span>
            </div>
            
            <motion.h1 
              className="font-serif text-4xl md:text-6xl text-white font-bold drop-shadow-md mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Current Issue
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-[#C8A45D] mx-auto mb-6 shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: "96px" }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
            
            <motion.p 
              className="text-white/95 text-lg md:text-xl max-w-2xl mx-auto font-serif drop-shadow-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Volume {currentVolume}, Issue {currentIssueNo} ({currentYear}) • Latest Research Papers
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Live Auto-Update Status Bar */}
        <div className="mb-10 bg-white border border-[#E6DDCF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-xs font-bold text-[#3F2A1D] tracking-wide uppercase flex items-center gap-1.5">
                <span>Live Continuous Sync</span>
                <span className="text-[#C8A45D]">•</span>
                <span className="text-emerald-700">Auto-Updating Enabled</span>
              </div>
              <p className="text-xs text-[#7A6F63]">
                Displaying the 5 latest submitted papers in real-time from the journal database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-[#7A6F63] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>Last checked: {lastUpdated.toLocaleTimeString()}</span>
              </span>
            )}
            <button
              onClick={() => fetchLatestPapers(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#F6F1E8] hover:bg-[#E6DDCF] text-[#6B4A2E] border border-[#C8A45D]/40 rounded-xl transition cursor-pointer"
              title="Refresh latest submitted papers"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C8A45D]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Papers Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-3">
            Latest Submitted Research Papers
          </h2>
          <div className="h-0.5 w-20 bg-[#C8A45D] mx-auto mb-4" />
          <p className="text-[#6B4A2E] text-sm md:text-base max-w-2xl mx-auto">
            The 5 most recent papers submitted to the Journal of Humanities and Social Sciences Inventions. Newly submitted manuscripts update automatically.
          </p>
        </div>

        {/* Papers List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#E6DDCF] shadow-sm animate-pulse space-y-4">
                <div className="h-4 bg-[#F6F1E8] rounded-md w-1/4"></div>
                <div className="h-7 bg-[#E6DDCF] rounded-md w-3/4"></div>
                <div className="h-4 bg-[#F6F1E8] rounded-md w-1/2"></div>
                <div className="h-16 bg-[#F6F1E8] rounded-md w-full"></div>
              </div>
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-[#E6DDCF] shadow-sm">
            <div className="w-16 h-16 mx-auto bg-[#F6F1E8] rounded-full flex items-center justify-center text-[#6B4A2E] mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3F2A1D] mb-2">
              No Papers Submitted Yet
            </h3>
            <p className="text-sm text-[#7A6F63] max-w-md mx-auto mb-6">
              When authors submit papers, the 5 latest manuscripts will automatically appear right here in real-time.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6B4A2E] hover:bg-[#523720] text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              <span>Submit a Manuscript</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {papers.map((paper, index) => {
              const badge = getStatusBadge(paper.status);
              const isExpanded = expandedAbstracts[paper.id];
              const authorName = paper.author?.name || 'Author';
              const authorAffiliation = paper.author?.institution || paper.author?.fieldOfStudy || 'Contributing Researcher';
              const submissionDate = paper.createdAt
                ? new Date(paper.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              const keywordsList = paper.keywords
                ? paper.keywords.split(',').map(k => k.trim()).filter(Boolean)
                : [];

              const downloadUrl = `/api/submission/download?id=${paper.id}&type=identified`;

              return (
                <motion.article
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6DDCF] shadow-sm hover:shadow-md hover:border-[#C8A45D] transition-all relative overflow-hidden"
                >
                  {/* Top Bar: Ranking, Manuscript ID & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 bg-[#F6F1E8] border border-[#C8A45D]/40 text-[#6B4A2E] text-xs font-bold rounded-full">
                        #{index + 1} Latest
                      </span>
                      {paper.manuscriptNo && (
                        <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-[#6B4A2E] font-mono text-xs font-bold rounded-full">
                          {paper.manuscriptNo}
                        </span>
                      )}
                      {paper.category && (
                        <span className="hidden sm:inline-flex px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full">
                          {paper.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-xs text-[#7A6F63] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>{submissionDate}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3F2A1D] mb-3 leading-snug">
                    {paper.title}
                  </h3>

                  {/* Author Meta */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#4A4036] mb-4 pb-3 border-b border-[#F0E8DC]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#6B4A2E]">
                      <User className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>{authorName}</span>
                    </div>
                    {authorAffiliation && (
                      <span className="text-stone-500">
                        {authorAffiliation}
                      </span>
                    )}
                    {paper.doi && (
                      <span className="text-emerald-800 font-mono">
                        DOI: {paper.doi}
                      </span>
                    )}
                  </div>

                  {/* Abstract Section */}
                  <div className="mb-5">
                    <p className={`text-[#4A4036] text-sm leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {paper.abstract}
                    </p>
                    {paper.abstract && paper.abstract.length > 220 && (
                      <button
                        onClick={() => toggleAbstract(paper.id)}
                        className="mt-2 text-xs font-semibold text-[#6B4A2E] hover:text-[#3F2A1D] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Show Less' : 'Read Full Abstract'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Keywords */}
                  {keywordsList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-6">
                      <Tag className="w-3.5 h-3.5 text-[#C8A45D] mr-1" />
                      {keywordsList.map((kw, kwIdx) => (
                        <span
                          key={kwIdx}
                          className="px-2.5 py-0.5 bg-[#F6F1E8] border border-[#E6DDCF] text-[#6B4A2E] text-xs rounded-md"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#F0E8DC]">
                    <div className="text-xs text-[#7A6F63] space-x-3">
                      <span><strong>Vol:</strong> {paper.volume || currentVolume}</span>
                      <span><strong>Issue:</strong> {paper.issue || currentIssueNo}</span>
                      <span><strong>Format:</strong> PDF / Open Access</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Robust Download Button that NEVER 404s */}
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`${(paper.manuscriptNo || 'JHSSI-Manuscript')}.pdf`}
                        className="px-4 py-2 bg-[#6B4A2E] hover:bg-[#523720] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                        title="Download Full Manuscript PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Full PDF</span>
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Download Full Issue Compendium Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#E6DDCF] text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-[#F6F1E8] border-2 border-[#C8A45D]/40 rounded-2xl flex items-center justify-center text-[#6B4A2E] mb-6 shadow-sm">
              <BookOpen className="w-8 h-8 text-[#C8A45D]" />
            </div>
            
            <h3 className="font-serif text-2xl md:text-3xl text-[#3F2A1D] font-bold mb-3">
              Download Complete Issue
            </h3>
            
            <p className="text-[#4A4036] text-sm md:text-base mb-6 leading-relaxed">
              Download the complete collection of Volume {currentVolume}, Issue {currentIssueNo} ({currentYear}) research papers in an integrated publication compendium.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/downloads/issue-current.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-[#6B4A2E] hover:bg-[#523720] text-white font-semibold rounded-full transition shadow-md text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Complete Issue (PDF)</span>
              </a>
              <Link
                href="/archives"
                className="px-8 py-3.5 border-2 border-[#6B4A2E] text-[#6B4A2E] font-semibold rounded-full hover:bg-[#6B4A2E]/10 transition text-sm inline-flex items-center gap-2"
              >
                <span>Browse Archives</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}