import Link from "next/link";
import Image from "next/image";
import AdPlacement from "./ads/AdPlacement";

export default function Hero() {
  return (
    <section className="relative h-[100vh] mt-0 flex items-center">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <img
          src="/photos/hero-full.png"
          alt="Scholarly books and a globe representing global research"
          className="w-full h-full object-cover"

        />
        </div>
      
      {/* Left Content Overlay */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-12">
        <div className="max-w-2xl">
          {/* Two Lines of Heading */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#503221] leading-tight mb-6 -mt-4">
            Journal <span className="italic">of</span> <span>Humanities</span><br /> 
            <span className="italic">and</span> <span>Social Sciences Invention</span>
          </h1>
          
          {/* Separator Line - Center aligned to text */}
          <div className="relative flex items-center my-8">
            <div className="flex-grow h-px bg-[#C8A45D]"></div>
            <div className="mx-4">
              
            </div></div>
          
          {/* Subtext Line 1 */}
          <p className="font-serif italic text-xl md:text-2xl text-[#6e4126] mb-4">
            Interdisciplinary Perspectives for a Changing World
          </p>
          
          {/* Subtext Line 2 */}
          <p className="text-[#6e4126] text-xs md:text-lg leading-relaxed mb-6 max-w-xl">
            An international, peer-reviewed, open-access journal fostering original 
            research and dialogue across the humanities and social sciences.
          </p>
          
          {/* Two CTAs */}
          <div className="flex flex-wrap gap-6">
            <Link
              href="/current"
              className="bg-[#6B4A2E] text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-[#3F2A1D]/30 hover:bg-[#5A3D26] transition-all hover:shadow-xl hover:shadow-[#3F2A1D]/40 hover:scale-105"
            >
              View Current Issue
            </Link>
            <Link
              href="/login"
              className="border-2 border-[#6B4A2E] text-[#6B4A2E] px-8 py-3.5 rounded-full font-semibold hover:bg-[#F4EFE7]/10 transition-all hover:scale-105"
            >
              Submit Manuscript
            </Link>
          </div>
        </div>
        {/* ad placed here */}
          
          <AdPlacement
            placement="sidebar"
            className="w-full h-24 mb-8 lg:mb-0"
          />
          
      </div>
    </section>
  );
}