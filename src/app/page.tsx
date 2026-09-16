import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DashboardPreview from "@/components/DashboardPreview";
import { AICopilotSection, FoodPlannerSection, OrchestratorSection } from "@/components/Modules";
import EnergySection from "@/components/EnergySection";
import ArchitectureSection from "@/components/ArchitectureSection";
import SecurityMatrix from "@/components/SecurityMatrix";
import RoiCalculator from "@/components/RoiCalculator";
import { CTA, Footer } from "@/components/CtaFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
        <OrchestratorSection />
        <FoodPlannerSection />
        <AICopilotSection />
        <EnergySection />
        <ArchitectureSection />
        <SecurityMatrix />
        <RoiCalculator />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
