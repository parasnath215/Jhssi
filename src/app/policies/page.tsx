"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, FileCheck, Ban, Search, Eye, Clock, Users, FileX, CheckCircle } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icons";

export default function AntiPlagiarismPolicyPage() {
  const policySections = [
    {
      icon: <Icon name="formatting" className="text-[#059669]" size={120} />,
      title: "Zero Tolerance Policy",
      content: "Journal of Humanities and Social Sciences Invention maintains an extremely strict stance against plagiarism. We will not accept plagiarized articles for publication under any circumstances.",
      variant: "danger"
    },
    {
      icon: <Icon name="originality" className="text-[#059669]" size={120} />,
      title: "Author Consequences",
      content: "If the journal identifies a plagiarized submission, we reserve the right to ban all authors associated with the article from future publications in our journal.",
      variant: "danger"
    },
    {
      icon:<Icon name="fileformat" className="text-[#059669]" size={120} />,
      title: "Author Responsibility",
      content: "All authors and researchers are strongly advised to thoroughly check their manuscripts for plagiarism before submission to avoid serious consequences.",
      variant: "success"
    }
  ];

  const detectionProcess = [
    {
      step: "01",
      title: "Initial Screening",
      description: "All submitted manuscripts undergo automated plagiarism detection using industry-standard software.",
      icon:<Icon name="fileformat" className="text-white" size={80} />
    },
    {
      step: "02",
      title: "Comprehensive Check",
      description: "We conduct vigorous checks against published literature, databases, and internet sources.",
      icon: <Icon name="guidelines" className="text-white" size={20} />
    },
    {
      step: "03",
      title: "Peer Review Integration",
      description: "Plagiarism check is completed before manuscripts proceed to the peer review process.",
      icon: <Icon name="materials" className="text-white" size={20} />
    },
    {
      step: "04",
      title: "Final Verification",
      description: "All identified issues are thoroughly reviewed by editorial staff before final decision.",
      icon: <Icon name="results" className="text-white" size={20} />
    }
  ];

  const severityLevels = [
    {
      level: "Minor",
      percentage: "1-10%",
      description: "Accidental or minimal similarity",
      action: "Request for revision and proper citation",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      level: "Moderate",
      percentage: "11-25%",
      description: "Significant unattributed content",
      action: "Rejection with resubmission allowed after revision",
      color: "bg-orange-100 text-orange-800"
    },
    {
      level: "Severe",
      percentage: "26-50%",
      description: "Major portions copied without attribution",
      action: "Immediate rejection and author notification",
      color: "bg-red-100 text-red-800"
    },
    {
      level: "Critical",
      percentage: "51%+",
      description: "Complete or near-complete plagiarism",
      action: "Permanent author ban and notification to institution",
      color: "bg-red-800 text-white"
    }
  ];

  const preventiveMeasures = [
    "Use proper citation for all borrowed ideas",
    "Employ quotation marks for direct quotes",
    "Paraphrase effectively with attribution",
    "Use plagiarism detection tools before submission",
    "Maintain detailed research notes",
    "Acknowledge all sources in references",
    "Understand fair use limitations",
    "Keep records of all source materials"
  ];

  const consequences = [
    {
      title: "Immediate Rejection",
      description: "Plagiarized manuscripts are rejected without review",
      icon: <Icon name="fileformat" className="text-[#B91C1C]" size={120} /> 
    },
    {
      title: "Author Blacklisting",
      description: "All co-authors may be banned from future submissions",
      icon: <Icon name="originality" className="text-[#B91C1C]" size={120} />
    },
    {
      title: "Institutional Notification",
      description: "Institutions may be informed of serious cases",
      icon: <Icon name="illustrations" className="text-[#B91C1C]" size={120} />
    },
    {
      title: "Publication Retraction",
      description: "Published articles may be retracted if plagiarism is discovered",
      icon: <Icon name="results" className="text-[#B91C1C]" size={120} />
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navigation/>
      {/* Hero Section - Similar to Archives Header */}
      <section className="relative h-[80vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <img src="/photos/img4.jpeg" alt="Anti-Plagiarism Hero" className="w-full h-full object-cover" />
          </div>
        
        <div className="relative z-10 w-full max-w-4xl -mt-6mx-auto  px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-transparent  p-8 rounded-2xl shadow-lg   text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#3F2A1D] mb-4">
            Anti Plagiarism <br />Policy
          </h1>
          
          <div className="h-1 w-16 bg-[#C8A45D] mx-auto mb-6"></div>
          
          <p className="text-[#4A4036] text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
            Our comprehensive anti-plagiarism policy <br />ensures academic integrity and originality <br /> in all submissions.</p>
          
        </motion.div>
      </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Policy Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="border border-[#E6DDCF] rounded-xl p-8 bg-[#F6F1E8]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-2/3">
                <h2 className="font-serif text-3xl text-[#3F2A1D] mb-6">
                  Our Strict Plagiarism Policy
                </h2>
                <div className="space-y-4 text-[#4A4036] leading-relaxed">
                  <p className="p-4 bg-red-50 border-l-4 border-[#B91C1C] rounded-r">
                    <strong>Journal of Humanities and Social Sciences Invention is extremely strict in matters of Plagiarism.</strong> Journal of Humanities and Social Sciences Invention will not accept plagiarized articles for publication.
                  </p>
                  <p className="p-4 bg-red-50 border-l-4 border-[#B91C1C] rounded-r">
                    <strong>If the journal finds a submitted plagiarized article, then it may ban all the authors responsible for the article in publishing with it.</strong> So, all the authors/researchers are requested to check their respective articles for plagiarism before submitting for publishing.
                  </p>
                  <p className="p-4 bg-white border-l-4 border-[#6B4A2E] rounded-r">
                    <strong>All received manuscripts will be vigorously checked for plagiarism.</strong> We use software for detection of plagiarism before forwarding the manuscripts for peer review process.
                  </p>
                </div>
              </div>
              <div className="md:w-1/3 bg-gradient-to-b from-white to-[#F6F1E8] border border-[#E6DDCF] rounded-xl p-6">
                <AlertTriangle className="text-[#B91C1C] mb-4" size={32} />
                <h3 className="text-xl font-bold text-[#3F2A1D] mb-3">Critical Warning</h3>
                <p className="text-[#4A4036]">
                  Plagiarism is considered academic misconduct with serious consequences. Ensure originality is maintained throughout your submission.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Policy Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl text-[#3F2A1D] text-center mb-12">
            Core Policy Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {policySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className={`border border-[#E6DDCF] rounded-xl p-6 ${
                  section.variant === 'danger' 
                    ? 'bg-gradient-to-br from-red-50 to-red-100' 
                    : 'bg-gradient-to-br from-green-50 to-green-100'
                }`}
              >
                <div className="p-3 mb-6">
                  {section.icon}
                </div>
                <h3 className="font-serif text-xl font-medium text-[#3F2A1D] mb-4">
                  {section.title}
                </h3>
                <p className="text-[#4A4036]">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detection Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[#3F2A1D] to-[#6B4A2E] rounded-xl p-8 text-white">
            <div className="flex items-center gap-4 mb-10">
              <Search className="text-[#C8A45D]" size={32} />
              <h2 className="font-serif text-3xl">
                Our Plagiarism Detection Process
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {detectionProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="relative"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-medium text-[#C8A45D]">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                    <p className="text-white/90 text-xs">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preventive Measures */}
            <div className="bg-gradient-to-br from-[#6B4A2E] to-[#3F2A1D] rounded-xl p-8 text-white">
              <div className="flex items-center gap-4 mb-8">
                <Shield className="text-[#C8A45D]" size={32} />
                <h2 className="font-serif text-2xl">Preventive Measures</h2>
              </div>
              <div className="space-y-4">
                {preventiveMeasures.map((measure, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full mt-2"></div>
                    <span>{measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consequences */}
            <div className="border border-[#E6DDCF] rounded-xl p-8 bg-white">
              <div className="flex items-center gap-4 mb-8">
                <AlertTriangle className="text-[#B91C1C]" size={32} />
                <h2 className="font-serif text-2xl text-[#3F2A1D]">Consequences of Plagiarism</h2>
              </div>
              <div className="space-y-6">
                {consequences.map((consequence, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="p-2 ">
                      {consequence.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#3F2A1D] mb-1">{consequence.title}</h3>
                      <p className="text-[#4A4036] text-sm">{consequence.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Severity Levels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl text-[#3F2A1D] text-center mb-12">
            Plagiarism Severity Levels & Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {severityLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className={`border border-[#E6DDCF] rounded-xl p-6 ${level.color.includes('red-800') ? 'border-2 border-red-700' : ''}`}
              >
                <div className={`px-4 py-2 rounded-full text-sm font-semibold w-fit mb-4 ${level.color}`}>
                  {level.level}
                </div>
                <div className="text-2xl font-bold text-[#3F2A1D] mb-2">{level.percentage}</div>
                <p className="text-[#4A4036] text-sm mb-3">{level.description}</p>
                <div className="text-sm font-medium text-[#3F2A1D]">{level.action}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="bg-gradient-to-br from-[#3F2A1D] to-[#6B4A2E] rounded-xl p-10 text-center text-white">
            <h2 className="font-serif text-3xl mb-6">
              Submit With Confidence
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Ensure your manuscript meets our strict originality standards before submission
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3 bg-white text-[#3F2A1D] font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Submit Manuscript
              </Link>
              <Link
                href="/authors"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                View Author Guidelines
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/80">
                For questions about our plagiarism policy, contact our editorial office
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </main>
  );
}