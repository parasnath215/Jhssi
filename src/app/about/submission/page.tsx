
import SubmissionCompliance from "@/components/submission/SubmissionCompliance";
import ArticleTypes from "@/components/submission/ArticleTypes";
import PreparationGuidelines from "@/components/submission/PreparationGuidelines";
import TextStructure from "@/components/submission/TextStructure";
//import ReferencesSection from "@/components/submission/ReferenceSection";
import TablesFiguresSection from "@/components/submission/TablesFiguresSection";
import SupplementaryInfoSection from "@/components/submission/SupplementaryInfoSection";
import FinalChecklist from "@/components/submission/FinalChecklist";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubmissionHeader from "@/components/submission/SubmissionHeader";
import ReferenceSection from "@/components/submission/ReferenceSection";

export const metadata = {
  title: "Submission Guidelines | JHSSI Journal",
  description: "Complete author submission guidelines for the Journal of Humanities and Social Sciences Invention",
};

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-white">
        <Navigation />
      <SubmissionHeader />
      <SubmissionCompliance />
      <ArticleTypes />
      <PreparationGuidelines />
      <TextStructure />
      <ReferenceSection />
      <TablesFiguresSection />
      <SupplementaryInfoSection />
      <FinalChecklist />
      <Footer/>
    </div>
  );
}