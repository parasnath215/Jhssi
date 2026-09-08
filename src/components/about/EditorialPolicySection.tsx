"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { easeOut } from "framer-motion";

export default function EditorialPolicySection() {
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

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          //variants={fadeInUp}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="font-serif text-3xl text-[#3F2A1D] mb-4"
              //variants={fadeInUp}
            >
              Editorial Policy
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
            variants={slideInLeft

            }>
              <div className="relative">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed text-lg">
                    JHSSI follows a <span className="font-semibold text-[#6B4A2E]">double-blind peer-review process</span> to ensure academic quality, objectivity, and ethical integrity, and adheres strictly to international standards concerning publication ethics, plagiarism prevention, transparency, and academic responsibility.
                  </p>
                </div>
                
                {/* Animated border effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-transparent"
                  animate={{
                    borderColor: ["#E6DDCF", "#C8A45D", "#E6DDCF"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            <motion.div variants={slideInRight}>
              <div className="bg-gradient-to-br from-[#F6F1E8] to-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]">
                <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {[
                    "Double-blind peer review process",
                    "International editorial standards",
                    "Plagiarism detection & prevention",
                    "Transparent publication timeline",
                    "Ethical guidelines adherence",
                    "Academic responsibility framework"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-[#4A4036]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <motion.div 
                        className="w-2 h-2 bg-[#C8A45D] rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}