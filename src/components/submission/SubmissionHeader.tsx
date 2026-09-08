"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SubmissionsHeader() {
  return (
    <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <img src="/photos/header2.jpeg" alt="Submission Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-block mb-8"
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            
          </motion.div>
          
          <motion.h1 
            className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Submissions
          </motion.h1>
          
          <motion.div 
            className="h-px w-32 bg-[#C8A45D] mx-auto mb-10"
            initial={{ width: 0 }}
            animate={{ width: "128px" }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          
          <motion.p 
            className="text-[#4A4036] text-lg md:text-xl max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
          As part of the submission process, <br /> authors are required to check off <br /> their submission's compliance.
          </motion.p>
          </motion.div>
      </div>
    </section>
  );
}