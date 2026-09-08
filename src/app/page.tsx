import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import FeatureSection from "@/components/FeatureSection";
import LatestIssueSection from "@/components/LatestIssueSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal of Humanities & Social Sciences Invention | Interdisciplinary Research",
  description: "An international, peer-reviewed, open-access journal fostering original research and critical dialogue across humanities and social sciences.",
  keywords: ["humanities journal", "social sciences", "academic research", "peer-reviewed", "open access", "interdisciplinary studies"],
  authors: [{ name: "JHSSI Editorial Board" }],
  openGraph: {
    type: "website",
    title: "Journal of Humanities & Social Sciences Invention",
    description: "Advancing humanistic inquiry through interdisciplinary perspectives",
    siteName: "JHSSI Journal",
  },
};

export default async function HomePage() {
  // Server-side data fetching would go here
  // const data = await getJournalData()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO-friendly semantic structure */}
      <header className="sticky top-0 z-50">
        <Navigation />
      </header>
      
      <main className="flex-grow">
        {/* Hero Section with Viewport Height */}
        <section aria-label="Journal Introduction" className="h-screen">
          <Hero />
        </section>
        <section aria-label="Key Features of JHSSI">
          <FeatureSection />
        </section>
        {/* Journal Information Section */}
        <article>
          <AboutSection />
        </article>
        <section>
          <LatestIssueSection />
        </section>
        
        {/* Additional content sections would go here */}
        {/* Example: Latest Issues, Featured Articles, etc. */}
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}