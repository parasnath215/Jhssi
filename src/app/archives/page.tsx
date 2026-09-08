// src/app/archives/page.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import ArchivesHeader from "@/components/archives/ArchivesHeader";
import SearchFilters from "@/components/archives/SearchFilters";
import ArchiveItem from "@/components/archives/ArchiveItem";
import PreviewModal from "@/components/archives/PreviewModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, TrendingUp, Star } from "lucide-react";


 export default function ArchivesPage() {

  return (
    <main>
      <Navigation/>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
      <iframe
        src="https://journal.jhssi.com/archive/"
        className="flex-1 w-full h-200 border-none"
      />
           </div>
      <Footer/>
    </main>
  );
}
