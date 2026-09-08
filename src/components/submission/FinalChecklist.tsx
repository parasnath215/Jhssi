"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Icon from "../Icons";

export default function FinalChecklist() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const checklistItems = [
    {
      id: 1,
      title: "File Format",
      description: "OpenOffice, Microsoft Word, or RTF document file format",
      status: "required",
      icon: <Icon name="fileformat" className="w-20 h-20" />
    },
    {
      id: 2,
      title: "Spacing & Font",
      description: "Single-spaced, 12-point font, italics instead of underlining",
      status: "required",
      icon: <Icon name="formatting" className="w-20 h-20" />
    },
    {
      id: 3,
      title: "URLs Provided",
      description: "URLs for references provided where available",
      status: "recommended",
      icon: <Icon name="references" className="w-20 h-20" />
    },
    {
      id: 4,
      title: "Figure Placement",
      description: "All illustrations placed within text at appropriate points",
      status: "required",
      icon: <Icon name="figures" className="w-20 h-20" />
    },
    {
      id: 5,
      title: "Style Adherence",
      description: "Text follows stylistic and bibliographic requirements",
      status: "required",
      icon: <Icon name="formatting" className="w-20 h-20" />
    },
    {
      id: 6,
      title: "Originality Check",
      description: "Submission not previously published or under consideration elsewhere",
      status: "required",
      icon: <Icon name="originality" className="w-20 h-20" />
    }
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-[#F6F1E8]">
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
          <div className="text-center mb-12">
            <motion.h2 
              className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              Final Submission Checklist
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.p 
              className="text-[#4A4036] text-lg mt-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              Ensure all items are checked before final submission
            </motion.p>
          </div>

          {/* Bento Grid Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {checklistItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={`rounded-xl border border-[#E6DDCF] bg-white p-6 shadow-sm ${index === 2 ? 'lg:col-span-1' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  borderColor: "#C8A45D",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="text-2xl"
                      animate={{
                        rotate: isInView ? [0, 360] : 0,
                      }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'required' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <motion.div 
                    className="w-6 h-6 rounded-full border-2 border-[#E6DDCF] flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.2, borderColor: "#C8A45D" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-[#C8A45D]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 0 } : { scale: 0 }}
                    />
                  </motion.div>
                </div>
                
                <h3 className="font-serif text-lg text-[#3F2A1D] mb-3">
                  {item.title}
                </h3>
                
                <p className="text-[#4A4036] text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="bg-gradient-to-r from-[#6B4A2E] to-[#3F2A1D] rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
          >
            <div className="max-w-3xl mx-auto">
              <motion.h3 
                className="font-serif text-3xl text-white mb-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1 }}
              >
                Ready to Submit Your Manuscript?
              </motion.h3>
              
              <motion.p 
                className="text-[#EFE6D8] text-lg mb-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2 }}
              >
                Ensure all guidelines are followed for smooth submission and review process.
              </motion.p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="/author/dashboard"
                  className="px-8 py-3 bg-white text-[#3F2A1D] font-medium rounded-full hover:bg-[#F6F1E8] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1.4 }}
                >
                  Submit Now
                </motion.a>
                
                <motion.a
                  href="/contact"
                  className="px-8 py-3 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1.6 }}
                >
                  Contact Editorial Office
                </motion.a>
              </div>
              
              <motion.p 
                className="text-[#C8A45D] text-sm mt-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.8 }}
              >
                For questions or clarification, please contact editor@jhssi.org
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}