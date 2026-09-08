// src/app/publisher-contact/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icons";

export default function PublisherContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const contactDetails = [
    {
      type: "Publisher",
      name: "Professor Ripu Sudan Singh",
      address: "C-77, Raibareilly Road, South City, Lucknow-226025, Uttar Pradesh, India",
      email: "journalofhssi@gmail.com",
      icon: <Icon name="acknowledgement" className="w-40 h-40" />
    },
    {
      type: "Principal Contact",
      name: "Journal of Humanities and Social Sciences Invention",
      address: null,
      email: "editorjhssi@gmail.com",
      icon: <Icon name="references" className="w-40 h-40" />
    },
    {
      type: "Support Contact",
      name: "Susheel Kumar",
      address: null,
      email: "info@mripub.com",
      phone: "+91 9696263646",
      icon: <Icon name="materials" className="w-40 h-40" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="bg-white overflow-x-hidden">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/photos/img4.jpeg"
            alt="Publisher & Contact Background"
            fill
            className="object-cover object-left"
            priority
            style={{ objectPosition: "70% center" }}
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-8"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              </motion.div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-xs border border-[#C8A45D] rounded-full text-xs font-bold text-[#3F2A1D] shadow-xs mb-3">
              <span>ISSN: 2581-8791 (Online)</span>
            </div>

            <motion.h1 
              className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Publisher & Contact Details
            </motion.h1>
            
            <motion.div 
              className="h-px w-32 bg-[#C8A45D] mx-auto mb-10"
              initial={{ width: 0 }}
              animate={{ width: "128px" }}
              transition={{ delay: 0.5, duration: 1 }}
            />
            
            <motion.p 
              className="text-[#4A4036] text-lg md:text-xl max-w-3xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Official contact information for JHSSI <br /> Get in touch with our editorial and support teams
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Introduction Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF] mx-auto max-w-4xl">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8 text-center">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                <p className="text-[#4A4036] text-lg leading-relaxed text-center">
                  For all inquiries related to the Journal of Humanities and Social Sciences Invention, please use the appropriate contact information below based on the nature of your query.
                </p>
                
                <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF]">
                  <p className="text-[#4A4036] leading-relaxed italic text-center">
                    "Our team is committed to responding to your queries promptly and providing the assistance you need for your scholarly publishing journey."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Cards */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              {contactDetails.map((contact, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-4xl mx-auto justify-center flex -mt-8F">{contact.icon}</div>
                  <h3 className="font-serif text-xl text-[#3F2A1D] mb-6 text-center">
                    {contact.type}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#3F2A1D] mb-2">Name</h4>
                      <p className="text-[#4A4036]">{contact.name}</p>
                    </div>
                    
                    {contact.address && (
                      <div>
                        <h4 className="font-semibold text-[#3F2A1D] mb-2">Address</h4>
                        <p className="text-[#4A4036]">{contact.address}</p>
                      </div>
                    )}
                    
                    {contact.email && (
                      <div>
                        <h4 className="font-semibold text-[#3F2A1D] mb-2">Email</h4>
                        <Link
                          href={`mailto:${contact.email}`}
                          className="text-[#6B4A2E] hover:text-[#C8A45D] transition-colors"
                        >
                          {contact.email}
                        </Link>
                      </div>
                    )}
                    
                    {contact.phone && (
                      <div>
                        <h4 className="font-semibold text-[#3F2A1D] mb-2">Phone</h4>
                        <Link
                          href={`tel:${contact.phone.replace(/\D/g, '')}`}
                          className="text-[#6B4A2E] hover:text-[#C8A45D] transition-colors"
                        >
                          {contact.phone}
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Response Information */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Response Information
              </h2>
              
              <div className="grid md:grid-cols-3 gap-10">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-[#F6F1E8] rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">📨</span>
                  </div>
                  <h3 className="font-semibold text-lg text-[#3F2A1D] mb-4">Email Response</h3>
                  <p className="text-[#4A4036]">
                    Typically within 2-3 business days for general inquiries
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-[#F6F1E8] rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-lg text-[#3F2A1D] mb-4">Manuscript Queries</h3>
                  <p className="text-[#4A4036]">
                    3-5 business days for submission and review process questions
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-[#F6F1E8] rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">🕐</span>
                  </div>
                  <h3 className="font-semibold text-lg text-[#3F2A1D] mb-4">Business Hours</h3>
                  <p className="text-[#4A4036]">
                    Monday to Friday, 9:00 AM to 5:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form CTA */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF] text-center">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                Need to Send a Formal Query?
              </h2>
              
              <p className="text-[#4A4036] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                For detailed inquiries, manuscript submissions, or editorial questions, please use the appropriate email address above. Ensure to include relevant details for faster response.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="mailto:sgedlucknow@gmail.com"
                  className="px-10 py-4 bg-[#6B4A2E] text-white font-semibold rounded-full hover:bg-[#5A3D26] transition-colors shadow-lg text-lg"
                >
                  Email Editorial Team
                </Link>
                <Link
                  href="mailto:info@mripub.com"
                  className="px-10 py-4 border-2 border-[#6B4A2E] text-[#6B4A2E] font-semibold rounded-full hover:bg-[#6B4A2E]/10 transition-colors text-lg"
                >
                  Email Support Team
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Related Links */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Quick Links
              </h2>
              
              <div className="grid md:grid-cols-4 gap-8">
                <Link href="/authors/author-guidelines" className="group">
                  <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-2xl mb-4">
                        <Icon name="guidelines" className="w-48 h-48 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-[#3F2A1D] mb-2">
                      Author Guidelines
                    </h3>
                  </div>
                </Link>
                
                <Link href="/author/dashboard" className="group">
                  <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-2xl mb-4"><Icon name="fileformat" className="w-48 h-48 mx-auto" /></div>
                    <h3 className="font-semibold text-[#3F2A1D] mb-2">
                      Submit Manuscript
                    </h3>
                  </div>
                </Link>
                
                <Link href="/reviewers/editorial-peer-review-process" className="group">
                  <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-2xl mb-4"><Icon name="materials" className="w-48 h-48 mx-auto" /></div>
                    <h3 className="font-semibold text-[#3F2A1D] mb-2">
                      Review Process
                    </h3>
                  </div>
                </Link>
                
                <Link href="/publication-ethics" className="group">
                  <div className="bg-[#F6F1E8] p-6 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-2xl mb-4"><Icon name="formatting" className="w-48 h-48 mx-auto" /></div>
                    <h3 className="font-semibold text-[#3F2A1D] mb-2">
                      Publication Ethics
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Final Note */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF] text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="inline-block p-4 bg-[#F6F1E8] rounded-full mb-6">
              <span className="text-2xl">ℹ️</span>
            </div>
            <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
              Contact Guidelines
            </h3>
            <p className="text-[#4A4036] max-w-2xl mx-auto">
              When contacting us, please include your name, affiliation, and clear subject line. For manuscript-related queries, include your manuscript ID if applicable. We appreciate your patience as we respond to all inquiries.
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}