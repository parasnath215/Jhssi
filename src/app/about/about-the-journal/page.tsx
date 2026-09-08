import HeroSection from "@/components/about/HeroSection";
import IntroductionSection from "@/components/about/IntroductionSection";
import AimsScopeSection from "@/components/about/AimsScopeSection";
import EditorialPolicySection from "@/components/about/EditorialPolicySection";
import CommitmentSection from "@/components/about/CommitmentSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About JHSSI | Journal of Humanities and Social Sciences Invention",
  description: "Learn about JHSSI journal - an international, peer-reviewed, open-access journal dedicated to high-quality research in Humanities and Social Sciences.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
        <Navigation />
      <HeroSection />
      <IntroductionSection />
      <AimsScopeSection />
      <EditorialPolicySection />
      <CommitmentSection />
        <Footer />
    </div>
  );
}