"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DisclaimerHeader() {
  return (
    <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* White Background Image - Full Cover */}
      <div className="absolute inset-0">
        <Image
          src="/photos/edit.jpeg" // Replace with your white background image path
          alt="Background"
          fill
          className="object-cover height-full"
          priority
          
        />
       </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          
          <motion.h1 
            className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Disclaimer
          </motion.h1>
          
          <motion.div 
            className="h-px w-32 bg-[#C8A45D] mx-auto mb-10"
            initial={{ width: 0 }}
            animate={{ width: "128px" }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          
          <motion.p 
            className="text-[#4A4036] text-lg md:text-xl max-w-3xl mx-auto m-32 -mt-4 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Legal Notice <br /> Publication Ethics Statement
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}