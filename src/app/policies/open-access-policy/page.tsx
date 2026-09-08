"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { easeOut } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icons";

export default function OpenAccessPolicyPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  };

  const principles = [
    {
      icon: <Icon name="originality" className="text-[#C8A45D]" size={120} />,
      title: "Global Accessibility",
      description: "Research available to anyone with internet access worldwide, removing geographical and institutional barriers."
    },
    {
      icon: <Icon name="figures" className="text-[#C8A45D]" size={120} />,
      title: "Free Access",
      description: "No subscription fees, article processing charges, or paywalls. All content is completely free to access."
    },
    {
      icon: <Icon name="acknowledgement" className="text-[#C8A45D]" size={120} />,
      title: "Unrestricted Sharing",
      description: "Readers can share, distribute, and disseminate content without restrictions for educational and research purposes."
    },
    {
      icon: <Icon name="references" className="text-[#C8A45D]" size={120} />,
      title: "Copyright Retention",
      description: "Authors retain copyright of their work while granting broad distribution and usage rights to the community."
    }
  ];

  const userPermissions = [
    "Read, download, and print complete articles",
    "Copy and redistribute the material in any medium or format",
    "Remix, transform, and build upon the material",
    "Use articles for text and data mining purposes",
    "Share through social media, repositories, and educational platforms",
    "Include in course packs and educational materials",
    "Translate into different languages (with proper attribution)",
    "Create derivative works for non-commercial purposes"
  ];

  return (
    <main className="bg-white">
      <Navigation/>
      {/* Header Section */}
      <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* White Background Image - Full Cover with right shift */}
        <div className="absolute inset-0">
          <Image
            src="/photos/img4.jpeg"
            alt="Open Access Background"
            fill
            className="object-cover height-full object-left"
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
              className="inline-block mb-6"
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
              Open Access Policy
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
              Committed to unrestricted knowledge sharing <br /> For global academic advancement
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div ref={ref} className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          
            {/* Policy Statement */}
            <div className="mb-16">
              <div 
                className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF] mb-8"
               >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-6">
                  Our Commitment to Open Access
                </h2>
                <p className="text-[#4A4036] leading-relaxed text-lg">
                  <span className="font-semibold text-[#6B4A2E]">This is an open access journal which means that all content is freely available without charge to the user or his/her institution.</span> Users are allowed to read, download, copy, distribute, print, search, or link to the full texts of the articles, or use them for any other lawful purpose, without asking prior permission from the publisher or the author.
                </p>
              
            </div>

            {/* Core Principles */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 
                  className="font-serif text-3xl text-[#3F2A1D] mb-4"
                 >
                  Core Principles
                </h2>
                <div 
                  className="h-px w-24 bg-[#C8A45D] mx-auto"
                 />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {principles.map((principle, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg border border-[#E6DDCF]"
                                     >
                    <div className="text-3xl mb-8 flex justify-center">{principle.icon}</div>
                    <h3 className="font-serif text-xl text-[#3F2A1D] mb-3">
                      {principle.title}
                    </h3>
                    <p className="text-[#4A4036]">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Permissions */}
            <div className="mb-16">
              <div 
                className="bg-gradient-to-br from-[#F6F1E8] to-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-6">
                  User Rights & Permissions
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {userPermissions.map((permission, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3"
                     >
                      <div 
                        className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"
                                           />
                      <span className="text-[#4A4036]">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Licensing Information */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 
                  className="font-serif text-3xl text-[#3F2A1D] mb-4"
                 >
                  Licensing Information
                </h2>
                <div 
                  className="h-px w-24 bg-[#C8A45D] mx-auto"
                 />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div 
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                 >
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                    Creative Commons Attribution 4.0 International (CC BY 4.0)
                  </h3>
                  <p className="text-[#4A4036] mb-4 leading-relaxed">
                    Our default license allowing maximum flexibility while requiring proper attribution.
                  </p>
                  <Link
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-[#6B4A2E] hover:text-[#5A3D26] font-medium"
                  >
                    View License Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>

                <div 
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                                  >
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                    Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
                  </h3>
                  <p className="text-[#4A4036] mb-4 leading-relaxed">
                    For authors preferring to restrict commercial use while allowing free academic use.
                  </p>
                  <Link
                    href="https://creativecommons.org/licenses/by-nc/4.0/"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-[#6B4A2E] hover:text-[#5A3D26] font-medium"
                  >
                    View License Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Benefits for Authors */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 
                  className="font-serif text-3xl text-[#3F2A1D] mb-4"
                  >
                  Benefits for Authors
                </h2>
                <div 
                  className="h-px w-24 bg-[#C8A45D] mx-auto"
                 />
              </div>

              <div className="bg-gradient-to-br from-[#3F2A1D] to-[#6B4A2E] rounded-xl p-10 text-white">
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { value: "10x", label: "Higher Citation Impact" },
                    { value: "Global", label: "Research Visibility" },
                    { value: "100%", label: "Copyright Retention" }
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm"
                      >
                      <div className="text-4xl font-bold text-[#C8A45D] mb-3">{benefit.value}</div>
                      <div className="text-lg">{benefit.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mb-16">
              <div 
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF] text-center"
                >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-6">
                  Ready to Submit Your Research?
                </h2>
                <p className="text-[#4A4036] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join our community of open access researchers and contribute to the global knowledge exchange.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/login"
                    className="px-8 py-3 bg-[#6B4A2E] text-white font-semibold rounded-full hover:bg-[#5A3D26] transition-colors shadow-lg"
                  >
                    Submit Your Manuscript
                  </Link>
                  <Link
                    href="/archives"
                    className="px-8 py-3 border-2 border-[#6B4A2E] text-[#6B4A2E] font-semibold rounded-full hover:bg-[#6B4A2E]/10 transition-colors"
                  >
                    Browse Open Access Archives
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 pt-12 border-t border-[#E6DDCF]">
              <div className="text-center mb-12">
                <h2 
                  className="font-serif text-3xl text-[#3F2A1D] mb-4"
                  >
                  Frequently Asked Questions
                </h2>
                <div 
                  className="h-px w-24 bg-[#C8A45D] mx-auto"
                 />
              </div>

              <div className="space-y-6 max-w-3xl mx-auto">
                {[
                  {
                    q: "Are there any publication fees for authors?",
                    a: "No, we are committed to diamond open access model where neither authors nor readers pay any fees. All costs are covered by our institutional support."
                  },
                  {
                    q: "Can I use content from this journal in my classroom?",
                    a: "Yes, all content can be freely used for educational purposes, including classroom teaching, course packs, and student assignments."
                  },
                  {
                    q: "How do I properly cite articles from this journal?",
                    a: "You can use any standard citation format. The only requirement is proper attribution to the original author(s) and source."
                  },
                  {
                    q: "Is the journal indexed in major databases?",
                    a: "Yes, our open access content is indexed in major academic databases including Google Scholar, Crossref, and other disciplinary repositories."
                  }
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg border border-[#E6DDCF]"
                    >
                    <h3 className="text-lg font-bold text-[#3F2A1D] mb-3">{faq.q}</h3>
                    <p className="text-[#4A4036] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}