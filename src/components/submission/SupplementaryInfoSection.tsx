"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function SupplementaryInfoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeTab, setActiveTab] = useState("supplemental");

  const tabContent = {
    supplemental: {
      title: "Supplemental Data",
      items: [
        "JHSSI maintains an online repository for supplemental information",
        "Includes detailed methods, validation, or experimental results",
        "Attached to manuscript in online journal only",
        "Optional submission with manuscript",
        "Files posted in concurrence with online article"
      ]
    },
    unpublished: {
      title: "Unpublished, Cited Works",
      items: [
        "Mimeos of cited manuscripts not yet in print must be submitted",
        "Included as part of submission package",
        "Essential for proper peer review",
        "Treated confidentially by editorial team"
      ]
    },
    conflict: {
      title: "Conflict of Interest",
      items: [
        "Potential conflicts must be reported at submission",
        "Research funding from outside affiliation must be disclosed",
        "Declaration included within manuscript",
        "Ensures transparency and ethical standards"
      ]
    },
    plagiarism: {
      title: "Plagiarism Policy",
      items: [
        "JHSSI uses latest software to screen submissions",
        "Content checked against previously published work",
        "Authors must refine similar work appearing elsewhere",
        "Reserves right to reject plagiarized submissions",
        "Includes online publications, theses, and dissertations"
      ]
    }
  };

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
              Supplementary Information
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(tabContent).map((tabKey, index) => (
              <motion.button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tabKey ? 'bg-[#6B4A2E] text-white' : 'bg-[#F6F1E8] text-[#4A4036] hover:bg-[#EFE6D8]'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {tabContent[tabKey as keyof typeof tabContent].title}
              </motion.button>
            ))}
          </div>

          {/* Tab Content with Sliding Animation */}
          <div className="relative h-96">
            {Object.entries(tabContent).map(([tabKey, content], index) => (
              <motion.div
                key={tabKey}
                className="absolute inset-0"
                initial={{ opacity: 0, x: index > 0 ? 100 : -100 }}
                animate={{ 
                  opacity: activeTab === tabKey ? 1 : 0,
                  x: activeTab === tabKey ? 0 : (index > Object.keys(tabContent).indexOf(activeTab) ? 100 : -100)
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-[#F6F1E8] border border-[#E6DDCF] rounded-xl p-8 h-full">
                  <motion.h3 
                    className="font-serif text-2xl text-[#3F2A1D] mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {content.title}
                  </motion.h3>
                  
                  <div className="space-y-4">
                    {content.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + itemIndex * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#C8A45D] flex items-center justify-center mt-0.5">
                          <span className="text-[#6B4A2E] text-xs font-bold">{itemIndex + 1}</span>
                        </div>
                        <p className="text-[#4A4036]">{item}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Additional Specific Info */}
                  {tabKey === "supplemental" && (
                    <motion.div 
                      className="mt-6 pt-6 border-t border-[#D9C8A3]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-[#7A6F63] text-sm">
                        File size within permitted limits. Images maximum 640 x 480 pixels (9 x 6.8 inches at 72 PPI).
                      </p>
                    </motion.div>
                  )}
                  
                  {tabKey === "plagiarism" && (
                    <motion.div 
                      className="mt-6 pt-6 border-t border-[#D9C8A3]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-[#7A6F63] text-sm italic">
                        Authors must document (cite and reference) any ideas or words taken from intellectual endeavours.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical Requirements */}
          <motion.div 
            className="mt-12 bg-gradient-to-r from-[#F6F1E8] to-[#EFE6D8] border border-[#E6DDCF] rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-4">Format Requirements</h4>
                <ul className="space-y-2 text-[#4A4036]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Separate items mentioned at appropriate points in main text
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Summary diagram/figure as Supplementary Information (optional)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Submitted as single PDF file where possible
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-4">Submission Guidelines</h4>
                <ul className="space-y-2 text-[#4A4036]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Submit with manuscript for online version
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Not provided in hardcopy version
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C8A45D] mt-1">•</span>
                    Ensure file compatibility and accessibility
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