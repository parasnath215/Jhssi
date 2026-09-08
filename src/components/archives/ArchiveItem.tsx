// src/app/archives/components/ArchiveItem.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Download, Eye, Calendar, Users, FileText } from "lucide-react";

interface ArchiveItemProps {
  id: string;
  title: string;
  volume: string;
  issue: string;
  year: number;
  month: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pages: number;
  articles: number;
  categories: string[];
  featured?: boolean;
}

export default function ArchiveItem({
  title,
  volume,
  issue,
  year,
  month,
  description,
  coverImage,
  pdfUrl,
  pages,
  articles,
  categories,
  featured = false
}: ArchiveItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${
        featured ? "ring-2 ring-[#C8A45D]" : ""
      }`}
    >
      <div className="md:flex">
        {/* Cover Image */}
        <div className="md:w-1/3 relative">
          <div className="relative h-64 md:h-full">
            <Image
              src={coverImage}
              alt={`${title} Cover`}
              fill
              className="object-cover"
            />
          </div>
          {featured && (
            <div className="absolute top-4 left-4 bg-[#C8A45D] text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured Issue
            </div>
          )}
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{month} {year}</span>
                <span className="text-gray-300 mx-2">•</span>
                <span className="text-sm font-semibold text-[#6B4A2E]">
                  Vol. {volume}, Issue {issue}
                </span>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FileText size={16} />
                <span>{pages} pages</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{articles} articles</span>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Preview Button */}
              <button className="flex items-center gap-2 px-4 py-2 border border-[#6B4A2E] text-[#6B4A2E] rounded-lg hover:bg-[#6B4A2E]/10 transition-colors">
                <Eye size={16} />
                Preview
              </button>
              
              {/* View Full Button */}
              <Link
                href={pdfUrl}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-[#6B4A2E] text-white rounded-lg hover:bg-[#5A3D26] transition-colors"
              >
                <ExternalLink size={16} />
                View Full Issue
              </Link>
              
              {/* Download Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}