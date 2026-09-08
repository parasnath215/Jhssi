// src/app/editorial-peer-review/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icons";

export default function EditorialPeerReviewPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const reviewProcessSteps = [
    {
      step: "01",
      title: "Initial Screening",
      description: "Editor reviews manuscript for alignment with editorial policies and minimum quality standards.",
      icon: <Icon   name="fileformat" className="text-[#C8A45D]" size={120} />
    },
    {
      step: "02",
      title: "Double-Blind Assignment",
      description: "Manuscript is anonymized and sent to two qualified reviewers who remain anonymous to authors.",
      icon: <Icon name="guidelines" className="text-[#C8A45D]" size={120} />
    },
    {
      step: "03",
      title: "Review Period",
      description: "Reviewers evaluate manuscript based on originality, methodology, significance, and clarity.",
      icon: <Icon name="originalwork" className="text-[#C8A45D]" size={120} />
    },
    {
      step: "04",
      title: "Editorial Decision",
      description: "Editorial Board makes final decision based on reviewers' confidential comments and recommendations.",
      icon: <Icon name="results" className="text-[#C8A45D]" size={120} />
    },
    {
      step: "05",
      title: "Author Notification",
      description: "Authors receive decision with anonymous reviewer comments and required revisions if applicable.",
      icon: <Icon name="acknowledgement" className="text-[#C8A45D]" size={120} />
    },
    {
      step: "06",
      title: "Revision & Final Decision",
      description: "If revisions are requested, acceptance depends on satisfactory revision by authors.",
      icon: <Icon name="formatting" className="text-[#C8A45D]" size={120} />
    }
  ];

  const reviewCriteria = [
    {
      title: "Originality & Novelty",
      description: "Contribution to field, new insights, and avoidance of duplication.",
      icon: <Icon name="originality" className="text-[#C8A45D]" size={120} />
    },
    {
      title: "Methodological Rigor",
      description: "Appropriate research design, data analysis, and methodological soundness.",
      icon: <Icon name="materials" className="text-[#C8A45D]" size={120} />
    },
    {
      title: "Significance & Impact",
      description: "Importance of findings and potential influence on field of study.",
      icon: <Icon name="results" className="text-[#C8A45D]" size={120} />
    },
    {
      title: "Clarity & Presentation",
      description: "Logical structure, clear writing, and proper formatting.",
      icon: <Icon name="formatting" className="text-[#C8A45D]" size={120} />
    }
  ];

  const policies = [
    {
      title: "Retraction Policy",
      description: "Follows COPE guidelines for retraction of articles in cases of ethical violations or significant errors.",
      link: "http://publicationethics.org/files/retraction%20guidelines.pdf",
      icon: "⚠️"
    },
    {
      title: "Plagiarism Policy",
      description: "All submissions undergo plagiarism screening; guilty authors may be barred from publishing for six months.",
      link: null,
      icon: "🔍"
    },
    {
      title: "Confidentiality",
      description: "Reviewers' comments remain confidential and are anonymized before sharing with authors.",
      link: null,
      icon: "🔒"
    },
    {
      title: "Timeline",
      description: "Initial decision typically within 4-8 weeks; revision period depends on extent of changes required.",
      link: null,
      icon: "⏱️"
    }
  ];

  const reviewOutcomes = [
    {
      outcome: "Accept",
      description: "Manuscript accepted for publication as is (rare)",
      color: "bg-green-100 text-green-800"
    },
    {
      outcome: "Minor Revisions",
      description: "Acceptable after minor clarifications or corrections",
      color: "bg-blue-100 text-blue-800"
    },
    {
      outcome: "Major Revisions",
      description: "Requires substantial changes before reconsideration",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      outcome: "Reject",
      description: "Not suitable for publication in current form",
      color: "bg-red-100 text-red-800"
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
    <main className="bg-white">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/photos/img4.jpeg"
            alt="Editorial & Peer Review Background"
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
              className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Editorial & Peer Review Process
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
              Double-blind peer review system ensuring quality and anonymity <br /> Transparent evaluation process for scholarly excellence
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Introduction Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF] mx-auto max-w-4xl">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8 text-center">
                Our Review Philosophy
              </h2>
              
              <div className="space-y-8">
                <p className="text-[#4A4036] text-lg leading-relaxed">
                  The Journal of Humanities and Social Sciences Invention employs a rigorous double-blind peer review process to ensure the highest standards of academic quality and integrity. This system maintains complete anonymity between authors and reviewers throughout the evaluation process.
                </p>
                
                <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed italic">
                    "Every submitted manuscript undergoes thorough evaluation by at least two independent experts in the field, ensuring unbiased assessment and constructive feedback for authors."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Double-Blind Review Explanation */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Double-Blind Review System
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Ensuring impartiality through complete anonymity of authors and reviewers
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: -50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="text-4xl mb-6 text-center">🙈</div>
                <h3 className="font-serif text-xl text-[#3F2A1D] mb-4 text-center">
                  Author Anonymity
                </h3>
                <ul className="space-y-4 text-[#4A4036]">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>All author identifying information is removed before review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>Reviewers cannot see author names, affiliations, or contact details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>Self-citations are anonymized in the review copy</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="text-4xl mb-6 text-center">🙉</div>
                <h3 className="font-serif text-xl text-[#3F2A1D] mb-4 text-center">
                  Reviewer Anonymity
                </h3>
                <ul className="space-y-4 text-[#4A4036]">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>Reviewer identities remain confidential throughout the process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>Authors do not know who reviewed their manuscript</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>Reviewer comments are anonymized before sharing with authors</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Review Process Steps */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                The Review Process
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Step-by-step journey of manuscript evaluation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviewProcessSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-3xl">{step.icon}</div>
                    <div className="w-12 h-12 bg-[#F6F1E8] rounded-full flex items-center justify-center">
                      <span className="text-[#6B4A2E] font-bold">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#4A4036]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Review Criteria */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Review Evaluation Criteria
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Key aspects reviewers consider when evaluating manuscripts
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reviewCriteria.map((criterion, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-4xl mb-6 flex justify-center">{criterion.icon}</div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4 text-center">
                    {criterion.title}
                  </h3>
                  <p className="text-[#4A4036] text-center">
                    {criterion.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Possible Outcomes */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.9, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Possible Editorial Decisions
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {reviewOutcomes.map((outcome, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
                  >
                    <div className={`px-6 py-3 rounded-full font-semibold mb-6 ${outcome.color}`}>
                      {outcome.outcome}
                    </div>
                    <p className="text-[#4A4036]">
                      {outcome.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-[#E6DDCF]">
                <p className="text-[#4A4036] text-center">
                  <span className="font-semibold">Note:</span> Acceptance after revision depends on whether authors can satisfactorily address reviewers' comments within the given timeframe.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Policies Section */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Editorial Policies */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: -50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ delay: 2.3, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Editorial Policies
                </h2>
                
                <div className="space-y-8">
                  {policies.map((policy, index) => (
                    <div key={index} className="pb-8 border-b border-[#E6DDCF] last:border-0 last:pb-0">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="text-2xl flex-shrink-0">{policy.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg text-[#3F2A1D]">
                            {policy.title}
                          </h3>
                          <p className="text-[#4A4036] mt-2">
                            {policy.description}
                          </p>
                          {policy.link && (
                            <Link
                              href={policy.link}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-[#6B4A2E] hover:text-[#C8A45D] transition-colors mt-3 text-sm"
                            >
                              <span>View COPE Retraction Guidelines</span>
                              <span>↗</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Plagiarism Policy Details */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ delay: 2.4, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Plagiarism Policy
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#4A4036]">
                        All submitted manuscripts undergo thorough plagiarism screening using advanced detection software.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#4A4036]">
                        To report plagiarism concerns, please contact our editorial office with detailed information.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#4A4036]">
                        Authors found guilty of plagiarism may be barred from publishing in JHSSI for a period of six months.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF] mt-8">
                    <p className="text-[#4A4036] text-sm">
                      <span className="font-semibold">Reporting Procedure:</span> Send detailed complaint to ethics@jhssi.edu with evidence of plagiarism. All reports are investigated confidentially following COPE guidelines.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Contact Information */}
          
          {/* Related Resources */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2.8, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Related Resources
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link href="/publication-ethics" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">⚖️</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Publication Ethics
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Ethical standards for authors, editors, and reviewers
                    </p>
                  </div>
                </Link>
                
                <Link href="/author-guidelines" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">📝</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Author Guidelines
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Complete instructions for manuscript preparation
                    </p>
                  </div>
                </Link>
                
                <Link href="/copyright-form" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">📄</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Copyright Form
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Download copyright transfer form for accepted manuscripts
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Final Note */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF] text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 3, duration: 0.6 }}
          >
            <div className="inline-block p-4 bg-[#F6F1E8] rounded-full mb-6">
              <span className="text-2xl">ℹ️</span>
            </div>
            <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
              Commitment to Quality
            </h3>
            <p className="text-[#4A4036] max-w-2xl mx-auto">
              Our double-blind peer review process ensures rigorous evaluation while maintaining fairness and anonymity. We are committed to providing constructive feedback to authors and maintaining the highest standards of scholarly publishing.
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}