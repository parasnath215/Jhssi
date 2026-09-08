"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function ArticleTypes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const articleTypes = [
    { type: "Original Articles", color: "from-[#6B4A2E] to-[#3F2A1D]" },
    { type: "Reviews", color: "from-[#C8A45D] to-[#A8935A]" },
    { type: "Abstracts", color: "from-[#7A8B6A] to-[#5C6A50]" },
    { type: "Addendums", color: "from-[#4A4036] to-[#332C25]" },
    { type: "Announcements", color: "from-[#6B4A2E] to-[#3F2A1D]" },
    { type: "Article-commentaries", color: "from-[#C8A45D] to-[#A8935A]" },
    { type: "Rapid Communications", color: "from-[#7A8B6A] to-[#5C6A50]" },
    { type: "Book Reviews", color: "from-[#4A4036] to-[#332C25]" },
    { type: "Letters to the editor", color: "from-[#6B4A2E] to-[#3F2A1D]" },
    { type: "Conference Proceedings", color: "from-[#C8A45D] to-[#A8935A]" },
    { type: "Annual Meeting Abstracts", color: "from-[#7A8B6A] to-[#5C6A50]" },
    { type: "News", color: "from-[#4A4036] to-[#332C25]" },
    { type: "Orations", color: "from-[#6B4A2E] to-[#3F2A1D]" },
    { type: "Obituaries", color: "from-[#C8A45D] to-[#A8935A]" },
    { type: "Product Reviews", color: "from-[#7A8B6A] to-[#5C6A50]" },
    { type: "Hypotheses", color: "from-[#4A4036] to-[#332C25]" },
    { type: "Analyses", color: "from-[#6B4A2E] to-[#3F2A1D]" }
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-[#F6F1E8]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
              }
            }
          }}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              JHSSI Welcomes
            </motion.h2>
            <motion.div 
              className="h-px w-20 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "80px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {articleTypes.map((article, index) => (
              <motion.div
                key={index}
                className="aspect-video"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 + index * 0.02 }}
                whileHover={{ 
                  scale: 1.05,
                  zIndex: 10,
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`h-full bg-gradient-to-br ${article.color} rounded-lg p-3 flex items-center justify-center text-center`}>
                  <span className="text-white text-sm font-medium leading-tight">
                    {article.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div 
            className="mt-10 bg-white border border-[#E6DDCF] rounded-xl p-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#F6F1E8] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#6B4A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-2">Formats for JHSSI International Contributions</h4>
                <p className="text-[#4A4036] text-sm">
                  JHSSI accepts a wide range of scholarly contributions to accommodate diverse research outputs and academic communications.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}