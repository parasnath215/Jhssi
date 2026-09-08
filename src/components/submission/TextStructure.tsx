"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Icon from "../Icons";

export default function TextStructure() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const structureSections = [
    {
      id: 1,
      title: "Introduction",
      description: "Set the tone, provide study background, related literature, and proposed approach.",
      color: "from-[#6B4A2E] to-[#3F2A1D]",
      icon: <Icon name="acknowledgement" className="w-40 h-40" />
    },
    {
      id: 2,
      title: "Materials & Methods",
      description: "Full descriptions of materials, participants, interventions, comparisons, and analysis.",
      color: "from-[#C8A45D] to-[#A8935A]",
      icon: <Icon name="materials" className="w-40 h-40" />
    },
    {
      id: 3,
      title: "Results",
      description: "Complete details of experiments needed to support study conclusions. Written in past tense.",
      color: "from-[#7A8B6A] to-[#5C6A50]",
      icon: <Icon name="results" className="w-40 h-40" />
    },
    {
      id: 4,
      title: "Discussion",
      description: "Interpretation of data, significance of findings, and relation to previous research.",
      color: "from-[#4A4036] to-[#332C25]",
      icon: <Icon name="originalwork" className="w-40 h-40" />
    },
    {
      id: 5,
      title: "Acknowledgement",
      description: "Acknowledgement of people, funds, grant details, and other contributions.",
      color: "from-[#6B4A2E] to-[#3F2A1D]",
      icon: <Icon name="acknowledgement" className="w-40 h-40" />
    },
    {
      id: 6,
      title: "References",
      description: "List of cited publications. Numbered citation method used.",
      color: "from-[#C8A45D] to-[#A8935A]",
      icon: <Icon name="references" className="w-40 h-40" />
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
              Manuscript Text Structure
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Bento Grid - Variable Height Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structureSections.map((section, index) => (
              <motion.div
                key={section.id}
                className={`rounded-xl border border-[#E6DDCF] bg-white shadow-sm overflow-hidden ${index % 3 === 1 ? 'md:row-span-1' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 15px 35px rgba(63, 42, 29, 0.08)",
                  transition: { duration: 0.2 }
                }}
              >
                {/* Header with gradient */}
                <div className={`h-3 bg-gradient-to-r ${section.color}`}></div>
                
                <div className="p-6 -mt-8">
                  <div className="flex items-center gap-4 -mb-4">
                    <div className="text-3xl w-40 h-40">{section.icon}</div>
                    <h3 className="font-serif text-xl text-[#3F2A1D]">
                      {section.title}
                    </h3>
                  </div>
                  
                  <p className="text-[#4A4036] mb-6">
                    {section.description}
                  </p>
                  
                  {/* Additional details based on section */}
                  {section.id === 1 && (
                    <div className="text-sm text-[#7A6F63] border-t border-[#E6DDCF] pt-4">
                      Should be general to attract wide readership
                    </div>
                  )}
                  
                  {section.id === 2 && (
                    <div className="text-sm text-[#7A6F63] border-t border-[#E6DDCF] pt-4">
                      Trade names capitalized with manufacturer details <br />
                        
                    </div>
                  )}
                  
                  {section.id === 3 && (
                    <div className="text-sm text-[#7A6F63] border-t border-[#E6DDCF] pt-4">
                      Previously published findings in present tense
                    </div>
                  )}
                  
                  {section.id === 6 && (
                    <div className="text-sm text-[#7A6F63] border-t border-[#E6DDCF] pt-4">
                      Numbered citation method: [1,5-7,28]
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Note */}
          <motion.div 
            className="mt-10 bg-white border border-[#E6DDCF] rounded-xl p-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#F6F1E8] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#6B4A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-2">Structure Guidelines</h4>
                <p className="text-[#4A4036] text-sm">
                  Results and Discussion may be combined or separate sections. Figure captions and tables should be placed at the end of the manuscript.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}