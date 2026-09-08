"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function IntroductionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const textReveal = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1
      }
    }
  };

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className="h-px flex-grow bg-gradient-to-r from-transparent to-[#C8A45D]"
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.h2 
              className="font-serif text-3xl text-[#3F2A1D] whitespace-nowrap"
              variants={letterAnimation}
            >
              About the Journal
            </motion.h2>
            <motion.div 
              className="h-px flex-grow bg-gradient-to-l from-transparent to-[#C8A45D]"
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          <motion.div 
            className="space-y-6 text-[#4A4036] leading-relaxed"
            variants={textReveal}
          >
            <motion.p variants={letterAnimation}>
              <span className="font-serif italic text-[#6B4A2E]">The Journal of Humanities and Social Sciences Invention (JHSSI)</span> is an international, peer-reviewed, open-access journal dedicated to the advancement of high-quality research in the Humanities and Social Sciences.
            </motion.p>
            
            <motion.p variants={letterAnimation}>
              Published quarterly, JHSSI serves as a global forum for theoretical innovation, empirical research, and interdisciplinary dialogue addressing contemporary social, cultural, political, and developmental issues.
            </motion.p>
          </motion.div>

          </motion.div>
      </div>
    </section>
  );
}