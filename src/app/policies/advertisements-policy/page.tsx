// src/app/advertisements-policy/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Icon from "@/components/Icons";

export default function AdvertisementsPolicyPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const policyPrinciples = [
    {
      icon: <Icon name="originalwork" className="w-32 h-32" />,
      title: "Relevant Content",
      description: "Advertisements must align with academic and research themes, providing value to our scholarly audience."
    },
    {
      icon: <Icon name="results" className="w-32 h-32" />,
      title: "Educational Focus",
      description: "Priority given to academic resources, research tools, educational services, and scholarly publications."
    },
    {
      icon: <Icon name="guidelines" className="w-32 h-32" />,
      title: "Ethical Standards",
      description: "All advertisements must maintain academic integrity and comply with ethical publishing guidelines."
    },
    {
      icon: <Icon name="originality" className="w-32 h-32" />,
      title: "Transparent Labeling",
      description: "Clear identification as advertisements with no confusion between editorial content and sponsored material."
    }
  ];

  const adCategories = [
    {
      type: "Academic Resources",
      examples: "Research databases, statistical software, reference tools",
      status: "Preferred"
    },
    {
      type: "Educational Services",
      examples: "Academic writing assistance, research methodology courses",
      status: "Approved"
    },
    {
      type: "Scholarly Publications",
      examples: "Academic books, journal subscriptions, conference announcements",
      status: "Preferred"
    },
    {
      type: "Research Equipment",
      examples: "Laboratory instruments, data collection tools",
      status: "Approved"
    }
  ];

  const prohibitedAds = [
    "Political campaigning or advocacy materials",
    "Products making unsubstantiated health claims",
    "Get-rich-quick schemes or financial speculation",
    "Adult content or inappropriate material",
    "Products encouraging academic misconduct",
    "Discriminatory or offensive content",
    "Unverified educational credentials",
    "Content conflicting with academic ethics"
  ];

  const reviewProcess = [
    "Submit advertisement proposal with complete details",
    "Editorial board review for relevance and appropriateness",
    "Ethics committee evaluation for compliance",
    "Final approval and scheduling",
    "Post-publication monitoring and feedback"
  ];

  // Animation variants for staggered children
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
        <Navigation/>
      {/* Header Section */}
      <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/photos/img4.jpeg"
            alt="Advertisements Policy Background"
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
              Advertisements Policy
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
              Guidelines for scholarly and ethical advertising <br /> Maintaining academic integrity in sponsored content
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Policy Overview */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className="h-px flex-grow bg-gradient-to-r from-transparent to-[#C8A45D]"
              initial={{ width: 0 }}
              //animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.h2 
              className="font-serif text-3xl text-[#3F2A1D] whitespace-nowrap"
              //variants={letterAnimation}
            >
              Policy Overview
            </motion.h2>
            <motion.div 
              className="h-px flex-grow bg-gradient-to-l from-transparent to-[#C8A45D]"
              initial={{ width: 0 }}
              //animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
            <div className="space-y-8 text-[#4A4036] leading-relaxed">
              <div className="space-y-8">
                <p className="text-[#4A4036] text-lg leading-relaxed">
                  The Journal of Humanities and Social Sciences Invention maintains a strict advertisements policy to ensure that all sponsored content aligns with our academic mission and maintains the integrity of our scholarly publication.
                </p>
                
                <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed italic">
                    "Advertisements in our journal are carefully selected to provide value to our academic audience while maintaining clear separation from editorial content. We prioritize educational resources and scholarly tools that enhance research and academic work."
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
                Core Principles
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {policyPrinciples.map((principle, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-4xl mb-0 -mt-4 justify-center flex">{principle.icon}</div>
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

          {/* Two Column Layout */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Accepted Ad Categories */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: -20 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Accepted Ad Categories
                </h2>
                
                <div className="space-y-8">
                  {adCategories.map((category, index) => (
                    <div key={index} className="pb-8 border-b border-[#E6DDCF] last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-[#3F2A1D]">
                          {category.type}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          category.status === "Preferred" 
                            ? "bg-[#C8A45D]/20 text-[#C8A45D]" 
                            : "bg-[#6B4A2E]/10 text-[#6B4A2E]"
                        }`}>
                          {category.status}
                        </span>
                      </div>
                      <p className="text-[#4A4036]">
                        {category.examples}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Prohibited Content */}
              <motion.div
                className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF]"
                initial={{ opacity: 0, x: 20 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                  Prohibited Content
                </h2>
                
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                >
                  {prohibitedAds.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      variants={itemVariants}
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#4A4036]">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Review Process */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Advertisement Review Process
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
            </div>

            <div className="bg-gradient-to-br from-[#F6F1E8] to-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <motion.div 
                className="grid md:grid-cols-5 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
              >
                {reviewProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    variants={itemVariants}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-6 bg-white border-2 border-[#C8A45D] rounded-full flex items-center justify-center">
                        <span className="text-[#6B4A2E] font-bold">{index + 1}</span>
                      </div>
                      <p className="text-[#4A4036] text-center">{step}</p>
                    </div>
                    
                    {index < reviewProcess.length - 1 && (
                      <div className="hidden md:block absolute top-6 right-0 w-8 h-0.5 bg-[#C8A45D] transform translate-x-4"></div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Guidelines & Requirements */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Technical Guidelines & Requirements
              </h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-6">
                    Format Specifications
                  </h3>
                  <ul className="space-y-4 text-[#4A4036]">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Maximum file size: 5MB</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Formats: PDF, JPEG, PNG, SVG</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Resolution: 300 DPI minimum</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Color mode: RGB for digital, CMYK for print</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-6">
                    Content Requirements
                  </h3>
                  <ul className="space-y-4 text-[#4A4036]">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Clear "Advertisement" labeling</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Verifiable contact information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>No misleading claims or comparisons</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                      <span>Respect for copyright and trademarks</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF] text-center">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                Interested in Advertising?
              </h2>
              <p className="text-[#4A4036] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Contact our advertisement team to discuss opportunities for scholarly and ethical advertising that aligns with our academic mission.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/contact"
                  className="px-10 py-4 bg-[#6B4A2E] text-white font-semibold rounded-full hover:bg-[#5A3D26] transition-colors shadow-lg text-lg"
                >
                  Contact Advertisement Team
                </Link>
                <Link
                  href="/downloads/advertisement-guidelines.pdf"
                  className="px-10 py-4 border-2 border-[#6B4A2E] text-[#6B4A2E] font-semibold rounded-full hover:bg-[#6B4A2E]/10 transition-colors text-lg"
                >
                  Download Full Guidelines
                </Link>
              </div>
            </div>
          </motion.div>

          
        </div>
      </div>
      <Footer/>
    </main>
  );
}