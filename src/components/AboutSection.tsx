import AdPlacement from "@/components/ads/AdPlacement";

export default function AboutSection() {
  return (
    <section className="min-h-[80vh] flex items-center px-6 -mt-16 bg-white">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Clean Journal Cover Display */}
          <div className="relative">
            {/* Main Image with subtle shadow */}
            <div className="aspect-[3/4] max-w-md mx-auto">
              {/* Placeholder - Replace with actual image */}
              <img
                src="/photos/photo-cover.svg"
                alt="Journal Cover"
                className="w-full h-full object-cover "
              />
            </div>
            
            </div>

          {/* Clean Text Content */}
          <div>
            <h2 className="font-serif text-4xl text-[#3F2A1D] mb-4">
              About the
              <span className="italic"> Journal </span>
            </h2>
            
            <div className="h-px w-16 bg-[#D9C8A3] mb-6"></div>
            
            <div className="space-y-6">
              <p className="text-[#4A4036] leading-[1.8]">
                <span className="font-serif italic text-[#3F2A1D]">The Journal of Humanities and Social Sciences Invention (JHSSI)</span> is an international, peer-reviewed, open-access journal dedicated to the advancement of high-quality research in the Humanities and Social Sciences.
              </p>
              
              <p className="text-[#4A4036] leading-[1.8]">
                Published quarterly, JHSSI serves as a global forum for theoretical innovation, empirical research, and interdisciplinary dialogue addressing contemporary social, cultural, political, and developmental issues.
              </p>
            </div>
            
            {/* Simple metrics */}
            <div className="mt-8 pt-8 border-t border-[#E6DDCF]">
              <div className="flex gap-8">
                <div>
                  <div className="font-serif text-2xl text-[#6B4A2E]">Quarterly</div>
                  <div className="text-[#7A6F63] text-sm">Publication</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-[#6B4A2E]">Open</div>
                  <div className="text-[#7A6F63] text-sm">Access</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-[#6B4A2E]">Global</div>
                  <div className="text-[#7A6F63] text-sm">Forum</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}