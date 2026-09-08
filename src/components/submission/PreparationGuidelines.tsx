"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function PreparationGuidelines() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeStep, setActiveStep] = useState<number>(0);

  const guidelines = [
    {
      id: 1,
      title: "Manuscript Title",
      description: "Not more than 50 words, no abbreviations. Brief phrase describing contents.",
      details: "The title should be concise and descriptive, accurately reflecting the paper's content without using abbreviations."
    },
    {
      id: 2,
      title: "Author Information",
      description: "Full names, affiliations, and contact details of corresponding author.",
      details: "Include telephone, fax, and email address for the corresponding author. All contributing authors must be listed."
    },
    {
      id: 3,
      title: "Abstract",
      description: "Informative and self-explanatory, 300 words or less. Include background, methods, results, conclusion.",
      details: "Use standard nomenclature, no abbreviations. Follow with keywords (3-10) and abbreviations list."
    },
    {
      id: 4,
      title: "Text Formatting",
      description: "Single-spaced, 12-point font, italics instead of underlining.",
      details: "Proper formatting ensures consistency and readability across all submissions."
    }
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
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
              Article Preparation Guidelines
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Interactive Steps Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {guidelines.map((guideline, index) => (
                <motion.button
                  key={guideline.id}
                  onClick={() => setActiveStep(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeStep === index ? 'bg-[#6B4A2E] text-white' : 'bg-[#F6F1E8] text-[#4A4036] hover:bg-[#EFE6D8]'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  Step {index + 1}: {guideline.title}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Display with Moving Text */}
          <div className="relative h-50">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: index > activeStep ? 100 : -100 }}
                animate={{ 
                  opacity: activeStep === index ? 1 : 0,
                  x: activeStep === index ? 0 : (index > activeStep ? 100 : -100)
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-[#F6F1E8] border border-[#E6DDCF] rounded-xl p-8 h-full">
                  <div className="flex items-start gap-6">
                    <motion.div 
                      className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#C8A45D] to-[#6B4A2E] flex items-center justify-center text-white text-2xl font-bold"
                      animate={{ 
                        rotate: activeStep === index ? 360 : 0,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {index + 1}
                    </motion.div>
                    <div>
                      <h3 className="font-serif text-2xl text-[#3F2A1D] mb-3">
                        {guideline.title}
                      </h3>
                      <p className="text-[#4A4036] text-lg mb-4 font-medium">
                        {guideline.description}
                      </p>
                      <p className="text-[#4A4036]">
                        {guideline.details}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              className="px-6 py-3 bg-white border border-[#6B4A2E] text-[#6B4A2E] rounded-full font-medium flex items-center gap-2 hover:bg-[#F6F1E8] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </motion.button>
            
            <motion.button
              onClick={() => setActiveStep(prev => Math.min(guidelines.length - 1, prev + 1))}
              className="px-6 py-3 bg-[#6B4A2E] text-white rounded-full font-medium flex items-center gap-2 hover:bg-[#5A3D26] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}