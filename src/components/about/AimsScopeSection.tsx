"use client";

import { motion, cubicBezier } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Define types for better type safety
type ContentType = string | string[] | { [key: string]: string };

interface Card {
  type: string;
  size: string;
  title: string;
  content: ContentType;
  image: boolean;
  imageSrc?: string;
}

export default function AimsScopeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const cards: Card[] = [
    // Left Column Cards (30%)
    {
      type: "editorial",
      size: "medium",
      title: "Editorial Leadership",
      content: {
        name: "Prof. Ripu Sudan Singh",
        position: "Editor-in-Chief",
        department: "Political Science",
        university: "BBAU Central University",
        location: "Lucknow, India",
        email: "editor@jhssi.org"
      },
      image: true, 
      imageSrc: "/photos/img1.jpeg"
    },
    {
      type: "mission",
      size: "small",
      title: "Core Mission",
      content: "Advancing interdisciplinary scholarship through rigorous peer-review and global academic dialogue.",
      image: true,
      imageSrc: "/photos/img2.jpeg"
    },
    // Right Column Cards (70%)
    {
      type: "aims",
      size: "large",
      title: "Scope & Focus",
      content: [
        "Theoretical & Empirical Advancement",
        "Comparative & Historical Analysis", 
        "Interdisciplinary Integration",
        "Policy & Governance Studies",
        "Social Transformation Research",
        "Cultural Dynamics Exploration"
      ],
      image: true,
      imageSrc: "/photos/img3.jpeg"
    },
    {
      type: "stats",
      size: "medium",
      title: "Journal Metrics",
      content: {
        frequency: "Quarterly",
        review: "Double-Blind",
        access: "Open Access",
        impact: "Global Reach"
      },
      image: true, 
      imageSrc: "/photos/img4.jpeg"
    },
    {
      type: "themes",
      size: "small",
      title: "Key Themes",
      content: ["Digital Humanities", "Social Innovation", "Cultural Heritage", "Policy Analysis", "Global Studies"],
      image: true,
      imageSrc: "/photos/img5.jpeg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: cubicBezier(0.42, 0, 0.58, 1)
      }
    }
  };

  // Helper function to render content based on type
  const renderContent = (content: ContentType) => {
    if (typeof content === 'string') {
      return <p className="text-[#4A4036] text-sm leading-relaxed">{content}</p>;
    }
    
    if (Array.isArray(content)) {
      return (
        <div className="flex flex-wrap gap-2">
          {content.map((theme, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-[#F6F1E8] text-[#6B4A2E] text-xs rounded-full border border-[#D9C8A3]"
            >
              {theme}
            </span>
          ))}
        </div>
      );
    }
    
    // Object content (for editorial and stats)
    return null;
  };

  // Helper function to render specific card content
  const renderCardContent = (card: Card) => {
    switch (card.type) {
      case 'editorial':
        if (typeof card.content === 'object' && !Array.isArray(card.content)) {
          const content = card.content as { [key: string]: string };
          return (
            <div>
              <h4 className="font-serif text-base text-[#6B4A2E]">{content.position}</h4>
              <h5 className="font-serif text-lg text-[#3F2A1D] mb-1">{content.name}</h5>
              <p className="text-[#4A4036] text-xs mb-1">{content.department}</p>
              <p className="text-[#7A6F63] text-xs">{content.university}</p>
            </div>
          );
        }
        break;
      
      case 'stats':
        if (typeof card.content === 'object' && !Array.isArray(card.content)) {
          const content = card.content as { [key: string]: string };
          return (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(content).map(([key, value], index) => (
                <div key={key} className="text-center p-2 border border-[#E6DDCF] rounded">
                  <div className="font-serif text-lg text-[#3F2A1D] mb-1">{value}</div>
                  <div className="text-[#7A6F63] text-xs capitalize">{key}</div>
                </div>
              ))}
            </div>
          );
        }
        break;
      
      case 'aims':
        if (Array.isArray(card.content)) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {card.content.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2 p-3 border border-[#E6DDCF] rounded hover:border-[#C8A45D] transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <div className="w-2 h-2 mt-1.5 bg-[#6B4A2E] flex-shrink-0"></div>
                  <span className="text-[#4A4036] text-xs">{item}</span>
                </motion.div>
              ))}
            </div>
          );
        }
        break;
      
      default:
        return renderContent(card.content);
    }
  };

  return (
    <section ref={ref} className="h-screen min-h-[800px] max-h-[900px] py-12 px-6 bg-[#F6F1E8] overflow-hidden">
      <div className="h-full max-w-7xl mx-auto">
        
        {/* Section Header - Minimal */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl text-[#3F2A1D] mb-2">Aims & Scope</h2>
          <div className="h-px w-12 bg-[#C8A45D] mx-auto"></div>
        </motion.div>

        {/* Bento Grid - 30/70 Split */}
        <div className="h-[calc(100%-80px)] grid grid-cols-1 lg:grid-cols-10 gap-4">
          
          {/* Left Column - 30% */}
          <div className="lg:col-span-3 grid grid-rows-2 gap-4">
            
            {/* Editorial Card - Medium */}
            <motion.div 
              className="relative border border-[#D9C8A3] rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -3 }}
            >
              {/* Simple corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#C8A45D] rounded-tr-lg"></div>
              
              <h3 className="font-serif text-lg text-[#3F2A1D] mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C8A45D] rounded-full"></div>
                {cards[0].title}
              </h3>
              
              <div className="flex items-start gap-4">
                {/* Editor Avatar */}
                {cards[0].image && cards[0].imageSrc && (
                  <div className="w-16 h-16 rounded-full border-2 border-white shadow overflow-hidden flex-shrink-0">
                    <Image
                      src={cards[0].imageSrc}
                      alt={cards[0].title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {renderCardContent(cards[0])}
              </div>
            </motion.div>

            {/* Mission Card - Small */}
            <motion.div 
              className="relative border border-[#D9C8A3] rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={1}
              whileHover={{ rotate: 0.5, transition: { duration: 0.2 } }}
            >
              {/* Background Image for mission card */}
              {cards[1].image && cards[1].imageSrc && (
                <div className="absolute inset-0">
                  <Image
                    src={cards[1].imageSrc}
                    alt={cards[1].title}
                    fill
                    className="object-cover opacity-10"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              
              <h3 className="font-serif text-base text-[#3F2A1D] mb-3 flex items-center gap-2 relative z-10">
                <div className="w-1.5 h-1.5 bg-[#C8A45D]"></div>
                {cards[1].title}
              </h3>
              <div className="relative z-10">
                {renderContent(cards[1].content)}
              </div>
            </motion.div>
          </div>

          {/* Right Column - 70% */}
          <div className="lg:col-span-7 grid grid-cols-2 grid-rows-2 gap-4">
            
            {/* Aims Card - Large (2x2) */}
            <motion.div 
              className="col-span-2 row-span-1 border border-[#D9C8A3] rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={2}
              whileHover={{ scale: 1.005 }}
            >
              {/* Background Image for aims card */}
              {cards[2].image && cards[2].imageSrc && (
                <div className="absolute inset-0">
                  <Image
                    src={cards[2].imageSrc}
                    alt={cards[2].title}
                    fill
                    className="object-cover opacity-10"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              
              {/* Subtle background pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/80"></div>
              
              <div className="relative z-10">
                <h3 className="font-serif text-xl text-[#3F2A1D] mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#C8A45D]"></div>
                  {cards[2].title}
                </h3>
                
                {renderCardContent(cards[2])}
              </div>
            </motion.div>

            {/* Stats Card - Medium */}
            <motion.div 
              className="relative border border-[#D9C8A3] rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={3}
              whileHover={{ y: -4 }}
            >
              {/* Background Image for stats card */}
              {cards[3].image && cards[3].imageSrc && (
                <div className="absolute inset-0">
                  <Image
                    src={cards[3].imageSrc}
                    alt={cards[3].title}
                    fill
                    className="object-cover opacity-10"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              
              <h3 className="font-serif text-base text-[#3F2A1D] mb-4 flex items-center gap-2 relative z-10">
                <div className="w-1.5 h-1.5 bg-[#6B4A2E]"></div>
                {cards[3].title}
              </h3>
              
              <div className="relative z-10">
                {renderCardContent(cards[3])}
              </div>
            </motion.div>

            {/* Themes Card - Small with Image */}
            <motion.div 
              className="border border-[#D9C8A3] rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={4}
              whileHover={{ rotate: -0.5, transition: { duration: 0.2 } }}
            >
              {/* Background Image for themes card */}
              {cards[4].image && cards[4].imageSrc && (
                <div className="absolute inset-0">
                  <Image
                    src={cards[4].imageSrc}
                    alt={cards[4].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F6F1E8]/80 to-white/70"></div>
                </div>
              )}
              
              <h3 className="font-serif text-base text-[#3F2A1D] mb-4 relative z-10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#C8A45D]"></div>
                {cards[4].title}
              </h3>
              
              <div className="relative z-10">
                {renderCardContent(cards[4])}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Minimal bottom indicator */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-flex items-center gap-2 text-[#7A6F63] text-xs">
            <div className="w-6 h-px bg-[#C8A45D]"></div>
            <span>International • Peer-Reviewed • Open Access</span>
            <div className="w-6 h-px bg-[#C8A45D]"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}