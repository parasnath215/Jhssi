import DisclaimerContent from "@/components/disclaimer/DisclaimerContent";
import DisclaimerHeader from "@/components/disclaimer/DisclaimerHeader";
import DisclaimerEditor from "@/components/disclaimer/DisclaimerEditor";
import DisclaimerFooter from "@/components/disclaimer/DisclaimerFooter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Disclaimer | Journal of Humanities and Social Sciences Invention",
  description: "Legal disclaimer and publication ethics statement for JHSSI journal",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
        <Navigation />
      <DisclaimerHeader />
      <DisclaimerContent />
      <DisclaimerEditor />
      <DisclaimerFooter />
      <Footer />
    </div>
  );
}