"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function TablesFiguresSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const tableGuidelines = [
    {
      id: 1,
      title: "Table Format",
      description: "Submit as .doc format. Double-spaced throughout including headings and footnotes.",
      requirement: "Required",
      color: "bg-[#F6F1E8] border-[#D9C8A3]"
    },
    {
      id: 2,
      title: "Numbering",
      description: "Numbered consecutively in Arabic numbers with headings and legends.",
      requirement: "Required",
      color: "bg-[#EFE6D8] border-[#C8A45D]"
    },
    {
      id: 3,
      title: "Self-Explanatory",
      description: "Tables must be understandable without reference to the text.",
      requirement: "Required",
      color: "bg-[#F6F1E8] border-[#D9C8A3]"
    }
  ];

  const figureGuidelines = [
    {
      id: 4,
      title: "File Formats",
      description: ".doc, TIFF, JPEG. Photoshop files for layered images.",
      requirement: "Required",
      color: "bg-[#EFE6D8] border-[#C8A45D]"
    },
    {
      id: 5,
      title: "Resolution",
      description: "Line Art: 800 dpi, Combination: 600 dpi, Halftone: 300 dpi.",
      requirement: "Required",
      color: "bg-[#F6F1E8] border-[#D9C8A3]"
    },
    {
      id: 6,
      title: "Numbering",
      description: "Arabic numerals, upper-case letters for parts (Figure 1A).",
      requirement: "Required",
      color: "bg-[#EFE6D8] border-[#C8A45D]"
    }
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
                staggerChildren: 0.1,
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
              Tables & Figures Guidelines
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Bento Grid with Two Columns */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Tables Column */}
            <div>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#6B4A2E] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#3F2A1D]">Tables</h3>
                </div>
                
                <div className="space-y-4">
                  {tableGuidelines.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`${item.color} border rounded-lg p-5`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.3 + item.id * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-serif text-lg text-[#3F2A1D]">{item.title}</h4>
                        <span className="px-3 py-1 bg-white text-[#6B4A2E] text-xs font-medium rounded-full">
                          {item.requirement}
                        </span>
                      </div>
                      <p className="text-[#4A4036] text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Figures Column */}
            <div>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#C8A45D] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">F</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#3F2A1D]">Figures</h3>
                </div>
                
                <div className="space-y-4">
                  {figureGuidelines.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`${item.color} border rounded-lg p-5`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.3 + item.id * 0.1 }}
                      whileHover={{ x: -5 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-serif text-lg text-[#3F2A1D]">{item.title}</h4>
                        <span className="px-3 py-1 bg-white text-[#6B4A2E] text-xs font-medium rounded-full">
                          {item.requirement}
                        </span>
                      </div>
                      <p className="text-[#4A4036] text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Combined Guidelines */}
          <motion.div 
            className="bg-white border border-[#E6DDCF] rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C8A45D] rounded-full"></div>
                  Additional Table Guidelines
                </h4>
                <ul className="space-y-2 text-[#4A4036]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Use as few tables as possible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Each table on separate page
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Do not duplicate data in text and tables
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C8A45D] rounded-full"></div>
                  Figure Legend Guidelines
                </h4>
                <ul className="space-y-2 text-[#4A4036]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Start with title and include sufficient description
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Do not repeat legend information in text
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Type legends in numerical order on separate sheet
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}