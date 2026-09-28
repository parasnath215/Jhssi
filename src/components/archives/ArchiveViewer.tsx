"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Folder, ArrowRight } from "lucide-react";
import archivesData from "@/data/archives.json";
import Link from "next/link";

const ALL_YEARS = ["2022", "2023", "2024", "2025", "2026"];

const DEFAULT_QUARTERS = [
  "Jan to Mar",
  "Apr to Jun",
  "Jul to Sep",
  "Oct to Dec"
];

export default function ArchiveViewer() {
  const [selectedYear, setSelectedYear] = useState("2023");

  const currentYearData = archivesData.find(y => y.year === selectedYear);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      {/* Year Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {ALL_YEARS.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-8 py-3 rounded-full text-lg font-serif transition-all duration-300 shadow-sm ${
              selectedYear === year
                ? "bg-[#6B4A2E] text-white ring-2 ring-[#6B4A2E] ring-offset-2"
                : "bg-white text-gray-700 hover:bg-[#F6F1E8] border border-[#E8DCC4]"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Quarters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_QUARTERS.map((baseQuarter) => {
          const quarterName = `${baseQuarter.split(' ')[0]}-${selectedYear} to ${baseQuarter.split(' ')[2]}-${selectedYear}`;
          const quarterData = currentYearData?.quarters?.find(q => q.name === quarterName);
          const paperCount = quarterData?.papers?.length || 0;

          return (
            <Link
              key={quarterName}
              href={`/archives/${selectedYear}/${quarterName}`}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md border border-[#E8DCC4] overflow-hidden hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#F6F1E8] rounded-xl flex items-center justify-center text-[#6B4A2E] group-hover:bg-[#6B4A2E] group-hover:text-white transition-colors duration-300">
                    <Folder size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#3F2A1D] mb-1">
                      {baseQuarter} {selectedYear}
                    </h3>
                    <p className="text-[#6B4A2E] font-medium">
                      {paperCount} {paperCount === 1 ? 'Published Paper' : 'Published Papers'}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#C8A45D] group-hover:text-white transition-colors duration-300">
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
