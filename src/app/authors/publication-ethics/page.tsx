// src/app/publication-ethics/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icons";

export default function PublicationEthicsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const ethicalPrinciples = [
    {
      icon: <Icon name="fileformat" className="w-32 h-32" />,
      title: "Ethical Standards",
      description: "Adherence to COPE's Best Practice Guidelines for all parties involved in publishing."
    },
    {
      icon: <Icon name="originalwork" className="w-32 h-32" />,
      title: "Transparency",
      description: "Clear disclosure of conflicts of interest and funding sources."
    },
    {
      icon: <Icon name="guidelines" className="w-32 h-32" />,
      title: "Fairness",
      description: "Equal treatment of all submissions regardless of author background or affiliation."
    },
    {
      icon: <Icon name="acknowledgement" className="w-32 h-32" />,
      title: "Confidentiality",
      description: "Protection of unpublished manuscripts and review processes."
    }
  ];

  const editorDuties = [
    {
      title: "Publication Decisions",
      description: "Editor decides which articles to publish, guided by journal policies and legal requirements regarding libel, copyright infringement, and plagiarism."
    },
    {
      title: "Fair Play",
      description: "Manuscripts evaluated based on intellectual content without regard to race, gender, sexual orientation, religion, ethnicity, citizenship, or political philosophy."
    },
    {
      title: "Confidentiality",
      description: "Editors must not disclose submitted manuscript information to anyone except corresponding author, reviewers, and editorial advisers."
    },
    {
      title: "Disclosure & Conflicts",
      description: "Unpublished materials from submitted manuscripts cannot be used in editor's own research without author's written consent."
    }
  ];

  const reviewerDuties = [
    {
      title: "Contribution to Decisions",
      description: "Assist editors in making editorial decisions and help authors improve papers through constructive feedback."
    },
    {
      title: "Promptness",
      description: "Reviewers should promptly notify editors if unqualified to review or unable to complete timely review."
    },
    {
      title: "Confidentiality",
      description: "Treat manuscripts as confidential documents; do not share or discuss with unauthorized individuals."
    },
    {
      title: "Objectivity",
      description: "Conduct reviews objectively without personal criticism; provide clear, supported arguments."
    },
    {
      title: "Source Acknowledgement",
      description: "Identify relevant uncited published work and alert editors to substantial similarity with other publications."
    },
    {
      title: "Conflict Disclosure",
      description: "Do not use privileged information from review for personal advantage; avoid reviewing manuscripts with conflicts of interest."
    }
  ];

  const authorDuties = [
    {
      title: "Reporting Standards",
      description: "Present accurate account of work, objective discussion of significance, and sufficient detail for replication."
    },
    {
      title: "Data Access & Retention",
      description: "Provide raw data for editorial review and be prepared to retain data for reasonable time after publication."
    },
    {
      title: "Originality & Plagiarism",
      description: "Ensure entirely original work with proper citation of others' work; avoid fraudulent or inaccurate statements."
    },
    {
      title: "Multiple Publication",
      description: "Do not publish essentially same research in multiple journals or submit to multiple journals concurrently."
    },
    {
      title: "Source Acknowledgement",
      description: "Properly acknowledge influential work of others with appropriate citations."
    },
    {
      title: "Authorship",
      description: "Include only significant contributors as co-authors; ensure all co-authors approve final version and submission."
    },
    {
      title: "Hazards Disclosure",
      description: "Clearly identify any unusual hazards involving chemicals, procedures, or equipment in the manuscript."
    },
    {
      title: "Conflict Disclosure",
      description: "Disclose all financial or substantive conflicts of interest and sources of financial support."
    },
    {
      title: "Error Correction",
      description: "Promptly notify editors of significant errors in published work and cooperate in retraction or correction."
    }
  ];

  const copyrightInfo = [
    {
      title: "Open Access",
      description: "All content freely available without charge; users may read, download, copy, distribute, print, search, or link to full texts."
    },
    {
      title: "Copyright Retention",
      description: "Authors retain copyrights; articles distributed under Creative Commons Attribution license."
    },
    {
      title: "Permissions",
      description: "No prior permission needed from publisher or author for use as per CC-BY license terms."
    },
    {
      title: "Disclaimer",
      description: "While believed true and accurate, authors, editors, and publisher accept no legal responsibility for errors or omissions."
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
            alt="Publication Ethics Background"
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
              Publication Ethics
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
              Ethical standards for authors, editors, and reviewers <br /> Based on COPE's Best Practice Guidelines
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
                Ethical Publishing Framework
              </h2>
              
              <div className="space-y-8">
                <p className="text-[#4A4036] text-lg leading-relaxed">
                  The publication of articles in peer-reviewed journals is an essential component of scholarly communication. JHSSI is committed to maintaining the highest standards of publication ethics and expects all parties involved—authors, editors, reviewers, and the publisher—to adhere to these ethical guidelines.
                </p>
                
                <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed italic">
                    "Our ethical statements are based on COPE's Best Practice Guidelines for Journal Editors, ensuring integrity, transparency, and fairness throughout the publication process."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Principles */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Core Ethical Principles
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Fundamental values guiding our publication process
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ethicalPrinciples.map((principle, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-4xl mb-0 flex justify-center">{principle.icon}</div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4 text-center">
                    {principle.title}
                  </h3>
                  <p className="text-[#4A4036] text-center">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Duties of Editors */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Duties of Editors
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Ethical responsibilities of journal editors
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {editorDuties.map((duty, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#F6F1E8] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#6B4A2E] font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#3F2A1D] mb-3">
                        {duty.title}
                      </h3>
                      <p className="text-[#4A4036]">
                        {duty.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Duties of Reviewers */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Duties of Reviewers
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Ethical responsibilities of peer reviewers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviewerDuties.map((duty, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#F6F1E8] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#6B4A2E] font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#3F2A1D] mb-3">
                        {duty.title}
                      </h3>
                      <p className="text-[#4A4036] text-sm">
                        {duty.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Duties of Authors */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Duties of Authors
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Ethical responsibilities of manuscript authors
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorDuties.map((duty, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 1.7 + index * 0.05, duration: 0.5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#F6F1E8] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#6B4A2E] font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#3F2A1D] mb-3">
                        {duty.title}
                      </h3>
                      <p className="text-[#4A4036] text-sm">
                        {duty.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Copyright Information */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Copyright & Open Access
              </h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                {copyrightInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: 2.1 + index * 0.1 }}
                  >
                    <div className="w-3 h-3 bg-[#C8A45D] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#3F2A1D] mb-2">
                        {info.title}
                      </h3>
                      <p className="text-[#4A4036]">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-[#E6DDCF]">
                <p className="text-[#4A4036] text-center">
                  <span className="font-semibold">License:</span> Creative Commons Attribution (CC-BY) 4.0 International
                </p>
              </div>
            </div>
          </motion.div>

          {/* COPE Guidelines */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2.3, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF] text-center">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                COPE Compliance
              </h2>
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-[#F6F1E8] rounded-full border-4 border-[#E6DDCF] flex items-center justify-center mb-6">
                    <span className="text-3xl">🔗</span>
                  </div>
                  <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                    Committee on Publication Ethics
                  </h3>
                  <p className="text-[#4A4036] max-w-md">
                    JHSSI follows COPE's Best Practice Guidelines for Journal Editors, ensuring adherence to international ethical standards.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-[#F6F1E8] rounded-full border-4 border-[#E6DDCF] flex items-center justify-center mb-6">
                    <span className="text-3xl">📋</span>
                  </div>
                  <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                    Ethical Violations
                  </h3>
                  <p className="text-[#4A4036] max-w-md">
                    Reports of unethical behavior are investigated following COPE guidelines, with appropriate corrective actions taken.
                  </p>
                </div>
              </div>
              
              <div className="mt-10">
                <Link
                  href="https://publicationethics.org/guidance"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#6B4A2E] text-[#6B4A2E] font-semibold rounded-full hover:bg-[#6B4A2E] hover:text-white transition-colors"
                >
                  <span>Visit COPE Guidelines</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Contact for Ethics Concerns */}
          <motion.div
            className="bg-gradient-to-br from-[#3F2A1D] to-[#6B4A2E] rounded-xl p-12 text-white mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl mb-8 text-center">
              Ethics Committee Contact
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-white/90">ethics@jhssi.edu</p>
                <p className="text-white/70 text-sm mt-1">For ethical concerns</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-white/90">+1 (555) 456-7890</p>
                <p className="text-white/70 text-sm mt-1">Confidential line</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                <p className="text-white/90">5-7 business days</p>
                <p className="text-white/70 text-sm mt-1">For initial response</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm text-center">
                All ethical concerns are treated with strict confidentiality and investigated thoroughly following COPE guidelines.
              </p>
            </div>
          </motion.div>

          {/* Related Resources */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2.7, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Related Resources
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link href="/copyright-form" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">📄</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Copyright Form
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Download the copyright transfer form for accepted manuscripts
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
                      Complete instructions for manuscript preparation and submission
                    </p>
                  </div>
                </Link>
                
                <Link href="/peer-review" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">👁️</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Peer Review Process
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Information about our double-blind peer review system
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
            transition={{ delay: 2.9, duration: 0.6 }}
          >
            <div className="inline-block p-4 bg-[#F6F1E8] rounded-full mb-6">
              <span className="text-2xl">ℹ️</span>
            </div>
            <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
              Ethical Commitment
            </h3>
            <p className="text-[#4A4036] max-w-2xl mx-auto">
              JHSSI is committed to maintaining the highest standards of publication ethics. We actively work to prevent and address ethical violations, ensuring the integrity of scholarly communication in humanities and social sciences.
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}