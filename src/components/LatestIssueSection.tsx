import Link from "next/link";

export default function LatestIssueSection() {
  const currentIssue = {
    volume: 12,
    issue: 3,
    year: 2024,
    month: "July-September",
    articlesCount: 8,
    theme: "Digital Humanities & Social Transformation",
    featuredArticles: [
      {
        id: 1,
        title: "AI and the Future of Historical Research",
        authors: ["E. Rodriguez", "J. Wilson"],
        doi: "10.12345/jhssi.2024.12345",
        pages: "45-68",
        category: "Digital Humanities"
      },
      {
        id: 2,
        title: "Cultural Heritage Preservation",
        authors: ["C. Wei", "M. Schmidt"],
        doi: "10.12345/jhssi.2024.12346",
        pages: "69-92",
        category: "Cultural Studies"
      },
      {
        id: 3,
        title: "Ethics of Digital Reproduction",
        authors: ["A. Chen", "R. Johnson"],
        doi: "10.12345/jhssi.2024.12347",
        pages: "93-116",
        category: "Ethics"
      },
      {
        id: 4,
        title: "Social Media Discourse Analysis",
        authors: ["S. Patel", "L. Garcia"],
        doi: "10.12345/jhssi.2024.12348",
        pages: "117-140",
        category: "Sociology"
      }
    ]
  };

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header - Compact */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px flex-grow bg-[#E6DDCF]"></div>
            <h2 className="font-serif text-4xl text-[#3F2A1D] whitespace-nowrap">
              Current 
              <span className="italic"> Issue</span>
            </h2>
            <div className="h-px flex-grow bg-[#E6DDCF]"></div>
          </div>
          <p className="text-center text-[#7A6F63] text-sm">
            Volume {currentIssue.volume} • Issue {currentIssue.issue} • {currentIssue.month} {currentIssue.year}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Left Column: Cover + Details */}
          <div className="space-y-5">
            
            {/* Cover Card */}
            <div className="border border-[#E6DDCF] rounded-lg p-5 bg-[#F6F1E8]">
              <div className="flex items-center gap-5">
                {/* Smaller Image */}
                <div className="flex-shrink-0 w-32 h-32 rounded border border-[#D9C8A3] overflow-hidden bg-gradient-to-br from-[#6B4A2E] to-[#3F2A1D]">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="font-serif text-2xl">JHSSI</div>
                      <div className="text-xs opacity-80 mt-1">Vol {currentIssue.volume}</div>
                    </div>
                  </div>
                </div>
                
                {/* Volume Details */}
                <div>
                  <div className="text-[#4A4036] font-medium text-lg">
                    Vol. {currentIssue.volume}, Issue {currentIssue.issue}
                  </div>
                  <div className="text-[#7A6F63] text-sm mt-1">
                    {currentIssue.month} {currentIssue.year}
                  </div>
                  <div className="mt-3 text-xs text-[#C8A45D] font-medium">
                    {currentIssue.theme}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="border border-[#E6DDCF] rounded-lg p-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-serif text-xl text-[#3F2A1D]">{currentIssue.articlesCount}</div>
                  <div className="text-[#7A6F63] text-xs mt-1">Articles</div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-xl text-[#3F2A1D]">140+</div>
                  <div className="text-[#7A6F63] text-xs mt-1">Pages</div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-xl text-[#3F2A1D]">24</div>
                  <div className="text-[#7A6F63] text-xs mt-1">Authors</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/issue/current"
                className="block w-full bg-[#6B4A2E] text-white py-3 rounded text-sm font-medium text-center hover:bg-[#5A3D26] transition-colors"
              >
                Browse Full Issue
              </Link>
              <Link
                href="/archives"
                className="block w-full border border-[#6B4A2E] text-[#6B4A2E] py-3 rounded text-sm font-medium text-center hover:bg-[#F6F1E8] transition-colors"
              >
                View Archives
              </Link>
            </div>
          </div>

          {/* Right Columns: Articles Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {currentIssue.featuredArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="border border-[#E6DDCF] rounded-lg p-5 hover:border-[#C8A45D] transition-colors"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F6F1E8] flex items-center justify-center">
                        <span className="text-[#6B4A2E] text-sm font-medium">{article.id}</span>
                      </div>
                      <span className="text-xs text-[#7A6F63] px-3 py-1 rounded-full border border-[#E6DDCF]">
                        {article.category}
                      </span>
                    </div>
                    <div className="text-xs text-[#7A6F63]">{article.pages}</div>
                  </div>
                  
                  <h3 className="font-serif text-base text-[#3F2A1D] mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <div className="text-sm text-[#4A4036] mb-4">
                    {article.authors.join(", ")}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#7A6F63] font-mono truncate">
                      {article.doi}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/article/${article.doi}`}
                        className="px-3 py-1 text-xs border border-[#E6DDCF] text-[#6B4A2E] rounded hover:bg-[#F6F1E8] transition-colors"
                      >
                        Abstract
                      </Link>
                      <Link
                        href={`/article/${article.doi}/pdf`}
                        className="px-3 py-1 text-xs bg-[#6B4A2E] text-white rounded hover:bg-[#5A3D26] transition-colors"
                      >
                        PDF
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
            </div>

            {/* Bottom Metrics */}
            <div className="mt-5 p-5 border border-[#E6DDCF] rounded-lg bg-[#F6F1E8]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#4A4036]">Indexed in</div>
                  <div className="text-xs text-[#7A6F63] mt-1">Crossref, Google Scholar, DOAJ</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#4A4036]">Impact Factor</div>
                  <div className="text-xl font-serif text-[#3F2A1D]">3.2</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 text-[#6B4A2E] text-sm font-medium hover:text-[#5A3D26] transition-colors"
          >
            <span>Submit to Next Issue</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}