'use client';

import React, { useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Upload,
  LogOut,
  ExternalLink,
  Plus,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

const ALL_YEARS = ["2022", "2023", "2024", "2025", "2026"];
const DEFAULT_QUARTERS = [
  "Jan to Mar",
  "Apr to Jun",
  "Jul to Sep",
  "Oct to Dec"
];

export default function AdminArchivesClient() {
  const { data: session } = useSession();
  
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedQuarter, setSelectedQuarter] = useState('Jan-2023 to Mar-2023');
  const [paperTitle, setPaperTitle] = useState('');
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Reset quarter formatting to match the new year
    const baseQ = selectedQuarter.split('-')[0]; // "Jan"
    const matched = DEFAULT_QUARTERS.find(q => q.startsWith(baseQ)) || DEFAULT_QUARTERS[0];
    const newQuarter = `${matched.split(' ')[0]}-${year} to ${matched.split(' ')[2]}-${year}`;
    setSelectedQuarter(newQuarter);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !paperTitle.trim()) {
      setStatusMsg('Please provide a title and upload a PDF.');
      return;
    }

    setUploading(true);
    setStatusMsg('');

    try {
      // 1. Upload the PDF
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('documentType', 'archive_paper');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload PDF');

      const fileUrl = uploadData.url;

      // 2. Add to archives.json
      const saveRes = await fetch('/api/archives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: selectedYear,
          quarter: selectedQuarter,
          title: paperTitle,
          url: fileUrl
        })
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to update archives data');

      setStatusMsg('Paper added to archives successfully!');
      setPaperTitle('');
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#3F2A1D] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E6DDCF] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6B4A2E] text-white flex items-center justify-center font-bold text-sm">
                E
              </div>
              <span className="font-serif font-bold text-[#3F2A1D] text-base">JHSSI Editorial Directorate</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-[#6B4A2E] hover:text-[#3F2A1D] flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#3F2A1D]">
            Manage Archives
          </h1>
          <p className="text-[#6B4A2E] mt-2 text-sm">
            Upload old published research papers to the archives collection. These will be visible on the public archives page.
          </p>
        </div>

        <div className="bg-white border border-[#E6DDCF] rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#3F2A1D] mb-2">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] focus:outline-none transition-shadow"
                >
                  {ALL_YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#3F2A1D] mb-2">Select Quarter</label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] focus:outline-none transition-shadow"
                >
                  {DEFAULT_QUARTERS.map(q => {
                    const qName = `${q.split(' ')[0]}-${selectedYear} to ${q.split(' ')[2]}-${selectedYear}`;
                    return <option key={qName} value={qName}>{qName}</option>;
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3F2A1D] mb-2">Paper Title</label>
              <input
                type="text"
                required
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                placeholder="e.g. The Impact of Societal Changes..."
                className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E6DDCF] rounded-xl focus:ring-2 focus:ring-[#C8A45D] focus:outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3F2A1D] mb-2">Upload PDF Document</label>
              <div className="border-2 border-dashed border-[#E6DDCF] rounded-2xl p-6 text-center hover:bg-[#FBF9F5] transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                    <Upload size={24} />
                  </div>
                  <span className="font-semibold text-[#3F2A1D]">Click to select PDF</span>
                  <span className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</span>
                </label>
                {pdfFile && (
                  <div className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-sm inline-flex items-center gap-2">
                    <BookOpen size={16} />
                    {pdfFile.name}
                  </div>
                )}
              </div>
            </div>

            {statusMsg && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                statusMsg.includes('successfully') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {statusMsg}
              </div>
            )}

            <div className="pt-4 border-t border-[#E6DDCF]">
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-4 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <span className="animate-spin text-white">⏳</span> Uploading...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add Paper to Archive
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
