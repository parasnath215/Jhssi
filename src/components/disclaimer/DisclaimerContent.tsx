"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Icon from "@/components/Icons";

export default function DisclaimerContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const disclaimerSections = [
    {
      title: "Editorial Responsibility",
      content: "Journal of Humanities and Social Sciences Invention shall not take any responsibility for the contents of articles published in the journal, and all such responsibility shall lie with the author/s. The opinions expressed in the articles are solely of the author/s and Journal of Humanities and Social Sciences Invention may not agree with such opinions in part or in full.",
      icon: <Icon name="guidelines" className="w-12 h-12" />
    },
    {
      title: "Peer Review Process",
      content: "All the articles submitted for publication in Journal of Humanities and Social Sciences Invention are peer reviewed for authenticity, ethical issues and usefulness. Decision of the reviewers shall be final. Authors are solely responsible for originality of the published work.",
      icon: <Icon name="figures" className="w-12 h-12" />
    },
    {
      title: "Ethical Standards",
      content: "Journal of Humanities and Social Sciences Invention shall uphold the highest ethical standards of scientific publications.",
      icon: <Icon name="formatting" className="w-12 h-12" />
    },
    {
      title: "Copyright & Reproduction",
      content: "The Journal retains the copyrights of all material published in the issue. However, reproduction of the published material in the part or total in any form is permissible with due acknowledgement of the source as per ethical norms.",
      icon: <Icon name="materials" className="w-12 h-12" />
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Disclaimer Sections Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {disclaimerSections.map((section, index) => (
              <motion.div 
                key={index}
                className="border border-[#E6DDCF] rounded-xl p-8 bg-[#F6F1E8] hover:border-[#C8A45D] transition-colors"
               // variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(63, 42, 29, 0.05)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-white border border-[#E6DDCF] flex items-center justify-center text-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {section.icon}
                  </motion.div>
                  <h3 className="font-serif text-xl text-[#3F2A1D]">
                    {section.title}
                  </h3>
                </div>
                
                <p className="text-[#4A4036] leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Connecting Line */}
          <motion.div 
            className="mt-12 relative"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[#D9C8A3] to-transparent">
              <motion.div 
                className="absolute top-0 left-0 w-16 h-px bg-[#C8A45D]"
                animate={{
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.5
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}