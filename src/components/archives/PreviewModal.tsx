// src/app/archives/components/PreviewModal.tsx
"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: {
    title: string;
    coverImage: string;
    year: number;
    volume: string;
    issue: string;
  };
}

export default function PreviewModal({ isOpen, onClose, issue }: PreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // First 3 pages preview

  const pageImages = [
    "/photos/preview-page1.jpg",
    "/photos/preview-page2.jpg",
    "/photos/preview-page3.jpg"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{issue.title}</h3>
            <p className="text-gray-600">
              Vol. {issue.volume}, Issue {issue.issue} • {issue.year}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#6B4A2E] text-white rounded-lg hover:bg-[#5A3D26] transition-colors">
              <Download size={16} />
              Download Full PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Preview Pages */}
          <div className="space-y-6">
            {pageImages.map((image, index) => (
              <div key={index} className="relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-semibold">
                  Page {index + 1}
                </div>
                <div className="relative h-[600px] border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={image}
                    alt={`Preview page ${index + 1}`}
                    fill
                    className="object-contain bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Page Navigation */}
          <div className="sticky bottom-6 mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === page
                      ? "bg-[#6B4A2E] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 text-center text-gray-600">
          <p className="text-sm">
            Preview shows first 3 pages. Download the full PDF to access complete issue.
          </p>
        </div>
      </div>
    </div>
  );
}