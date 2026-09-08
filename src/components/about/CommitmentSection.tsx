"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function CommitmentSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const commitments = [
    {
      id: 1,
      title: "Timely Review Process",
      description: "Double-blind peer review with average response time of 4-6 weeks. Dedicated editorial team ensures efficient manuscript handling.",
      image: "/photos/icon1.svg"
    },
    {
      id: 2,
      title: "Academic Integrity",
      description: "Strict adherence to publication ethics, plagiarism detection, and transparent editorial policies. Upholding highest academic standards.",
      image: "/photos/icon2.svg"
    },
    {
      id: 3,
      title: "Global Accessibility",
      description: "Open access publishing with no article processing charges for authors from developing countries. Worldwide knowledge dissemination.",
      image: "/photos/icon3.svg"
    },
    {
      id: 4,
      title: "Ethical Standards",
      description: "COPE-compliant policies, data transparency, and responsible research practices. Commitment to scholarly integrity.",
      image: "/photos/icon4.svg"
    },
    {
      id: 5,
      title: "Diversity & Inclusion",
      description: "Welcoming submissions from diverse geographical, cultural, and disciplinary backgrounds. Promoting inclusive scholarship.",
      image: "/photos/icon5.svg"
    },
    {
      id: 6,
      title: "Author Support",
      description: "Comprehensive author guidelines, pre-submission checks, and responsive editorial assistance throughout publication process.",
      image: "/photos/icon6.svg"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === commitments.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView, commitments.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96] // Cubic bezier array instead of string
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-12"
            //variants={fadeInUp}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-4">
              Our Commitment
            </h2>
            <div className="h-px w-20 bg-[#C8A45D] mx-auto mb-6"></div>
            <p className="text-[#4A4036] text-lg max-w-3xl mx-auto">
              Dedicated to advancing scholarly communication through ethical, transparent, and accessible publishing practices.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            
            {/* Left Section - Commitment Statement */}
            <motion.div 
              className="lg:col-span-1"
              //variants={fadeInUp}
            >
              <div className="bg-[#F6F1E8] border border-[#E6DDCF] rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-[#3F2A1D] mb-6">
                  Open Access Promise
                </h3>
                <p className="text-[#4A4036] leading-relaxed mb-6">
                  As an open-access journal, JHSSI ensures unrestricted access to published research, facilitating the free exchange of knowledge across academic and policy communities worldwide.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#C8A45D] rounded-full"></div>
                    <span className="text-[#4A4036] text-sm">Immediate online publication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#C8A45D] rounded-full"></div>
                    <span className="text-[#4A4036] text-sm">No subscription barriers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#C8A45D] rounded-full"></div>
                    <span className="text-[#4A4036] text-sm">Global research impact</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Carousel */}
            <motion.div 
              className="lg:col-span-2"
              //variants={fadeInUp}
            >
              <div className="relative overflow-hidden rounded-xl border border-[#E6DDCF] bg-white h-full">
                
                {/* Carousel Container */}
                <motion.div 
                  className="flex h-80"
                  animate={{ x: `-${currentIndex * 100}%` }}
                  transition={{ type: "tween", duration: 0.5 }}
                >
                  {commitments.map((commitment) => (
                    <div 
                      key={commitment.id}
                      className="w-full flex-shrink-0 p-8"
                    >
                      <div className="flex flex-col md:flex-row gap-8 h-full">
                        
                        {/* Image Left */}
                        <div className="md:w-2/3 flex items-center justify-center mt-12">
                          <div className="w-64 h-96 flex items-center justify-center">
                            {/* Image Placeholder */}
                            <div className="w-64 h-64">
                              <Image
                                src={commitment.image}
                                alt={commitment.title}
                                width={400}
                                height={400}
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Text Right */}
                        <div className="md:w-2/3 flex flex-col justify-center">
                          <h3 className="font-serif text-2xl text-[#3F2A1D] mb-4">
                            {commitment.title}
                          </h3>
                          <p className="text-[#4A4036] leading-relaxed">
                            {commitment.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {commitments.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-[#6B4A2E] w-6' 
                          : 'bg-[#D9C8A3] hover:bg-[#C8A45D]'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentIndex(
                    currentIndex === 0 ? commitments.length - 1 : currentIndex - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E6DDCF] shadow-md flex items-center justify-center hover:bg-[#F6F1E8] transition-colors"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5 text-[#4A4036]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentIndex(
                    currentIndex === commitments.length - 1 ? 0 : currentIndex + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E6DDCF] shadow-md flex items-center justify-center hover:bg-[#F6F1E8] transition-colors"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5 text-[#4A4036]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
          >
            {[
              { value: "4-6", label: "Weeks Average Review", suffix: "" },
              { value: "99", label: "Countries Reached", suffix: "+" },
              { value: "24/7", label: "Online Access", suffix: "" },
              { value: "0", label: "APC for Developing Countries", suffix: "" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-[#F6F1E8] border border-[#E6DDCF] rounded-xl p-6 text-center"
                //variants={itemVariants}
                custom={index}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="font-serif text-3xl text-[#3F2A1D] mb-2">
                  {stat.value}<span className="text-[#C8A45D]">{stat.suffix}</span>
                </div>
                <div className="text-[#4A4036] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="text-center"
            //variants={fadeInUp}
          >
            <div className="bg-gradient-to-r from-[#F6F1E8] to-[#EFE6D8] border border-[#E6DDCF] rounded-xl p-8 mb-6">
              <h3 className="font-serif text-2xl text-[#3F2A1D] mb-4">
                Ready to Publish Your Research?
              </h3>
              <p className="text-[#4A4036] mb-6 max-w-2xl mx-auto">
                Join our community of scholars and contribute to global academic discourse.
              </p>
              <a
                href="/login"
                className="inline-block px-8 py-3 bg-[#6B4A2E] text-white font-medium rounded-full hover:bg-[#5A3D26] transition-colors shadow-md hover:shadow-lg"
              >
                Submit Manuscript
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}