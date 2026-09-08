"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function DisclaimerEditor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
    <section ref={ref} className="py-16 px-6 bg-[#F6F1E8]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2
              }
            }
          }}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="font-serif text-3xl text-[#3F2A1D] mb-6"
              //variants={fadeInUp}
            >
              Editorial Authority
            </motion.h2>
            <motion.div 
              className="h-px w-20 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "80px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          <motion.div 
            className="bg-white rounded-2xl p-8 md:p-10 border border-[#E6DDCF] shadow-sm"
            //variants={fadeInUp}
            whileHover={{ 
              boxShadow: "0 15px 40px rgba(63, 42, 29, 0.08)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Editor Image */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#6B4A2E] to-[#3F2A1D] flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">RSS</span>
                    {/* Replace with actual image:
                    <Image
                      src="/photos/editor.jpg"
                      alt="Ripu Sudan Singh"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                    */}
                  </div>
                </div>
              </motion.div>

              {/* Editor Details */}
              <div className="flex-grow text-center md:text-left">
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-serif text-2xl text-[#6B4A2E] mb-2">
                    Editor in Chief
                  </h3>
                  <h4 className="font-serif text-3xl text-[#3F2A1D] mb-3">
                    Ripu Sudan Singh
                  </h4>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-[#4A4036] text-lg">
                    Professor of Political Science
                  </p>
                  <p className="text-[#7A6F63]">
                    Babasaheb Bhimrao Ambedkar Central University
                  </p>
                  <p className="text-[#7A6F63]">
                    Lucknow, India
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Signature Line */}
            <motion.div 
              className="mt-8 pt-8 border-t border-[#E6DDCF] text-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-block">
                <div className="h-px w-48 bg-[#C8A45D] mb-2"></div>
                <p className="text-[#7A6F63] text-sm italic">Official Signature</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}