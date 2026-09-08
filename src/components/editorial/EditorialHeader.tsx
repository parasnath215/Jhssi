"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function EditorialHeader() {
  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photos/edit.jpeg"
          alt="Editorial team background"
          fill
          className="object-cover"
          priority
        />
        {/* Simple overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Centered content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-transparent  p-8 rounded-2xl shadow-lg border border-white/20 text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-4">
            Editorial Team
          </h1>
          
          <div className="h-1 w-16 bg-[#C8A45D] mx-auto mb-6"></div>
          
          <p className="text-[#4A4036] text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Meet the distinguished scholars and experts guiding JHSSI's commitment to academic excellence and interdisciplinary research.
          </p>
          
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-[#6B4A2E] text-white font-medium rounded-full hover:bg-[#5A3D26] transition-colors shadow-lg hover:shadow-xl"
          >
            MAKE A SUBMISSION
          </Link>
        </motion.div>
      </div>
    </section>
  );
}