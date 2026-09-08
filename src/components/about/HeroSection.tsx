"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photos/edit.jpeg"
          alt="Journal header background"
          fill
          className="object-cover object-left"
          priority
          style={{ objectPosition: "70% center" }}
        />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-8"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            </motion.div>
          
          <motion.h1 
            className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            About the Journal
          </motion.h1>
          
          <motion.div 
            className="h-px w-32 bg-[#C8A45D] mx-auto mb-10"
            initial={{ width: 0 }}
            animate={{ width: "128px" }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          
          <motion.p 
            className="text-[#4A4036] text-lg md:text-xl max-w-3xl mx-auto  mb-32 -mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Journal of Humanities and Social Sciences Invention (JHSSI)
            <br />
            <span className="text-[#6B4A2E] font-medium">ISSN: 2581-8791</span>
          </motion.p>
         
        </motion.div>
      </div>
    </section>
  );
}