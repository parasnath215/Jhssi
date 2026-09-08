// src/app/copyright-form/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icons";

export default function CopyrightFormPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const contractClauses = [
    {
      icon: <Icon name="fileformat" className="w-32 h-32" />,
      title: "Transfer of Rights",
      description: "The author(s) hereby transfer to JHSSI all rights, title, and interest in the manuscript."
    },
    {
      icon: <Icon name="originality" className="w-32 h-32" />,
      title: "Originality Warranty",
      description: "The author(s) warrant that the manuscript is original and does not infringe any copyright."
    },
    {
      icon: <Icon name="guidelines" className="w-32 h-32" />,
      title: "Publication Rights",
      description: "JHSSI reserves exclusive rights to publish, reproduce, and distribute the work."
    },
    {
      icon: <Icon name="figures" className="w-32 h-32" />,
      title: "Author Rights",
      description: "Authors retain rights to use their work for personal and educational purposes."
    }
  ];

  const formSteps = [
    {
      step: "01",
      title: "Download Form",
      description: "Download the official copyright transfer form"
    },
    {
      step: "02",
      title: "Complete Details",
      description: "Fill in all required author and manuscript information"
    },
    {
      step: "03",
      title: "Sign Form",
      description: "All authors must sign the completed form"
    },
    {
      step: "04",
      title: "Submit Copy",
      description: "Email scanned copy to copyright@jhssi.edu"
    }
  ];

  const requiredInformation = [
    "Full legal name(s) of all authors",
    "Complete manuscript title",
    "Date of submission",
    "Corresponding author contact details",
    "Author signatures (wet or digital)",
    "Witness signature if required",
    "Institutional affiliation confirmation",
    "Funding source declaration"
  ];

  const submissionInstructions = [
    "Scan the completed and signed form to PDF format",
    "Email the scanned copy to copyright@jhssi.edu",
    "Include your manuscript ID in the subject line",
    "Retain the original signed copy for your records"
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

  const handleDownload = () => {
    // Trigger actual download in production
    console.log("Downloading copyright form...");
    // For demo purposes, we'll just log it
    alert("Copyright form download initiated. In production, this would download the actual form.");
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
            alt="Copyright Form Background"
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
              Copyright Transfer Form
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
              Official document for transferring publication rights <br /> Required for all accepted manuscripts
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
                Copyright Transfer Agreement
              </h2>
              
              <div className="space-y-8">
                <p className="text-[#4A4036] text-lg leading-relaxed">
                  The Journal of Humanities and Social Sciences Invention requires authors to complete and submit a Copyright Transfer Form for all accepted manuscripts. This formal agreement transfers copyright from the authors to JHSSI, ensuring proper protection and dissemination of scholarly work.
                </p>
                
                <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed italic">
                    "This transfer ensures your scholarly work is properly protected, attributed, and disseminated while maintaining your rights to use the work for educational and personal purposes."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contract Clauses */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Key Provisions
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Essential elements of the copyright transfer agreement
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contractClauses.map((clause, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-4xl mb-0 flex justify-center">{clause.icon}</div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4 text-center">
                    {clause.title}
                  </h3>
                  <p className="text-[#4A4036] text-center">
                    {clause.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF] text-center">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                Download Copyright Form
              </h2>
              
              <div className="mb-10">
                <div className="inline-block p-6 bg-[#F6F1E8] rounded-full mb-6">
                  <span className="text-4xl">📄</span>
                </div>
                <p className="text-[#4A4036] text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                  Download the official JHSSI Copyright Transfer Form in PDF format. Complete, sign, and submit as part of the manuscript acceptance process.
                </p>
                <p className="text-[#6B4A2E] text-sm">
                  Form Version: 3.1 | Last Updated: January 2024
                </p>
              </div>
              
              <motion.button
                onClick={handleDownload}
                className="px-10 py-4 bg-[#6B4A2E] text-white font-semibold rounded-full hover:bg-[#5A3D26] transition-colors shadow-lg text-lg inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>⬇️</span>
                <span>Download Copyright Form (PDF)</span>
              </motion.button>
              
              <p className="text-[#4A4036] text-sm mt-6">
                File size: 245 KB | Format: PDF
              </p>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Process Steps */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: -50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Process Steps
                </h2>
                
                <div className="space-y-8">
                  {formSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-6 pb-8 border-b border-[#E6DDCF] last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#F6F1E8] rounded-full flex items-center justify-center">
                        <span className="text-[#6B4A2E] font-bold">{step.step}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-[#3F2A1D] mb-2">
                          {step.title}
                        </h3>
                        <p className="text-[#4A4036]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Required Information */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Required Information
                </h2>
                
                <div className="space-y-6">
                  {requiredInformation.map((info, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ delay: 1.2 + index * 0.05 }}
                    >
                      <div className="w-3 h-3 bg-[#C8A45D] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#4A4036]">{info}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Submission Instructions */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Submission Instructions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-6">
                    How to Submit
                  </h3>
                  <ul className="space-y-4 text-[#4A4036]">
                    {submissionInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-6">
                    Important Notes
                  </h3>
                  <ul className="space-y-4 text-[#4A4036]">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Form must be completed by ALL authors</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Digital signatures are acceptable</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Submit within 7 days of acceptance notification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Processing time: 3-5 business days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="bg-gradient-to-br from-[#3F2A1D] to-[#6B4A2E] rounded-xl p-12 text-white mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl mb-8 text-center">
              Copyright Office
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-white/90">copyright@jhssi.edu</p>
                <p className="text-white/70 text-sm mt-1">For form submissions</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-white/90">+1 (555) 345-6789</p>
                <p className="text-white/70 text-sm mt-1">For inquiries</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                <p className="text-white/90">2-3 business days</p>
                <p className="text-white/70 text-sm mt-1">For confirmation</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm text-center">
                All copyright transfers are recorded in our permanent archives and acknowledged via official confirmation email.
              </p>
            </div>
          </motion.div>

          {/* Related Links */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Related Information
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
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
                
                <Link href="/publication-ethics" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">⚖️</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Publication Ethics
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Ethical standards and policies for authors and reviewers
                    </p>
                  </div>
                </Link>
                
                <Link href="/contact" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">📞</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Contact Editorial Office
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Get in touch with our editorial team for assistance
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
            transition={{ delay: 2, duration: 0.6 }}
          >
            <div className="inline-block p-4 bg-[#F6F1E8] rounded-full mb-6">
              <span className="text-2xl">ℹ️</span>
            </div>
            <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
              Need Assistance?
            </h3>
            <p className="text-[#4A4036] max-w-2xl mx-auto">
              If you have questions about the copyright transfer process or need help completing the form, please contact our Copyright Office at <span className="font-semibold text-[#6B4A2E]">copyright@jhssi.edu</span>.
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}