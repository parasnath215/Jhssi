"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DisclaimerFooter() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          
          {/* Last Updated */}
          <motion.div 
            className="mt-8 pt-8 border-t border-[#E6DDCF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-[#7A6F63] text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-[#7A6F63] text-xs mt-2">
              © {new Date().getFullYear()} Journal of Humanities & Social Sciences Invention
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}