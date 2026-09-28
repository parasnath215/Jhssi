// src/app/archives/page.tsx
"use client";

import ArchivesHeader from "@/components/archives/ArchivesHeader";
import ArchiveViewer from "@/components/archives/ArchiveViewer";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ArchivesPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex-1">
        <ArchivesHeader />
        
        <div className="bg-gray-50">
          <ArchiveViewer />
        </div>
      </div>

      <Footer />
    </main>
  );
}
