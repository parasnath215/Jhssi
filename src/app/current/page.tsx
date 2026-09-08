// src/app/current-issue/page.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function CurrentIssuePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [liveArticles, setLiveArticles] = useState<any[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    fetch('/api/articles/published')
      .then(res => res.json())
      .then(data => {
        if (data.articles) {
          setLiveArticles(data.articles);
        }
      })
      .catch(err => console.error('Error loading published articles:', err));
  }, []);

  const issueDetails = {
    volume: "5",
    issue: "2",
    year: "2024",
    title: "Interdisciplinary Perspectives in Social Sciences",
    publicationDate: "June 2024",
    theme: "Digital Transformation & Societal Change",
    issn: "2581-8791",
    doi: "10.32456/jhssi.2024.5.2"
  };

  const featuredArticles = [
    {
      id: 1,
      title: "The Impact of Artificial Intelligence on Social Research Methodologies",
      authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. Elena Petrova"],
      abstract: "This paper explores how AI technologies are transforming traditional social research methods and the ethical implications of these changes.",
      keywords: ["Artificial Intelligence", "Research Methodology", "Ethics", "Digital Transformation"],
      pages: "1-18",
      doi: "10.32456/jhssi.2024.5.2.001",
      downloads: 245,
      citations: 12,
      category: "Research Article"
    },
    {
      id: 2,
      title: "Cultural Heritage Preservation in the Digital Age: A Comparative Study",
      authors: ["Prof. James Wilson", "Dr. Aisha Khan"],
      abstract: "Analysis of digital preservation techniques for cultural heritage across different geographical and political contexts.",
      keywords: ["Cultural Heritage", "Digital Preservation", "Comparative Study", "Technology"],
      pages: "19-35",
      doi: "10.32456/jhssi.2024.5.2.002",
      downloads: 189,
      citations: 8,
      category: "Review Article"
    },
    {
      id: 3,
      title: "Policy Implications of Climate Migration in South Asia",
      authors: ["Dr. Rajesh Kumar", "Prof. Mei Lin", "Dr. Fatima Al-Mansoori"],
      abstract: "Examination of policy frameworks addressing climate-induced migration patterns in South Asian countries.",
      keywords: ["Climate Migration", "Policy Analysis", "South Asia", "Environmental Studies"],
      pages: "36-52",
      doi: "10.32456/jhssi.2024.5.2.003",
      downloads: 312,
      citations: 15,
      category: "Policy Analysis"
    },
    {
      id: 4,
      title: "Digital Humanities and Literary Analysis: New Frontiers",
      authors: ["Dr. Emily Johnson"],
      abstract: "Exploring computational methods in literary analysis and their implications for humanities scholarship.",
      keywords: ["Digital Humanities", "Literary Analysis", "Computational Methods", "Interdisciplinary"],
      pages: "53-68",
      doi: "10.32456/jhssi.2024.5.2.004",
      downloads: 176,
      citations: 6,
      category: "Methodological Study"
    },
    {
      id: 5,
      title: "Social Media and Political Discourse: A Content Analysis",
      authors: ["Dr. Carlos Mendez", "Dr. Sofia Rossi"],
      abstract: "Quantitative analysis of political discourse patterns across major social media platforms.",
      keywords: ["Social Media", "Political Discourse", "Content Analysis", "Communication Studies"],
      pages: "69-85",
      doi: "10.32456/jhssi.2024.5.2.005",
      downloads: 421,
      citations: 21,
      category: "Empirical Study"
    },
    {
      id: 6,
      title: "Book Review: 'The Future of Work in the Digital Economy'",
      authors: ["Prof. David Anderson"],
      abstract: "Critical review of recent scholarship on digital economy and its impact on labor markets.",
      keywords: ["Book Review", "Digital Economy", "Future of Work", "Labor Studies"],
      pages: "86-92",
      doi: "10.32456/jhssi.2024.5.2.006",
      downloads: 98,
      citations: 3,
      category: "Book Review"
    }
  ];

  const specialSections = [
    {
      title: "Editorial",
      content: "Welcome to Volume 5, Issue 2 - Exploring the intersection of technology and society.",
      author: "Editorial Board"
    },
    {
      title: "Special Theme",
      content: "This issue focuses on digital transformation and its multifaceted impact on social structures.",
      author: "Theme Editors"
    },
    {
      title: "Acknowledgements",
      content: "We thank our peer reviewers and editorial team for their valuable contributions.",
      author: "Managing Editor"
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
    <main className="bg-white">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/photos/header2.jpeg"
            alt="Current Issue Background"
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
              <div className="w-16 h-16 mx-auto bg-white rounded-full border-4 border-[#E6DDCF] shadow-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-[#6B4A2E] font-bold">CI</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Current Issue
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
              Volume {issueDetails.volume}, Issue {issueDetails.issue} ({issueDetails.year})
              <br />
              {issueDetails.title}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Issue Details */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white p-10 rounded-xl shadow-lg border border-[#E6DDCF] mx-auto max-w-4xl">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8 text-center">
                Issue Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg text-[#3F2A1D] mb-2">Publication Information</h3>
                      <div className="space-y-2 text-[#4A4036]">
                        <p><span className="font-medium">Volume:</span> {issueDetails.volume}</p>
                        <p><span className="font-medium">Issue:</span> {issueDetails.issue}</p>
                        <p><span className="font-medium">Year:</span> {issueDetails.year}</p>
                        <p><span className="font-medium">Publication Date:</span> {issueDetails.publicationDate}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg text-[#3F2A1D] mb-2">Theme</h3>
                      <p className="text-[#4A4036]">{issueDetails.theme}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg text-[#3F2A1D] mb-2">Identification</h3>
                      <div className="space-y-2 text-[#4A4036]">
                        <p><span className="font-medium">ISSN:</span> {issueDetails.issn}</p>
                        <p><span className="font-medium">DOI:</span> {issueDetails.doi}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg text-[#3F2A1D] mb-2">Access</h3>
                      <div className="space-y-2 text-[#4A4036]">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Open Access
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          CC BY 4.0 License
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Available in PDF & HTML
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Special Sections */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Special Sections
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {specialSections.map((section, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto bg-[#F6F1E8] rounded-full border-2 border-[#E6DDCF] flex items-center justify-center mb-4">
                      <span className="text-xl text-[#6B4A2E] font-bold">{section.title.charAt(0)}</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-[#4A4036] text-center mb-4">
                    {section.content}
                  </p>
                  <p className="text-[#6B4A2E] text-sm text-center font-medium">
                    - {section.author}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Articles */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl text-[#3F2A1D] mb-4">
                Featured Articles
              </h2>
              <div className="h-px w-24 bg-[#C8A45D] mx-auto"></div>
              <p className="text-[#4A4036] mt-6 max-w-2xl mx-auto">
                Research articles published in this issue
              </p>
            </div>

            <div className="space-y-8">
              {/* Dynamic Database-Published Manuscripts */}
              {liveArticles.map((article, index) => (
                <motion.div
                  key={`db-${article.id}`}
                  className="bg-white p-8 rounded-xl shadow-lg border-2 border-emerald-300 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-emerald-50 rounded-lg border border-emerald-300 flex flex-col items-center justify-center">
                        <span className="text-xl text-emerald-800 font-bold">JHSSI</span>
                        <span className="text-[10px] text-emerald-600 font-semibold uppercase">Published</span>
                      </div>
                      <div className="mt-3 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-full text-center">
                        {article.category || 'Peer-Reviewed'}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
                        <div>
                          <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                            Peer-Reviewed & Confirmed by Editorial Board
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-[#3F2A1D] mb-2">
                            {article.title}
                          </h3>
                          <p className="text-[#6B4A2E] font-medium text-sm">
                            Author: {article.author?.name || 'Author'} {article.author?.institution ? `(${article.author.institution})` : ''}
                          </p>
                        </div>
                      </div>

                      <p className="text-[#4A4036] mb-4 text-sm leading-relaxed">
                        {article.abstract}
                      </p>

                      {article.keywords && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.keywords.split(',').map((kw: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#F6F1E8] text-[#6B4A2E] text-xs rounded-full border border-[#E6DDCF]"
                            >
                              #{kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E6DDCF]">
                        <div className="text-xs text-[#4A4036] space-x-3">
                          <span><strong>Vol:</strong> {article.volume || '6'}</span>
                          <span><strong>Issue:</strong> {article.issue || '1'}</span>
                          <span><strong>DOI:</strong> <span className="font-mono text-emerald-800">{article.doi || '10.32456/jhssi'}</span></span>
                        </div>
                        <div className="flex gap-3">
                          <a
                            href={article.fileWithAuthor}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#6B4A2E] hover:bg-[#523720] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <span>Download Full PDF</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="bg-white p-8 rounded-xl shadow-lg border border-[#E6DDCF] hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Article Number & Category */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#F6F1E8] rounded-lg border border-[#E6DDCF] flex flex-col items-center justify-center">
                        <span className="text-2xl text-[#6B4A2E] font-bold">{article.id}</span>
                        <span className="text-xs text-[#4A4036] mt-1">Article</span>
                      </div>
                      <div className="mt-3 px-3 py-1 bg-[#6B4A2E]/10 text-[#6B4A2E] text-xs font-medium rounded-full text-center">
                        {article.category}
                      </div>
                    </div>
                    
                    {/* Article Content */}
                    <div className="flex-grow">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-serif text-xl text-[#3F2A1D] mb-3">
                            {article.title}
                          </h3>
                          <p className="text-[#6B4A2E] font-medium mb-2">
                            {article.authors.join(", ")}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-4 text-sm text-[#4A4036]">
                            <div className="text-center">
                              <div className="font-bold text-[#3F2A1D]">{article.downloads}</div>
                              <div className="text-xs">Downloads</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-[#3F2A1D]">{article.citations}</div>
                              <div className="text-xs">Citations</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[#4A4036] mb-4 text-sm leading-relaxed">
                        {article.abstract}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.keywords.map((keyword, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-[#F6F1E8] text-[#6B4A2E] text-xs rounded-full border border-[#E6DDCF]"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-sm text-[#4A4036]">
                          <span className="font-medium">Pages:</span> {article.pages} • 
                          <span className="font-medium ml-2">DOI:</span> {article.doi}
                        </div>
                        <div className="flex gap-3">
                          <Link
                            href={`/articles/${article.id}`}
                            className="px-4 py-2 bg-[#6B4A2E] text-white text-sm font-medium rounded hover:bg-[#5A3D26] transition-colors"
                          >
                            Read Article
                          </Link>
                          <Link
                            href={`/download/${article.id}`}
                            className="px-4 py-2 border border-[#6B4A2E] text-[#6B4A2E] text-sm font-medium rounded hover:bg-[#6B4A2E]/10 transition-colors"
                          >
                            Download PDF
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Download Full Issue */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF] text-center">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-8">
                Download Full Issue
              </h2>
              
              <div className="mb-10">
                <div className="inline-block p-6 bg-[#F6F1E8] rounded-full mb-6">
                  <span className="text-4xl">📚</span>
                </div>
                <p className="text-[#4A4036] text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                  Download the complete issue in PDF format, including all articles, editorial, and special sections.
                </p>
                <p className="text-[#6B4A2E] text-sm">
                  File size: 12.5 MB • Format: PDF • Updated: {issueDetails.publicationDate}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/downloads/issue-5-2.pdf"
                  className="px-10 py-4 bg-[#6B4A2E] text-white font-semibold rounded-full hover:bg-[#5A3D26] transition-colors shadow-lg text-lg inline-flex items-center gap-3"
                >
                  <span>⬇️</span>
                  <span>Download Full Issue (PDF)</span>
                </Link>
                <Link
                  href="/archives"
                  className="px-10 py-4 border-2 border-[#6B4A2E] text-[#6B4A2E] font-semibold rounded-full hover:bg-[#6B4A2E]/10 transition-colors text-lg"
                >
                  Browse Archive
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Related Information */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <div className="bg-white p-12 rounded-xl shadow-lg border border-[#E6DDCF]">
              <h2 className="font-serif text-2xl text-[#3F2A1D] mb-10 text-center">
                Related Information
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link href="/archive" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">📚</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Previous Issues
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Browse our archive of past issues and articles
                    </p>
                  </div>
                </Link>
                
                <Link href="/login" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">📝</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Submit Article
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Submit your research for upcoming issues
                    </p>
                  </div>
                </Link>
                
                <Link href="/editorial" className="group">
                  <div className="bg-[#F6F1E8] p-8 rounded-lg border border-[#E6DDCF] hover:border-[#C8A45D] transition-colors text-center h-full">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className="font-semibold text-lg text-[#3F2A1D] mb-3">
                      Editorial Board
                    </h3>
                    <p className="text-[#4A4036] text-sm">
                      Meet our editorial team and reviewers
                    </p>
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
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <div className="inline-block p-4 bg-[#F6F1E8] rounded-full mb-6">
              <span className="text-2xl">ℹ️</span>
            </div>
            <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
              Citation Information
            </h3>
            <p className="text-[#4A4036] max-w-2xl mx-auto">
              To cite articles from this issue, please use the provided DOI links. All articles are published under Creative Commons Attribution 4.0 International License (CC BY 4.0).
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}