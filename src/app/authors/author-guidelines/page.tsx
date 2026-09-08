// src/app/author-guidelines/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";   
import Icon from "@/components/Icons";

export default function AuthorGuidelinesPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const articleTypes = [
    "Original Articles",
    "Reviews",
    "Abstracts",
    "Addendums",
    "Announcements",
    "Article-commentaries",
    "Rapid Communications",
    "Book Reviews",
    "Letters to the editor",
    "Conference Proceedings",
    "Annual Meeting Abstracts",
    "News",
    "Orations",
    "Obituaries",
    "Product Reviews",
    "Hypotheses",
    "Analyses"
  ];

  const manuscriptStructure = [
    {
      title: "Manuscript Title",
      description: "Should not exceed 50 words. Must not contain abbreviations. Requires a brief phrase describing the contents.",
      icon: <Icon name="fileformat" className="w-32 h-32" />
    },
    {
      title: "Author Information",
      description: "Full names and affiliations of all authors. Contact details of corresponding author (Telephone, Fax, Email).",
      icon: <Icon name="acknowledgement" className="w-32 h-32" />
    },
    {
      title: "Abstract",
      description: "Informative and self-explanatory (≤300 words). Should include background, methods, results, and conclusion.",
      icon: <Icon name="originalwork" className="w-32 h-32" />
    },
    {
      title: "Keywords",
      description: "3-10 keywords following the abstract. Include a list of abbreviations used.",
      icon: <Icon name="originality" className="w-32 h-32" />
    },
    {
      title: "Introduction",
      description: "Set the tone with firm statement, related literature, and proposed approach. Should be general to attract wide audience.",
      icon: <Icon name="results" className="w-32 h-32" />
    },
    {
      title: "Materials & Methods",
      description: "Complete overview of study design. Describe novel procedures in detail; cite published procedures with modifications.",
      icon: <Icon name="materials" className="w-32 h-32" />
    },
    {
      title: "Results",
      description: "Complete details supporting conclusions. Write in past tense for findings. No speculation - save for discussion.",
      icon: <Icon name="results" className="w-32 h-32" />
    },
    {
      title: "Discussion",
      description: "Interpret results, compare with existing literature, discuss implications and limitations.",
      icon: <Icon name="formatting" className="w-32 h-32" />
    },
    {
      title: "Acknowledgements",
      description: "Acknowledge people, funding sources, grant details, etc.",
      icon: <Icon name="acknowledgement" className="w-32 h-32" />
    },
    {
      title: "References",
      description: "List all cited works. Use numbered citation-sequence method. Include online links where possible.",
      icon: <Icon name="references" className="w-32 h-32" />
    }
  ];

  const referenceExamples = [
    {
      type: "Published Papers",
      example: "Liokmli UK (1970) Emerging proteins for the treatment and evaluation of bacteriophage T4. Nature 257: 580-585."
    },
    {
      type: "Multiple Authors",
      example: "Brufic T, Rudy G, Hoikjuman G, Hadmer J, Hfgrison L (1988) Prediction of MHC class II-binding peptides. Bioinformatics 15: 131-140."
    },
    {
      type: "Many Authors",
      example: "Dofgtyenko V, Ayhch L, Vituhjuiina M, Kolfdgfolova A, Livshits V, et al. (2007) YddG from Escherichia coli promotes export of aromatic amino acids. FEMS Microbiol Lett 275: 312-318."
    },
    {
      type: "Books",
      example: "Bafdot JK (1989) Principles of drug disposition in domestic animals. (1st edn), R.B. Skiloers Company, New Delhi."
    },
    {
      type: "Conferences",
      example: "Hofmfgn T (2001) The Cluster-Abstraction Model: unsupervised learning of topic hierarchies from text data. Proceedings of the International Joint Conference on Artificial Intelligence."
    }
  ];

  const formattingRequirements = [
    {
      category: "Tables",
      requirements: [
        "Submit tables as .doc format",
        "Type double-spaced throughout",
        "Each table on separate page",
        "Number consecutively in Arabic numerals",
        "Include heading and legend",
        "Self-explanatory without reference to text"
      ]
    },
    {
      category: "Figures",
      requirements: [
        "Formats: .doc, TIFF, JPEG",
        "Resolution: Line Art 800 dpi, Combination 600 dpi, Halftone 300 dpi",
        "Number consecutively (Figure 1, Figure 2, etc.)",
        "Include descriptive legends",
        "Images at intended display size"
      ]
    },
    {
      category: "File Submission",
      requirements: [
        "Main manuscript in .doc or .docx",
        "Figures in separate files",
        "Supplementary information as PDF",
        "Retain editable versions",
        "Maximum file sizes as specified"
      ]
    }
  ];

  const importantPolicies = [
    {
      title: "Plagiarism",
      description: "JHSSI uses latest software to screen submissions. We reserve the right to reject plagiarized content, including online publications, theses, and dissertations.",
      icon: <Icon name="originalwork" className="w-32 h-32" />
    },
    {
      title: "Conflict of Interest",
      description: "Potential conflicts must be reported at submission. Research funding or support from outside affiliations must be disclosed within the manuscript.",
      icon: <Icon name="originality" className="w-32 h-32" />
    },
    {
      title: "Supplementary Data",
      description: "Optional supplemental files can be submitted. These will be available online but not in hardcopy. Maximum size: 640 x 480 pixels.",
      icon: <Icon name="fileformat" className="w-32 h-32" />
    },
    {
      title: "Unpublished Works",
      description: "Cited manuscripts not yet in print must be included in the submission package along with supplemental information files.",
      icon: <Icon name="originalwork" className="w-32 h-32" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="bg-white overflow-x-hidden ">
        <Navigation/>
      {/* Header Section */}
      <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/photos/img4.jpeg"
            alt="Author Guidelines Background"
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
              className="inline-block mb-0"
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
              className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
                Author Guidelines
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
              Comprehensive instructions for manuscript preparation <br /> Ensuring academic excellence and publication readiness
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF] mx-auto max-w-4xl">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8 text-center">
                Welcome to JHSSI Author Guidelines
              </h2>
              
              <div className="space-y-6">
                <p className="text-[#4A4036] text-lg leading-relaxed">
                  The Journal of Humanities and Social Sciences Invention (JHSSI) welcomes submissions across a wide range of academic contributions. These guidelines are designed to help authors prepare manuscripts that meet our publication standards.
                </p>
                
                <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed italic">
                    "Following these guidelines carefully will ensure your manuscript is processed efficiently and has the best chance of successful publication. Please read all sections thoroughly before submission."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accepted Article Types */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Accepted Article Types
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                JHSSI welcomes diverse academic contributions across humanities and social sciences
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#F6F1E8] to-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {articleTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-[#E6DDCF] shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full"></div>
                      <span className="text-[#4A4036] text-sm font-medium">{type}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Manuscript Structure */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Manuscript Structure
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Follow this structure to ensure your manuscript meets all requirements
              </p>
            </div>

            <div className="space-y-8">
              {manuscriptStructure.map((section, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF] hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-32 h-16  flex items-center justify-center text-2xl">
                      {section.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-serif text-xl text-[#3F2A1D]">
                          {section.title}
                        </h3>
                        <span className="px-3 py-1 bg-[#6B4A2E]/10 text-[#6B4A2E] text-sm font-medium rounded-full">
                          Step {index + 1}
                        </span>
                      </div>
                      <p className="text-[#4A4036] leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Reference Formatting */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: -50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Reference Formatting
                </h2>
                <p className="text-[#4A4036] mb-8">
                  JHSSI uses numbered citation-sequence method. Provide at least one online link for each reference.
                </p>
                
                <div className="space-y-8">
                  {referenceExamples.map((example, index) => (
                    <div key={index} className="pb-8 border-b border-[#E6DDCF] last:border-0 last:pb-0">
                      <h3 className="font-semibold text-lg text-[#3F2A1D] mb-4">
                        {example.type}
                      </h3>
                      <div className="bg-[#F6F1E8] p-5 rounded-lg border border-[#E6DDCF]">
                        <code className="text-[#6B4A2E] text-sm leading-relaxed">
                          {example.example}
                        </code>
                      </div>
                      {example.type === "Many Authors" && (
                        <p className="mt-3 text-sm text-[#4A4036]">
                          Note: List first five authors then add "et al." if additional authors
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Formatting Requirements */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ delay: 1.6, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Formatting Requirements
                </h2>
                
                <div className="space-y-10">
                  {formattingRequirements.map((category, index) => (
                    <div key={index}>
                      <h3 className="font-serif text-xl text-[#3F2A1D] mb-6 pb-3 border-b border-[#E6DDCF]">
                        {category.category}
                      </h3>
                      <motion.ul 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                      >
                        {category.requirements.map((req, reqIndex) => (
                          <motion.li
                            key={reqIndex}
                            className="flex items-start gap-3"
                            variants={itemVariants}
                          >
                            <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                            <span className="text-[#4A4036]">{req}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Important Policies */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Important Policies
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {importantPolicies.map((policy, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF] hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 1.9 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl mb-6">{policy.icon}</div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                    {policy.title}
                  </h3>
                  <p className="text-[#4A4036] leading-relaxed">
                    {policy.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submission Checklist */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2.1, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Submission Checklist
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  "Manuscript follows structure guidelines",
                  "Title ≤ 50 words, no abbreviations",
                  "Abstract ≤ 300 words with keywords",
                  "References formatted correctly",
                  "Figures and tables properly labeled",
                  "Supplementary files included if needed",
                  "Conflict of interest disclosed",
                  "All authors have approved submission",
                  "Plagiarism check completed"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: 2.2 + index * 0.05 }}
                  >
                    <div className="w-6 h-6 border-2 border-[#C8A45D] rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full"></div>
                    </div>
                    <span className="text-[#4A4036]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          
          
        </div>
      </div>
      <Footer/>
    </main>
  );
}