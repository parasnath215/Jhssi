"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function EditorInChiefSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const achievements = [
    "M.A., M.Phil., Ph.D. from JNU, New Delhi",
    "Specializes in West Asian Politics",
    "Published in reputed national/international journals",
    "Presented papers in 5+ countries",
    "Former NCC Captain",
    "Field correspondent for Nav Bharat Times"
  ];

  const leadershipRoles = [
    "Head of Department (Political Science, Sanskrit, Public Administration)",
    "Dean of Ambedkar School for Social Sciences",
    "Dean of School of Education",
    "Dean of School of Languages & Literature",
    "Dean of Student Welfare",
    "Controller of Examinations",
    "Member of UGC Fellowship Committee",
    "Member of MAKAIAS, Ministry of Culture"
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
          {/* Section Title */}
          <div className="text-center mb-12">
            <motion.h2 
              className="font-serif text-3xl md:text-4xl text-[#3F2A1D] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              Editor in Chief
            </motion.h2>
            <motion.div 
              className="h-px w-20 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "80px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Bento Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Column 1: Profile Card */}
            <motion.div 
              className="lg:col-span-1 border border-[#E6DDCF] rounded-xl overflow-hidden bg-white shadow-sm"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Profile Image */}
              <div className="h-64 bg-gradient-to-br from-[#F6F1E8] to-[#EFE6D8] flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-4 border-white shadow-xl overflow-hidden">
                  <Image
                    src="/photos/ripu-singh.jpg"
                    alt="Prof. Ripu Sudan Singh"
                    width={250}
                    height={250}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-2xl text-[#3F2A1D] mb-2">Prof. Ripu Sudan Singh</h3>
                <p className="text-[#6B4A2E] font-medium mb-1">Professor of Political Science</p>
                <p className="text-[#7A6F63] text-sm mb-4">Babasaheb Bhimrao Ambedkar Central University</p>
                <p className="text-[#4A4036] text-sm">Lucknow, India</p>
              </div>
            </motion.div>

            {/* Column 2: Academic Profile */}
            <motion.div 
              className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Education & Specialization */}
              <div className="border border-[#E6DDCF] rounded-xl pt-6 pr-6 pl-6 pb-6 bg-[#F6F1E8]">
                
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-4 flex items-center gap-2">
                  Academic Profile
                </h4>
                <ul className="space-y-3">
                  {achievements.slice(0, 3).map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 text-[#4A4036] text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <span className="text-[#C8A45D] mt-1">•</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <br />
                 <img src="/photos/icon4.svg" alt="Achievements" className="w-full h-48 object-cover mb-0" />
              
               </div>

              {/* International Experience */}
              <div className="border border-[#E6DDCF] rounded-xl p-6 bg-white">
                <h4 className="font-serif text-lg text-[#3F2A1D] mb-4 flex items-center gap-2">
                  International Exposure
                </h4>
                <ul className="space-y-3">
                  {achievements.slice(3).map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 text-[#4A4036] text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="text-[#C8A45D] mt-1">•</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <img src="/photos/icon3.svg" alt="Achievements" className="w-full h-48 object-cover mt-8" />
             
              </div>

            </motion.div>
              
          </div>

          {/* Full Width Card: Leadership Roles */}
          <motion.div 
            className="border border-[#E6DDCF] rounded-xl p-8 bg-white shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="font-serif text-xl text-[#3F2A1D] mb-6 text-center">
              Leadership & Administrative Roles
            </h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {leadershipRoles.map((role, index) => (
                <motion.div
                  key={index}
                  className="bg-[#F6F1E8] border border-[#E6DDCF] rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-[#4A4036] text-sm">{role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}