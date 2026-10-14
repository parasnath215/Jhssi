"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function EditorialBoardSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const leadership = [
    {
      role: "Patron",
      name: "Prof. H.R. Nagendra",
      affiliation: "Chancellor, S-VYASA University, Bengaluru",
      email: "",
      highlight: true
    },
    {
      role: "Editor-in-Chief",
      name: "Prof. Ripu Sudan Singh",
      affiliation: "Babasaheb Bhimrao Ambedkar Central University, Lucknow",
      email: "journalofhssi@gmail.com",
      image: "/photos/ripu-singh.jpg",
      highlight: true
    },
    {
      role: "Associate Editor",
      name: "Dr. Siddharth Mukerji",
      affiliation: "Babasaheb Bhimrao Ambedkar Central University, Lucknow",
      email: "butku9@gmail.com",
      highlight: false
    },
    {
      role: "Associate Editor",
      name: "Dr. Ranjan Singh",
      affiliation: "Associate Professor / Academician",
      email: "Ranjan24ap@gmail.com",
      highlight: false
    }
  ];

  const internationalBoard = [
    {
      name: "Oscar Perez de la Fuente",
      affiliation: "Carlos III University, Madrid",
      email: "oscar@der-pu.uc3m.es"
    },
    {
      name: "Alexander Sungurov",
      affiliation: "Higher School of Economics, Russia",
      email: "asungurov@mail.ru"
    },
    {
      name: "Dr. Sherko Kermanj",
      affiliation: "Koya University, Iraq / Ulster University, UK",
      email: "skirmanj@gmail.com"
    }
  ];

  const nationalBoard = [
    {
      name: "Prof. A.K. Mohapatra",
      affiliation: "Jawaharlal Nehru University (JNU), New Delhi",
      email: "aswinijnu@gmail.com"
    },
    {
      name: "Prof. Harish K. Thakur",
      affiliation: "Himachal Pradesh University, Shimla",
      email: ""
    },
    {
      name: "Prof. Madhurendra Kumar",
      affiliation: "Kumaun University, Nainital",
      email: "professormadhurendra@gmail.com"
    },
    {
      name: "Achal Darbari",
      affiliation: "Investment Banker, Pune",
      email: "achal.darbari@gmail.com"
    },
    {
      name: "Prof. Raghvendra Singh",
      affiliation: "University of Lucknow",
      email: "rpspolsc@gmail.com"
    }
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-[#F6F1E8]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center">
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

        {/* Editorial Leadership: Patron, Editor-in-Chief & Associate Editors */}
        <div>
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl text-[#3F2A1D]">
              Editorial Leadership
            </h3>
            <p className="text-[#7A6F63] text-sm mt-1">Patron, Editor-in-Chief & Associate Editors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((person, index) => (
              <motion.div
                key={index}
                className="bg-white border border-[#E6DDCF] rounded-2xl p-6 flex flex-col justify-between hover:border-[#C8A45D] hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-[#F6F1E8] border border-[#E6DDCF] text-[#6B4A2E] text-xs font-semibold rounded-full uppercase tracking-wider">
                      {person.role}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B4A2E] to-[#3F2A1D] text-white flex items-center justify-center font-bold text-sm">
                      {person.name.replace(/^(Prof\.|Dr\.)\s*/, "").charAt(0)}
                    </div>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#3F2A1D] mb-1">
                    {person.name}
                  </h4>
                  {person.affiliation && (
                    <p className="text-[#7A6F63] text-sm leading-relaxed mb-4">
                      {person.affiliation}
                    </p>
                  )}
                </div>

                {person.email && (
                  <div className="pt-3 border-t border-[#F0E8DC]">
                    <a
                      href={`mailto:${person.email}`}
                      className="inline-flex items-center gap-2 text-xs text-[#6B4A2E] hover:text-[#3F2A1D] transition-colors truncate max-w-full font-medium"
                      title={person.email}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{person.email}</span>
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Editorial Board - International */}
        <motion.div 
          className="bg-white border border-[#E6DDCF] rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl text-[#3F2A1D] mb-2">
              Editorial Board - International
            </h3>
            <div className="h-0.5 w-16 bg-[#C8A45D] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalBoard.map((member, index) => (
              <motion.div
                key={index}
                className="border border-[#E6DDCF] rounded-xl p-6 bg-[#FAF7F2] hover:border-[#C8A45D] hover:bg-white transition-all shadow-xs"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#6B4A2E] to-[#3F2A1D] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {member.name.replace(/^(Prof\.|Dr\.)\s*/, "").charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base font-bold text-[#3F2A1D] mb-1">
                      {member.name}
                    </h4>
                    <p className="text-[#7A6F63] text-sm mb-3 leading-relaxed">
                      {member.affiliation}
                    </p>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#6B4A2E] hover:underline font-medium truncate max-w-full"
                        title={member.email}
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Editorial Board - National */}
        <motion.div 
          className="bg-white border border-[#E6DDCF] rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl text-[#3F2A1D] mb-2">
              Editorial Board - National
            </h3>
            <div className="h-0.5 w-16 bg-[#C8A45D] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalBoard.map((member, index) => (
              <motion.div
                key={index}
                className="border border-[#E6DDCF] rounded-xl p-6 bg-[#FAF7F2] hover:border-[#C8A45D] hover:bg-white transition-all shadow-xs"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.8 + index * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#F6F1E8] to-[#EFE6D8] border border-[#E6DDCF] flex items-center justify-center font-bold text-[#6B4A2E] text-base">
                    {member.name.replace(/^(Prof\.|Dr\.)\s*/, "").charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base font-bold text-[#3F2A1D] mb-1">
                      {member.name}
                    </h4>
                    <p className="text-[#7A6F63] text-sm mb-3 leading-relaxed whitespace-pre-line">
                      {member.affiliation}
                    </p>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#6B4A2E] hover:underline font-medium truncate max-w-full"
                        title={member.email}
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}