"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

export default function EditorialBoardSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeProfile, setActiveProfile] = useState(0);

  const boardMembers = [
    {
      id: 1,
      name: "Prof Harish K. Thakur",
      position: "Chairman, Department of Defence & Strategic Studies",
      affiliation: "Himachal Pradesh University, Shimla",
      details: "Former Chairman of Political Science Department. Editor of HPU Journal. Author of 15+ books. Specializes in foreign policy and tribal studies.",
      email: "",
      image: "/photos/harish-thakur.jpg"
    },
    {
      id: 2,
      name: "Prof Madhurendra Kumar",
      position: "Professor of Political Science",
      affiliation: "Kumaun University, Nainital",
      details: "33 years teaching experience. MA from JNU, PhD from BHU. Supervised 28 PhD students. Former Editor of Indian Journal of Political Science.",
      email: "professormadhurendra@gmail.com",
      image: "/photos/madhurendra-kumar.jpg"
    },
    {
      id: 3,
      name: "Dr. Siddhartha Mukerji",
      position: "Associate Professor of Political Science",
      affiliation: "BBAU, Lucknow",
      details: "UGC/JRF/NET qualifier. Published in EPW, Sage journals. Baden Wurttemberg Fellow. International projects with LSE, Stockholm University.",
      email: "",
      image: "/photos/siddhartha-mukerji.jpg"
    }
  ];

  const internationalBoard = [
    { name: "Prof Aswini Mohapatra", affiliation: "JNU, New Delhi", email: "aswinijnu@gmail.com" },
    { name: "Alexander Sungurov", affiliation: "Higher School of Economics, Russia", email: "asungurov@mail.ru" },
    { name: "Oscar Perez de la Fuenta", affiliation: "Carlos III University, Madrid", email: "oscar@der-pu.uc3m.es" },
    { name: "Dr. Anja Mihr", affiliation: "OSCE Academy, Kyrgyzstan", email: "amihr@governance-platform.org" },
    { name: "Dr. Sherko Krimanj", affiliation: "Koya University, Iraq / Ulster University, UK", email: "skirmanj@gmail.com" },
    { name: "Achal Darbari", affiliation: "Investment Banker, Pune", email: "achal.darbari@gmail.com" },
    { name: "Prof. Raghvendra Pratap Singh", affiliation: "University of Lucknow", email: "rpspolsc@gmail.com" }
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-[#F6F1E8]">
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
              Editorial Board
            </motion.h2>
            <motion.div 
              className="h-px w-24 bg-[#C8A45D] mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Featured Profiles Carousel */}
          <div className="mb-16">
            <div className="flex justify-center gap-4 mb-8">
              {boardMembers.map((member, index) => (
                <motion.button
                  key={member.id}
                  onClick={() => setActiveProfile(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeProfile === index ? 'bg-[#6B4A2E] text-white' : 'bg-white text-[#4A4036] hover:bg-[#EFE6D8]'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {member.name.split(' ')[0]}
                </motion.button>
              ))}
            </div>

            {/* Profile Display */}
            <div className="relative h-96">
              {boardMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: index > activeProfile ? 100 : -100 }}
                  animate={{ 
                    opacity: activeProfile === index ? 1 : 0,
                    x: activeProfile === index ? 0 : (index > activeProfile ? 100 : -100)
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white border border-[#E6DDCF] rounded-2xl p-8 h-full">
                    <div className="flex flex-col md:flex-row gap-8 h-full">
                      {/* Image */}
                      <div className="md:w-1/3">
                        <div className="w-48 h-48 mx-auto md:mx-0 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                          <div className="w-full h-full bg-gradient-to-br from-[#F6F1E8] to-[#EFE6D8] flex items-center justify-center">
                            <span className="text-4xl text-[#6B4A2E] font-bold">
                              {member.name.charAt(0)}
                            </span>
                            {/* <Image
                              src={member.image}
                              alt={member.name}
                              width={192}
                              height={192}
                              className="object-cover w-full h-full"
                            /> */}
                          </div>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="md:w-2/3">
                        <h3 className="font-serif text-2xl text-[#3F2A1D] mb-2">
                          {member.name}
                        </h3>
                        <p className="text-[#6B4A2E] font-medium mb-1">
                          {member.position}
                        </p>
                        <p className="text-[#7A6F63] text-sm mb-6">
                          {member.affiliation}
                        </p>
                        
                        <p className="text-[#4A4036] mb-6 leading-relaxed">
                          {member.details}
                        </p>
                        
                        {member.email && (
                          <div className="flex items-center gap-2 text-[#7A6F63] text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {member.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* International Board Grid */}
          <motion.div 
            className="bg-white border border-[#E6DDCF] rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="font-serif text-2xl text-[#3F2A1D] mb-8 text-center">
              International Editorial Board Members
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internationalBoard.map((member, index) => (
                <motion.div
                  key={index}
                  className="border border-[#E6DDCF] rounded-xl p-6 hover:border-[#C8A45D] transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#F6F1E8] to-[#EFE6D8] flex items-center justify-center">
                      <span className="text-[#6B4A2E] font-bold">{member.name.charAt(0)}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-serif text-lg text-[#3F2A1D] mb-1">
                        {member.name}
                      </h4>
                      <p className="text-[#7A6F63] text-sm mb-2">
                        {member.affiliation}
                      </p>
                      {member.email && (
                        <p className="text-[#4A4036] text-xs truncate">
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}