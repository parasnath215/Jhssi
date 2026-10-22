import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialBoardSection from "@/components/editorial/EditorialBoardSection";
import EditorialInfo from "@/components/editorial/EditorialInfo";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Editorial Team | JHSSI Journal",
  description: "Meet the editorial board of JHSSI Journal",
};

export default function EditorialTeamPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      <EditorialHeader />
      <EditorialBoardSection />
      <EditorialInfo />
      <Footer />
    </div>
  );
}