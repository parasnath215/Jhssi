"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Icon from "@/components/Icons";

export default function SubmissionCompliance() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const complianceItems = [
    {
      id: 1,
      title: "Original Work",
      description: "The submission has not been previously published, nor is it before another journal for consideration.",
      icon: <Icon name="originalwork" className="w-32 h-32" />
    },
    {
      id: 2,
      title: "File Format",
      description: "Submission file is in OpenOffice, Microsoft Word, or RTF document file format.",
      icon: <Icon name="fileformat" className="w-32 h-32" />
    },
    {
      id: 3,
      title: "References",
      description: "URLs for the references have been provided where available.",
      icon: <Icon name="references" className="w-32 h-32" />
    },
    {
      id: 4,
      title: "Formatting",
      description: "Text is single-spaced; uses 12-point font; employs italics rather than underlining.",
      icon: <Icon name="formatting" className="w-32 h-32" />  
    },
    {
      id: 5,
      title: "Illustrations",
      description: "All illustrations, figures, and tables are placed within the text at appropriate points.",
      icon: <Icon name="illustrations" className="w-32 h-32" /> 
    },
    {
      id: 6,
      title: "Guidelines Adherence",
      description: "Text adheres to stylistic and bibliographic requirements outlined in Author Guidelines.",
      icon: <Icon name="guidelines" className="w-32 h-32" />  
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
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-4">
              Submission Compliance Checklist
            </h2>
            <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
            <p className="text-[#4A4036] text-lg mt-4 max-w-3xl mx-auto">
              Submissions may be returned to authors that do not adhere to these guidelines.
            </p>
          </motion.div>

          {/* Flip Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceItems.map((item, index) => (
              <div 
                key={item.id} 
                className="h-full min-h-[200px] perspective-1000"
                onMouseEnter={() => setActiveCard(item.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ 
                    rotateY: activeCard === item.id ? 180 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Front of Card */}
                  <div className="absolute inset-0 backface-hidden bg-white border border-[#E6DDCF] rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center h-full justify-between">
                      <motion.div 
                        className="text-4xl -mt-6"
                        animate={{
                          rotate: activeCard === item.id ? [0, 360] : 0,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="font-serif text-xl text-[#3F2A1D] mb-3">
                        {item.title}
                      </h3>
                      <div className="text-[#7A6F63] text-sm">
                        Hover to flip
                      </div>
                    </div>
                  </div>

                  {/* Back of Card */}
<div 
  className="absolute inset-0 backface-hidden bg-white border border-[#C8A45D] rounded-xl p-0 shadow-md flex overflow-hidden"
  style={{ transform: 'rotateY(180deg)' }}
>
  {/* Left 50% - Image Section */}
  <div className="w-1/2 relative">
    
      <div className="w-full h-full bg-gradient-to-br from-[#F6F1E8] to-[#E6DDCF] flex items-center justify-center">
        <div className="text-4xl">{item.icon}</div>
      </div>
  
    {/* Overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
  </div>
  
  {/* Right 50% - Content Section */}
  <div className="w-1/2 p-4 flex flex-col justify-center">
    <h3 className="font-serif text-lg text-[#3F2A1D] mb-3">
      {item.title}
    </h3>
    <p className="text-[#4A4036] text-sm">
      {item.description}
    </p>
    
    {/* Optional: Add action button or additional info */}
    
  </div>
</div>
</motion.div>
              </div>
            ))}
          </div>

          {/* Warning Message */}
          <motion.div 
            className="mt-12 bg-gradient-to-r from-[#F6F1E8] to-[#EFE6D8] border-l-4 border-[#C8A45D] p-6 rounded-r-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full border border-[#C8A45D] flex items-center justify-center">
                <span className="text-[#6B4A2E] font-bold">!</span>
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-2">Important Notice</h4>
                <p className="text-[#4A4036]">
                  Authors must check all compliance items before submission. Non-compliant submissions will be returned without review.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}