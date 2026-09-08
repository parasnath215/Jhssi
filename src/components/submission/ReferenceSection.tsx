"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function ReferencesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeExample, setActiveExample] = useState(0);

  const referenceExamples = [
    {
      type: "Published Papers",
      examples: [
        "Liokmli UK (1970) Emerging proteins for the treatment and evaluation of bacteriophage T4. Nature 257: 580-585.",
        "Brufic T, Rudy G, Hoikjuman G, Hadmer J, Hfgrison L (1988) Prediction of MHC class II-binding peptides using an evolutionary algorithm and artificial neural network. Bioinformatics 15: 131-140.",
        "Dofgtyenko V, Ayhch L, Vituhjuiina M, Kolfdgfolova A, Livshits V, et al. (2007) YddG from Escherichia coli promotes export of aromatic amino acids. FEMS Microbiol Lett 275: 312-318."
      ],
      note: "List first five authors then 'et al.'"
    },
    {
      type: "Books",
      examples: [
        "Bafdot JK (1989) Principles of drug disposition in domestic animals: The basis of Veterinary Clinical Pharmacology. (1stedn), R.B. Skiloers Company, New Delhi, London, Wellington.",
        "Zghng X (2016) Bioinformatics tools for differential analysis of proteomic expression profiling data from clinical samples. CC CRC Press."
      ],
      note: "Include edition and publisher location"
    },
    {
      type: "Conferences",
      examples: [
        "Hofmfgn T (2001) The Cluster-Abstraction Model: unsupervised learning of topic hierarchies from text data. Proceedings of the International Joint Conference on Artificial Intelligence."
      ],
      note: "Include conference proceedings details"
    },
    {
      type: "Electronic Articles",
      examples: [
        "Electronic Journal Articles Entrez Programming Utilities http://www.ncbi.nlm.nih.gov/books/NGH28690/"
      ],
      note: "Provide full URL with access date"
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
              References Formatting
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Accordion-style Content */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {referenceExamples.map((refType, index) => (
              <motion.div
                key={index}
                className="border border-[#E6DDCF] rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <button
                  onClick={() => setActiveExample(activeExample === index ? -1 : index)}
                  className="w-full p-6 bg-[#F6F1E8] hover:bg-[#EFE6D8] transition-colors text-left flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-white border border-[#E6DDCF] flex items-center justify-center"
                      animate={{ rotate: activeExample === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-5 h-5 text-[#6B4A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                    <h3 className="font-serif text-xl text-[#3F2A1D]">
                      {refType.type}
                    </h3>
                  </div>
                  <span className="text-[#7A6F63] text-sm">
                    {activeExample === index ? 'Hide' : 'Show'} examples
                  </span>
                </button>
                
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: activeExample === index ? 'auto' : 0,
                    opacity: activeExample === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-white">
                    <div className="space-y-4">
                      {refType.examples.map((example, idx) => (
                        <motion.div
                          key={idx}
                          className="pl-4 border-l-2 border-[#C8A45D] py-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={activeExample === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <p className="text-[#4A4036] font-mono text-sm">
                            {example}
                          </p>
                        </motion.div>
                      ))}
                      
                      {refType.note && (
                        <motion.div
                          className="mt-4 pt-4 border-t border-[#E6DDCF]"
                          initial={{ opacity: 0 }}
                          animate={activeExample === index ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <p className="text-sm text-[#7A6F63] italic">
                            Note: {refType.note}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Important Guidelines */}
          <motion.div 
            className="mt-12 bg-gradient-to-r from-[#F6F1E8] to-[#EFE6D8] border border-[#E6DDCF] rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-2">Reference Guidelines</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[#4A4036]">
                    <span className="text-[#C8A45D]">•</span>
                    Use numbered citation (citation-sequence) method
                  </li>
                  <li className="flex items-start gap-2 text-[#4A4036]">
                    <span className="text-[#C8A45D]">•</span>
                    Multiple citations: [1,5-7,28]
                  </li>
                  <li className="flex items-start gap-2 text-[#4A4036]">
                    <span className="text-[#C8A45D]">•</span>
                    Provide online links for each reference
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-2">Important Notes</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[#4A4036]">
                    <span className="text-[#C8A45D]">•</span>
                    Only published or accepted manuscripts
                  </li>
                  <li className="flex items-start gap-2 text-[#4A4036]">
                    <span className="text-[#C8A45D]">•</span>
                    No meeting abstracts or unpublished work
                  </li>
                  <li className="flex items-start gap-2 text-[#4A4036]">
                    <span className="text-[#C8A45D]">•</span>
                    Personal communications require author letter
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