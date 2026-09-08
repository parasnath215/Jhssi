"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icons";

export default function EditorialInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const infoCards = [
    {
      id: 1,
      title: "For Readers",
      description: "Access cutting-edge research and interdisciplinary insights",
      items: [
        "Latest research articles",
        "Open access content",
        "Quarterly issues",
        "Global perspectives",
        "Digital archives"
      ],
      link: "/readers",
      color: "from-[#6B4A2E] to-[#3F2A1D]",
      icon: <Icon name="references" className="w-12 h-12" />
    },
    {
      id: 2,
      title: "For Authors",
      description: "Guidelines and support for manuscript submission",
      items: [
        "Submission guidelines",
        "Peer review process",
        "Publication ethics",
        "Author resources",
        "Copyright information"
      ],
      link: "/authors",
      color: "from-[#C8A45D] to-[#A8935A]",
      icon: <Icon name="acknowledgement" className="w-12 h-12" />
    },
    {
      id: 3,
      title: "For Librarians",
      description: "Information for institutional subscriptions and access",
      items: [
        "Subscription options",
        "Institutional access",
        "Archive information",
        "Technical support",
        "Usage statistics"
      ],
      link: "/librarians",
      color: "from-[#7A8B6A] to-[#5C6A50]",
      icon: <Icon name="guidelines" className="w-12 h-12" />
    },
    {
      id: 4,
      title: "Contact Editorial",
      description: "Get in touch with our editorial team",
      items: [
        "General inquiries",
        "Submission questions",
        "Peer review queries",
        "Technical support",
        "Partnership opportunities"
      ],
      link: "/contact",
      color: "from-[#4A4036] to-[#332C25]",
      icon: <Icon name="originality" className="w-12 h-12" />,
      email: "editor@jhssi.org"
    }
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
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
              Information Hub
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Bento Grid Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoCards.map((card) => (
              <motion.div
                key={card.id}
                className="rounded-xl border border-[#E6DDCF] bg-white shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.2 + card.id * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 15px 35px rgba(63, 42, 29, 0.08)",
                  transition: { duration: 0.2 }
                }}
              >
                {/* Header with Image Background */}
                <div className={`h-40 bg-gradient-to-r ${card.color} relative overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-16 h-16 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border border-white/30 rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                    <div className="text-4xl mb-2">{card.icon}</div>
                    <h3 className="font-serif text-2xl text-white">{card.title}</h3>
                    <p className="text-white/90 text-sm mt-2 max-w-xs">{card.description}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2 mb-6">
                    {card.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#C8A45D] rounded-full flex-shrink-0"></div>
                        <span className="text-[#4A4036] text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-[#E6DDCF]">
                    <Link
                      href={card.link}
                      className="inline-flex items-center gap-2 text-[#6B4A2E] font-medium hover:text-[#5A3D26] transition-colors"
                    >
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    
                    {card.email && (
                      <div className="mt-2 text-sm text-[#7A6F63]">
                        Email: {card.email}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-[#F6F1E8] to-[#EFE6D8] border border-[#E6DDCF] rounded-xl p-8 inline-block">
              <h3 className="font-serif text-2xl text-[#3F2A1D] mb-4">
                Join Our Editorial Community
              </h3>
              <p className="text-[#4A4036] mb-6 max-w-2xl">
                Interested in contributing to JHSSI as a reviewer or editorial board member?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-[#6B4A2E] text-white font-medium rounded-full hover:bg-[#5A3D26] transition-colors"
                >
                  Apply to Join Editorial Board
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 border border-[#6B4A2E] text-[#6B4A2E] font-medium rounded-full hover:bg-[#F6F1E8] transition-colors"
                >
                  Become a Reviewer
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}