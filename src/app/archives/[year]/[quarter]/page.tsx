import Link from "next/link";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
import archivesData from "@/data/archives.json";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

export default async function QuarterPage({
  params
}: {
  params: Promise<{ year: string; quarter: string }>
}) {
  const { year, quarter } = await params;
  const decodedQuarter = decodeURIComponent(quarter);

  const yearData = archivesData.find(y => y.year === year);
  const quarterData = yearData?.quarters?.find(q => q.name === decodedQuarter);

  // Still render the page even if no papers exist yet, so we can show "No papers published"
  
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-8 flex items-center gap-4">
          <Link 
            href="/archives"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-[#6B4A2E] hover:text-white transition-colors duration-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3F2A1D]">
              {decodedQuarter.replace(new RegExp(`-${year}`, 'g'), '')} {year}
            </h1>
            <p className="text-gray-500 mt-1">Research Papers Collection</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DCC4] p-8">
          <div className="flex flex-col gap-4">
            {quarterData && quarterData.papers && quarterData.papers.length > 0 ? (
              quarterData.papers.map((paper, idx) => (
                <div
                  key={idx}
                  className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 text-red-500 bg-red-50 p-2 rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif font-semibold text-gray-900 text-lg leading-tight mb-2">
                        {paper.name.replace('.pdf', '')}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium">PDF Document</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                      href={paper.url}
                      target="_blank"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-50 text-gray-700 hover:text-[#6B4A2E] hover:bg-[#6B4A2E]/10 rounded-lg transition-colors font-medium border border-gray-200"
                    >
                      <Eye size={18} />
                      View
                    </Link>
                    <Link
                      href={paper.url}
                      download
                      target="_blank"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#6B4A2E] text-white hover:bg-[#5A3D26] rounded-lg transition-colors font-medium shadow-sm"
                    >
                      <Download size={18} />
                      Download
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">No Papers Yet</h3>
                <p className="text-gray-500">There are no research papers published for this quarter yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
