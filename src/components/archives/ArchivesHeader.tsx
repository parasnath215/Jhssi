// src/app/archives/components/ArchivesHeader.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ArchivesHeader() {
  return (
    <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Full Background Image - No Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/photos/edit.jpeg"
          alt="Academic archives collection"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl -mt-6mx-auto  px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-transparent  p-8 rounded-2xl shadow-lg   text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-4">
            Journal Archives
          </h1>
          
          <div className="h-1 w-16 bg-[#C8A45D] mx-auto mb-6"></div>
          
          <p className="text-[#4A4036] text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
            Curated Academic Collections</p>
          
        </motion.div>
      </div>
    </section>
  );
}